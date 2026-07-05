#!/usr/bin/env python3
"""ITIN Lead Validation Engine — reference implementation (deterministic core).

This is the model-agnostic scoring brain described in the brief. It NEVER approves
or denies a loan; it validates submitted data, finds inconsistencies, flags fraud
indicators, scores lead quality 0-100, and writes an executive summary.

Design: the SCORE is deterministic (reproducible, testable, ML-ready). In production
an LLM writes the prose executive summary FROM these structured findings (grounded,
no fabrication). This script generates a strong templated summary so the whole thing
runs today with no API key. Ported 1:1 to TypeScript for the production service.
"""
import json, re, os
from collections import defaultdict

# ---- area code -> state (subset covering the batch + common codes) ----
AREA_STATE = {
 "720":"CO","303":"CO","404":"GA","470":"GA","678":"GA","305":"FL","786":"FL","850":"FL",
 "754":"FL","954":"FL","407":"FL","408":"CA","510":"CA","213":"CA","351":"MA","978":"MA",
 "617":"MA","832":"TX","713":"TX","737":"TX","512":"TX","210":"TX","214":"TX","347":"NY",
 "332":"NY","212":"NY","718":"NY","931":"TN","615":"TN","815":"IL","312":"IL","803":"SC",
 "704":"NC","919":"NC","202":"DC",
}
STATE_ABBR = {"colorado":"CO","georgia":"GA","florida":"FL","california":"CA","massachusetts":"MA",
 "texas":"TX","new york":"NY","tennessee":"TN","illinois":"IL","south carolina":"SC",
 "north carolina":"NC","wyoming":"WY","ny":"NY"}
DISPOSABLE = {"mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com","trashmail.com","yopmail.com"}
FAKE_DOMAINS = {"hhh.com","ccc.com","test.com","example.com","aaa.com"}
PLACEHOLDER_NAMES = {"john doe","jane doe","test","asdf","na","n/a"}
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def digits(s): return re.sub(r"\D","",s or "")

def is_gibberish(s):
    t = re.sub(r"[^a-z]","",(s or "").lower())
    if not t: return True
    if len(set(t)) == 1: return True                     # ffff, ccccc
    if len(t) <= 8 and not re.search(r"[aeiou]", t): return True  # gdgdtdh
    return False

def amt_mid(a):
    return {"under $5,000":3000,"$5,000-$10,000":7500,"$10,000-$25,000":17500,"$25,000+":30000}.get((a or "").lower())
def inc_mid(i):
    return {"under $2,000":1500,"$2,000-$4,000":3000,"$4,000-$6,000":5000,"$6,000+":7000}.get((i or "").lower())

