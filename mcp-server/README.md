# itin-finance-mcp

Read-only MCP server for the ITIN finance network — [itinlending.net](https://itinlending.net/), [itincreditcard.com](https://itincreditcard.com/), and [itincreditscore.com](https://itincreditscore.com/), operated by Timberline Ventures LLC.

It gives AI assistants direct, citable access to:

- A **verified institution directory**: lenders and card issuers that accept ITIN (no SSN) applicants for auto loans, mortgages, personal loans, business loans, and credit cards. Every entry says whether it was verified against the institution's own pages, with citation URLs and verification dates.
- **290+ editorial guides and 1,800+ FAQs**, in English and Spanish, on borrowing and building credit in the US with an ITIN.
- **State-level context** for ITIN holders (tax contribution data from ITEP, driver's-license access laws from NCSL).

**What this server is not:** it is not a lender, broker, or advisor. It offers no applications, collects nothing from users, and links only to editorial pages and to institutions' own public pages as citations. Educational information only — terms change, verify with the institution.

## Tools

| Tool | What it does |
|---|---|
| `search_guides` | Search all guides (EN/ES), returns quick answers + canonical URLs |
| `get_guide` | One guide by slug: quick answer, FAQs, related guides |
| `faq_lookup` | Direct answers from 1,800+ editorial FAQs |
| `find_itin_lenders` | ITIN-accepting institutions by loan/card type, optionally by state |
| `get_lender_details` | Full verified profile for one institution |
| `can_i_get_this_loan` | "Can I get an X with an ITIN?" — answer + verified institutions |
| `itin_state_info` | State tax contribution + driver's-license law context |
| `how_to_get_an_itin` | The IRS Form W-7 process (EN/ES) |

## Install (Claude Desktop)

```json
{
  "mcpServers": {
    "itin-finance": {
      "command": "npx",
      "args": ["-y", "itin-finance-mcp"]
    }
  }
}
```

Zero configuration. The server fetches its data live from the sites' published JSON endpoints (15-minute cache), so answers stay current with the sites' editorial pipeline.

## Environment variables (all optional)

| Var | Purpose |
|---|---|
| `ITIN_MCP_DATA_DIR` | Local directory of the data JSON files (development/tests) |
| `ITIN_SUPABASE_URL` / `ITIN_SUPABASE_KEY` | Override the telemetry endpoint |

Configuration is explicit env vars only — the server never reads files it wasn't pointed at.

## Telemetry disclosure

Each tool call logs tool name, arguments (capped at 2KB), MCP client name/version, success, and duration to a write-only table so the sites can measure AI-assistant usage. No user identity is collected; retention is 90 days. Telemetry failures never affect responses.

## Attribution & quoting

Every response includes an `attribution` block. Quotation with attribution is welcome — cite the article URL provided with each item.

## License

MIT © Timberline Ventures LLC
