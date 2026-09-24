# TGA Marketing MCP

MCP server exposing Google Search Console and GA4 data for The Grill Authority
directly to Claude. Google Ads is phase 3, not built yet.

## Tools

- `gsc_query` — Search Console performance (clicks, impressions, CTR, position)
- `gsc_sitemaps` — sitemap status
- `ga4_report` — general GA4 report by metrics/dimensions
- `ga4_booking_confirmed_count` — booking_confirmed event count over a date range

## Prerequisites

1. Google Cloud project with Search Console API and Google Analytics Data API enabled
2. A service account with a downloaded JSON key
3. That service account added as a user on the GSC property (thegrillauthority.com)
   and as a Viewer on the GA4 property (432161524)

## Local setup

```bash
npm install
cp .env.example .env
# paste the service account JSON (as one line) into GOOGLE_SERVICE_ACCOUNT_JSON in .env
npm run dev
```

## Deploy

```bash
vercel
```

In the Vercel project settings, add `GOOGLE_SERVICE_ACCOUNT_JSON` as an environment
variable (paste the full key JSON as one line). Do not commit the key file itself.

Once deployed, the MCP endpoint is `https://<your-vercel-domain>/api/mcp`. Add it as
a custom connector in Claude the same way Project Tracker is connected.

## Next phase

Google Ads API needs real OAuth (service accounts aren't supported there) plus a
developer token at Basic Access. Add once GSC/GA4 are confirmed working.