# ---------------- MODULES ----------------
def m_identity(l, dup_phone, dup_email):
    flags=[]; score=100; conf=0.9
    email=(l.get("email") or "").strip(); dom=email.split("@")[-1].lower() if "@" in email else ""
    name=(l.get("name") or "").strip()
    ph=digits(l.get("phone")); ac=ph[:3] if len(ph)>=10 else ""
    st_full=(l.get("state") or "").strip().lower()
    st=STATE_ABBR.get(st_full, st_full.upper()[:2] if st_full else "")
    # email
    if not EMAIL_RE.match(email): flags.append("invalid email syntax"); score-=100
    elif dom in DISPOSABLE: flags.append(f"disposable email domain ({dom})"); score-=60
    elif dom in FAKE_DOMAINS or "." not in dom: flags.append(f"fake/unresolvable email domain ({dom})"); score-=70
    # phone
    if len(ph)!=10: flags.append(f"invalid phone ({l.get('phone')!r})"); score-=60; ac=""
    elif ac and ac not in AREA_STATE:
        flags.append(f"unrecognized/unassigned area code ({ac})"); score-=25; conf=0.7
    elif ac and st and AREA_STATE.get(ac) and AREA_STATE[ac]!=st:
        flags.append(f"area code {ac} ({AREA_STATE[ac]}) ≠ stated state ({st})"); score-=10; conf=0.75
    # name
    low=name.lower()
    if is_gibberish(name): flags.append(f"implausible/gibberish name ({name!r})"); score-=70
    elif low in PLACEHOLDER_NAMES: flags.append(f"placeholder name ({name!r})"); score-=55
    elif re.search(r"\d$", name): flags.append("name has trailing digit (form artifact)"); score-=5
    # name vs email local-part
    local=email.split("@")[0].lower() if "@" in email else ""
    toks=[t for t in re.split(r"[^a-z]+", low) if len(t)>=3]
    if toks and local and not any(t in local for t in toks):
        flags.append("email local-part does not match applicant name"); score-=8; conf=min(conf,0.7)
    # duplicates
    if dup_phone: flags.append("duplicate phone in batch"); score-=25
    if dup_email: flags.append("duplicate email in batch"); score-=25
    # notes/metadata already-known flags
    note=(l.get("notes") or "").lower()
    if "test" in note: flags.append("flagged as test entry (metadata)"); score-=40
    if "duplicate" in note: flags.append("flagged as duplicate (metadata)"); score-=20
    score=max(0,min(100,score))
    status="PASS" if score>=70 else "WARNING" if score>=40 else "FAIL"
    reason = "Identity signals clean." if not flags else "; ".join(flags)
    return {"status":status,"score":score,"flags":flags,"reasoning":reason,"confidence":round(conf,2)}

def m_completeness(l):
    req=["name","phone","email","loanType","state"]
    prod=(l.get("loanType") or "").lower()
    qual=["amount","score","income","itin_status"]
    if "business" in prod: qual.append("time_in_business")
    if "mortgage" in prod: qual.append("down_payment")
    if "card" in prod: qual=["score","itin_status"]
    if "credit score" in prod: qual=[]
    fields=req+qual
    filled=[f for f in fields if (l.get(f) or "").strip()]
    pct=round(100*len(filled)/len(fields))
    missing_req=[f for f in req if not (l.get(f) or "").strip()]
    missing_opt=[f for f in qual if not (l.get(f) or "").strip()]
    flags=[]
    if missing_req: flags.append("missing required: "+", ".join(missing_req))
    reason=f"{len(filled)}/{len(fields)} relevant fields provided ({pct}%)."
    if missing_opt: reason+=" Missing qualifiers: "+", ".join(missing_opt)+"."
    return {"status":"PASS" if pct>=80 else "WARNING" if pct>=50 else "FAIL",
            "score":pct,"flags":flags,"reasoning":reason,"confidence":1.0,
            "missing_required":missing_req,"missing_optional":missing_opt}

def m_consistency(l):
    flags=[]; score=100; prod=(l.get("loanType") or "").lower()
    a=amt_mid(l.get("amount")); im=inc_mid(l.get("income")); tib=(l.get("time_in_business") or "").lower()
    if a and im:
        ratio=a/(im*12)  # loan / annual income
        if ratio>=1.0: flags.append(f"requested amount high vs income (~${a:,} vs ~${im*12:,}/yr)"); score-=20
    if "business" in prod and tib in ("not open yet","less than 1 year"):
        flags.append(f"business loan but time in business = {tib!r}"); score-=20
    if "personal" in prod and tib in ("2+ years","1-2 years","less than 1 year") and tib:
        flags.append("time-in-business answered on a personal-loan lead (field mismatch)"); score-=5
    if "card" in prod and (l.get("amount") or "").strip():
        flags.append("credit-card lead carries a loan amount (product/field mismatch)"); score-=10
    dp=(l.get("down_payment") or "").lower()
    if dp in ("20%+","10-20%") and im and im<=3000 and a and a>=17500:
        flags.append("large down payment inconsistent with modest income"); score-=15
    score=max(0,min(100,score))
    status="PASS" if score>=80 else "WARNING" if score>=50 else "FAIL"
    return {"status":status,"score":score,"flags":flags,
            "reasoning":"No contradictions found." if not flags else "; ".join(flags),
            "confidence":0.8}

