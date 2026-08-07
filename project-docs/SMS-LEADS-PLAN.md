# SMS-to-Old-Leads Plan (MarketCall link)

**Status: PLANNED — DO NOT SEND YET.** Two hard gates must clear first (see below).
Drafted 2026-08-07 after Bob asked to text past lead-form submitters a
"we matched you with a lender" message containing the MarketCall tracking link.

## The two hard gates (both must clear before any text goes out)

1. **MarketCall source approval.** Campaign #350784's declared traffic source is
   SEO only. Offer 9809 *allows* "Offline SMS" as a source, but the offer rules
   require new sources to be submitted for review before launch. Sending SMS
   traffic on an SEO-only campaign risks voided earnings. → Ask Lidya
   (`lidia@marketcall.net`) to add Offline SMS to #350784 (or approve a parallel
   SMS campaign), and ask whether any **English** personal-loans offer accepts
   SMS (the EN offers checked 2026-08-07 — 9963 et al. — are Social-only).
2. **TCPA consent segmentation.** The lead form has carried a required
   express-written-consent checkbox (autodialed/prerecorded calls **and texts**
   by the site + linked lender partners, DNC override, not a condition of
   purchase) only since **2026-07-15** (commit `f56f9b1`). Consent state is
   stored per lead in Supabase (`tcpa_consent` + row timestamp).
   - **Leads submitted ≥ 2026-07-15 with `tcpa_consent=true`** → textable once
     gate 1 clears.
   - **Leads before 2026-07-15** → implied fine-print consent only. **Never
     marketing-text these.** TCPA statutory damages are $500–$1,500 per text,
     strict liability, active plaintiff bar. A "re-opt-in" text is itself a
     marketing text — no backdoor. These stay on the warm-forward/intro lane.

## Copy rule — the proposed message is deceptive as worded

"We have matched you with a lender" is false: the link goes to a lead-gen
qualification flow, not a completed match. With a vulnerable (ITIN/immigrant)
audience this is UDAP/UDAAP bait. Approved framing instead (truthful):

- **ES:** `ITIN Lending: Hola [FirstName], nos pediste opciones de préstamo con
  ITIN. Ya trabajamos con prestamistas que aceptan solicitudes con ITIN —
  completa una solicitud corta para ver tus opciones: [link] Responde STOP para
  no recibir más mensajes.`
- **EN (only once an EN offer accepts SMS):** `ITIN Lending: Hi [FirstName],
  you asked us about ITIN loan options. Lenders that accept ITIN applications
  are available — complete a short form to see your options: [link] Reply STOP
  to opt out.`

Mandatory elements in every text: sender identity ("ITIN Lending"), reference to
their own inquiry, truthful claim, STOP opt-out. Send window 8am–9pm recipient
local time (TCPA; FL/OK/WA mini-TCPAs are stricter — keep to 8am–8pm to be safe).
Honor STOP immediately and log it.

## List build (from Supabase `leads` table, not Gmail parsing)

Filter: `created_at >= 2026-07-15` AND `tcpa_consent = true` AND loan intent =
personal/cash AND state NOT IN offer 9809's exclusions (AK CT GA IL NY VT WV)
AND not a test/disqualified lead. Dedupe by phone. Tag language (form locale /
loan-type string). Gmail scan 2026-08-07 suggests the qualifying pool is roughly
**10–15 people** — this is a hand-curated batch, not a blast.

## Link — never put the raw trkmcl.com link in a text

✅ **BUILT + DEPLOYED 2026-08-07** (commit `d4b1e3f`): **`https://itinlending.net/es/conectar`**
(`web/src/pages/es/conectar.astro`). Fires GA4 `affiliate_click`
(`network=marketcall`, `medium=` from `?src=`, default `sms`) via `window.itrack`,
then JS-forwards to `PUBLIC_MARKETCALL_PERSONAL_ES` after 350ms; no-JS
meta-refresh + manual button fallback; `noindex`; falls back to `/es/apply` if
the env var is ever unset (kill switch). A future email-approved batch reuses it
as `/es/conectar?src=email`.
Gives us: click counts per batch in GA4, a trustworthy-looking URL (bare
affiliate trackers in SMS scream spam and get carrier-filtered), and a kill
switch if the campaign pauses. MarketCall's Stats tab stays the ground truth for
qualified/payout.

**MarketCall-side attribution (decided 2026-08-07):** the redirect makes SMS
clicks look identical to on-site SEO clicks from MarketCall's side (same
tracking link, itinlending.net referrer) — they cannot tell the channels apart.
So the SMS batch must NOT reuse #350784's link. Preferred fix: a **second
campaign** on offer 9809 with Offline SMS as its declared source → its own
tracking link, wired into `/es/conectar` as `PUBLIC_MARKETCALL_PERSONAL_ES_SMS`
(site buttons keep the SEO link). Fallback only if Lidya prefers one campaign:
a sub-ID param on the existing link (confirm param name with her). Ask her
which when she replies.

## Sending mechanics

At 10–15 recipients: **manual, individualized sends from Bob's phone** (or the
iMessage tool with Bob approving each send). No A2P 10DLC registration needed at
this volume, and manual person-to-person sends avoid the ATDS question entirely.
Do **not** stand up Twilio/A2P for this: carrier 10DLC rules treat third-party
lead-gen/affiliate SMS as restricted content — registration would likely be
rejected and is overkill for a batch this size. Revisit only if volume 10×es.

Log every send (date, number, message, link) and every STOP in
`research/lead-tracker.xlsx`. Archive a screenshot of the live form's consent
checkbox as the paper-trail anchor.

## Execution order

1. Message Lidya: add Offline SMS to #350784 + name an EN offer that takes SMS.
2. Build the redirect page + GA4 event (can ship now, harmless while waiting).
3. Query Supabase for the qualifying list; hand-review it.
4. On Lidya's written OK: send ES batch (manual, quiet hours, logged).
5. EN batch only after an EN campaign with SMS approval exists.
6. Report clicks: GA4 (`medium=sms`) vs MarketCall Stats, fold into daily report.