def m_financial(l):
    a=amt_mid(l.get("amount")); im=inc_mid(l.get("income")); cr=(l.get("score") or "").lower()
    prod=(l.get("loanType") or "").lower()
    if "credit score" in prod:
        return {"label":"N/A","score":0,"flags":[],"reasoning":"Credit-score-check lead — no loan to assess (not applicable).","confidence":1.0,"status":"N/A"}
    if "card" in prod:
        return {"label":"N/A","score":0,"flags":[],"reasoning":"Credit-card lead — loan-amount plausibility not applicable.","confidence":1.0,"status":"N/A"}
    if not a or not im:
        return {"label":"Insufficient","score":50,"flags":["missing amount and/or income"],
                "reasoning":"Unable to determine — requested amount and/or income not provided.","confidence":0.5,"status":"WARNING"}
    ratio=a/(im*12)
    base = 90 if ratio<0.3 else 75 if ratio<0.6 else 55 if ratio<1.0 else 30
    if "680+" in cr: base+=8
    elif "620-680" in cr: base+=0
    elif "580-620" in cr: base-=8
    elif "under 580" in cr: base-=18
    elif "not sure" in cr or not cr: base-=6
    if "business" in prod:
        tib=(l.get("time_in_business") or "").lower()
        base += 6 if tib=="2+ years" else -10 if tib in ("not open yet","less than 1 year") else 0
    base=max(5,min(98,base))
    label = "Very Strong" if base>=85 else "Strong" if base>=70 else "Moderate" if base>=50 else "Weak" if base>=32 else "Very Weak"
    reason=(f"Requested ~${a:,} against ~${im*12:,}/yr income (loan≈{ratio:.0%} of annual income), "
            f"credit band {cr or 'unstated'}. Estimate only — not an approval.")
    return {"label":label,"score":base,"flags":[],"reasoning":reason,"confidence":0.7,"status":"PASS"}

def m_fraud(l, dup_phone, dup_email, ident):
    flags=[]; level="Low"
    idf=" ".join(ident["flags"]).lower()
    note=(l.get("notes") or "").lower()
    crit = ("gibberish" in idf) or ("fake/unresolvable" in idf) or ("test" in note) or ("invalid phone" in idf and "gibberish" in idf)
    high = ("disposable" in idf) or ("placeholder name" in idf)
    med = dup_phone or dup_email or ("duplicate" in note) or ("unrecognized/unassigned area code" in idf)
    for f in ident["flags"]:
        if any(k in f.lower() for k in ["gibberish","fake","disposable","invalid phone","placeholder","duplicate","test","unassigned"]):
            flags.append(f)
    if crit: level="Critical"
    elif high: level="High"
    elif med: level="Medium"
    score={"Low":92,"Medium":62,"High":32,"Critical":6}[level]
    return {"status":level,"score":score,"flags":flags,
            "reasoning":"No fraud indicators." if level=="Low" and not flags else f"{level} risk: "+"; ".join(flags or ['heuristic signals']),
            "confidence":0.85}

# Owner-specified weights (loan-officer first-pass triage)
WEIGHTS = dict(identity=.25, financial=.25, consistency=.20, fraud=.20, completeness=.10)
def grade_of(s):
    return "A+" if s>=93 else "A" if s>=85 else "B" if s>=70 else "C" if s>=55 else "D" if s>=40 else "F"
def priority_of(s):
    return "HIGH" if s>=85 else "MEDIUM" if s>=70 else "LOW" if s>=40 else "DISQUALIFIED"
def reach_of(s):
    return "Excellent" if s>=90 else "Good" if s>=70 else "Fair" if s>=50 else "Poor"

def exec_summary(l, ident, comp, cons, fin, fraud, overall, grade):
    name=l.get("name") or "Applicant"; prod=l.get("loanType") or "loan"; st=l.get("state") or ""
    p1=[]
    p1.append(f"{name} submitted a {prod.lower()} request from {st} via {l.get('source') or 'the site'}.")
    p1.append(f"The application is {comp['reasoning'].split('(')[0].strip().lower() if '(' in comp['reasoning'] else comp['reasoning'].lower()}")
    if fin["label"] not in ("N/A","Insufficient"):
        p1.append(f"Financial plausibility reads {fin['label'].lower()}: {fin['reasoning']}")
    elif fin["label"]=="Insufficient":
        p1.append("Financial plausibility is undeterminable from the data provided.")
    para1=" ".join(p1)
    concerns=[]
    if ident["status"]!="PASS": concerns+= ident["flags"]
    concerns+= cons["flags"]
    if fraud["status"]!="Low": concerns.append(f"{fraud['status'].lower()} fraud risk")
    if concerns:
        para2=("Concerns to note before prioritizing: "+"; ".join(dict.fromkeys(concerns))+
               f". Overall this scores {overall}/100 (grade {grade}); "
               + ("treat as low-priority / likely junk." if overall<40 else
                  "verify the flagged items before follow-up." if overall<70 else
                  "a solid lead worth prompt follow-up despite minor notes."))
    else:
        para2=(f"No identity, consistency, or fraud concerns were detected. Overall this scores "
               f"{overall}/100 (grade {grade}) — a strong, clean lead that should receive prompt follow-up.")
    return para1, para2

def validate(l, dup_phone, dup_email):
    ident=m_identity(l,dup_phone,dup_email)
    comp=m_completeness(l)
    cons=m_consistency(l)
    fin=m_financial(l)
    fraud=m_fraud(l,dup_phone,dup_email,ident)
    fin_applicable = fin["label"]!="N/A"
    w = WEIGHTS if fin_applicable else dict(identity=.25/.75,financial=0,consistency=.20/.75,fraud=.20/.75,completeness=.10/.75)
    overall=round(w["identity"]*ident["score"]+w["financial"]*fin["score"]
                  +w["consistency"]*cons["score"]+w["fraud"]*fraud["score"]
                  +w["completeness"]*comp["score"])
    if fraud["status"]=="Critical": overall=min(overall,12)
    elif fraud["status"]=="High": overall=min(overall,45)
    grade=grade_of(overall); priority=priority_of(overall); reach=reach_of(ident["score"])
    avgconf=(ident["confidence"]+comp["confidence"]+cons["confidence"]+fin["confidence"]+fraud["confidence"])/5
    quality_conf=max(0,min(100,round(overall*(0.75+0.25*avgconf))))
    p1,p2=exec_summary(l,ident,comp,cons,fin,fraud,overall,grade)
    return {"name":l.get("name"),"state":l.get("state"),"product":l.get("loanType"),"source":l.get("source"),
            "overall":overall,"grade":grade,"priority":priority,"reachability":reach,
            "quality_confidence":quality_conf,
            "funding_probability":"Not yet available (requires historical lender outcome data)",
            "fraud_risk":fraud["status"],
            "financial":fin["label"],"identity":ident["status"],"completeness":comp["score"],
            "consistency":cons["status"],
            "modules":{"identity":ident,"completeness":comp,"consistency":cons,"financial":fin,"fraud":fraud},
            "exec_summary":[p1,p2],
            "all_flags":sorted(set(ident["flags"]+comp["flags"]+cons["flags"]+fin["flags"]+fraud["flags"]))}

# ---------------- DATA (the 27 real leads from the sheet) ----------------
LEADS=[
 dict(name="Bryan Villalba",phone="720-966-5593",email="osielortega11@gmail.com",source="itinlending.net",loanType="Personal loan",amount="Under $5,000",score="Under 580",income="$2,000-$4,000",itin_status="ITIN only",time_in_business="Less than 1 year",down_payment="Under 5%",state="Colorado",notes=""),
 dict(name="Khadeen McLean",phone="404-454-1980",email="khadeenmclean@yahoo.com",source="itinlending.net",loanType="Personal loan",amount="$5,000-$10,000",score="Not sure",income="$2,000-$4,000",itin_status="ITIN only",time_in_business="Less than 1 year",down_payment="Under 5%",state="Georgia",notes=""),
 dict(name="Stephen McCann",phone="305-345-0976",email="stephen@totalremoto.com",source="itinlending.net",loanType="Personal loan",amount="Under $5,000",score="620-680",income="$4,000-$6,000",itin_status="ITIN only",time_in_business="2+ years",down_payment="10-20%",state="Wyoming",notes=""),
 dict(name="Ram Kumar Rajagopal",phone="408-786-5525",email="softyram@gmail.com",source="itinlending.net",loanType="Business loan",amount="$25,000+",score="Not sure",income="$4,000-$6,000",itin_status="ITIN only",time_in_business="2+ years",down_payment="5-10%",state="North Carolina",notes=""),
 dict(name="Angelo Modonezi",phone="351-234-8273",email="amodonezi8@yahoo.com",source="itincreditcard.com",loanType="Credit card",score="620-680",itin_status="ITIN only",state="Massachusetts",notes=""),
 dict(name="Felipe Jose Da Costa Queiroz",phone="850-501-3730",email="fandh19861991@gmail.com",source="itincreditcard.com",loanType="Credit card",score="Not sure",itin_status="ITIN only",state="Florida",notes=""),
 dict(name="Marielena Hernandez",phone="832-916-5021",email="marielenahdz.271297@gmail.com",source="itinlending.net",loanType="Personal loan",amount="$5,000-$10,000",score="Not sure",income="$6,000+",itin_status="ITIN only",down_payment="5-10%",state="Texas",notes=""),
 dict(name="Hud Lopes Ferreira",phone="470-233-4657",email="thaysmborges93@hotmail.com",source="itinlending.net",loanType="Personal loan",amount="$5,000-$10,000",score="Not sure",income="$6,000+",itin_status="ITIN only",time_in_business="Less than 1 year",down_payment="5-10%",state="Georgia",notes=""),
 dict(name="Anthony Omenya",phone="754-317-1519",email="anthonyomenya@gmail.com",source="itinlending.net",loanType="Credit card",amount="Under $5,000",score="Not sure",income="$6,000+",itin_status="ITIN only",time_in_business="2+ years",down_payment="20%+",state="Florida",notes=""),
 dict(name="John Doe",phone="404-518-4546",email="cnotes@icloud.com",source="itinlending.net",loanType="Personal loan",amount="$25,000+",score="680+",income="$6,000+",itin_status="ITIN only",state="Illinois",notes="Likely test entry"),
 dict(name="Noelia Ortiz",phone="347-258-6718",email="Noeliaortiz@currently.com",source="itincreditcard.com",loanType="Credit card",score="680+",itin_status="ITIN + SSN",state="New York",notes=""),
 dict(name="Jasmie",phone="546-889-9232",email="jmirukuti@gmail.com",source="itincreditcard.com",loanType="Credit card",score="680+",itin_status="ITIN only",state="Texas",notes=""),
 dict(name="Luis Andrade",phone="638-235-2369",email="luisom13x@gmail.com",source="itincreditcard.com",loanType="Credit card",score="Not sure",itin_status="ITIN only",state="South Carolina",notes=""),
 dict(name="David Dominguez",phone="210-612-4426",email="daviddominguez1201@gmail.com",source="itincreditcard.com",loanType="Credit card",score="620-680",itin_status="ITIN only",state="Texas",notes=""),
 dict(name="Tyler",phone="931-266-3955",email="tyler@kocherfamily.org",source="itinlending.net",loanType="Business loan",amount="$5,000-$10,000",score="Not sure",income="$6,000+",itin_status="ITIN only",time_in_business="2+ years",down_payment="Under 5%",state="Tennessee",notes=""),
 dict(name="Felipe Queiroz",phone="850-501-3730",email="fandt19861991@gmail.com",source="itinlending.net",loanType="Personal loan",amount="Under $5,000",score="Not sure",income="$2,000-$4,000",itin_status="ITIN only",time_in_business="Less than 1 year",down_payment="Under 5%",state="Florida",notes="Possible duplicate of 6/27 credit-card lead"),
 dict(name="MD Oliur Rahman Nahin",phone="737-368-1530",email="iamoliur@icloud.com",source="itinlending.net",loanType="Personal loan",amount="Under $5,000",score="620-680",income="$4,000-$6,000",itin_status="ITIN only",time_in_business="1-2 years",down_payment="Under 5%",state="Texas",notes=""),
 dict(name="Mel Sabharwal3",phone="332-910-8308",email="eyloress@gmail.com",source="itinlending.net",loanType="Credit card",amount="$5,000-$10,000",score="620-680",income="$4,000-$6,000",itin_status="ITIN only",time_in_business="Less than 1 year",state="New York",notes=""),
 dict(name="Jose Mario Rodriguez Diaz",phone="198-029-1570",email="jrodriguezd1985@gmail.com",source="itincreditscore.com",loanType="Credit score check",state="North Carolina",notes="Duplicate submission (2x)"),
 dict(name="Jean Estevan Marin Mariano",phone="978-879-3720",email="info@jeqnmarianohair.com",source="itinlending.net",loanType="Personal loan",state="Massachusetts",notes=""),
 dict(name="Norma Abarca",phone="815-582-5701",email="trujilloj65@gmail.com",source="itinlending.net",loanType="Personal loan",state="Illinois",notes="Duplicate submission (2x)"),
 dict(name="gdgdtdh",phone="cccc",email="cccc@hhh.com",source="itinlending.net",loanType="Auto loan",state="ny",notes="Test entry"),
 dict(name="fff",phone="fff",email="ff@hhh.com",source="itincreditcard.com",loanType="Credit card",state="ff",notes="Test entry"),
 dict(name="ccccc",phone="ccc",email="cccc@ccc.com",source="itincreditscore.com",loanType="Credit score check",state="ccc",notes="Test entry"),
]

# duplicate detection across batch
pc=defaultdict(int); ec=defaultdict(int)
for l in LEADS:
    d=digits(l.get("phone"));
    if len(d)==10: pc[d]+=1
    e=(l.get("email") or "").lower().strip()
    if e: ec[e]+=1
results=[]
for l in LEADS:
    d=digits(l.get("phone")); e=(l.get("email") or "").lower().strip()
    dp = len(d)==10 and pc[d]>1
    de = bool(e) and ec[e]>1
    results.append(validate(l,dp,de))
results.sort(key=lambda r:-r["overall"])

OUT=os.path.dirname(os.path.abspath(__file__))
json.dump(results, open(os.path.join(OUT,"scored-leads.json"),"w"), indent=2, ensure_ascii=False)

# ranked table — component scores per module (Id/Fin/Con/Fr/Cmp) + headline
print(f"{'#':>2} {'Sc':>3} {'QC%':>4} {'Gr':>2} {'Priority':<12} | {'Id':>3} {'Fin':>3} {'Con':>3} {'Fr':>3} {'Cmp':>3} | {'Fraud':<8} {'State':<12} Name")
print("-"*120)
for i,r in enumerate(results,1):
    m=r['modules']
    print(f"{i:>2} {r['overall']:>3} {r['quality_confidence']:>4} {r['grade']:>2} {r['priority']:<12} | "
          f"{m['identity']['score']:>3} {m['financial']['score']:>3} {m['consistency']['score']:>3} {m['fraud']['score']:>3} {m['completeness']['score']:>3} | "
          f"{r['fraud_risk']:<8} {str(r['state'])[:11]:<12} {r['name']}")
print("\nWeights: Identity 25% · Financial 25% · Consistency 20% · Fraud 20% · Completeness 10%")
print("Grades:", {g:sum(1 for r in results if r['grade']==g) for g in ['A+','A','B','C','D','F']})
print("Priority:", {p:sum(1 for r in results if r['priority']==p) for p in ['HIGH','MEDIUM','LOW','DISQUALIFIED']})
