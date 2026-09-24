import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { querySearchConsole, listSitemaps } from "../lib/gsc.js";
import { runGa4Report, getBookingConfirmedCount } from "../lib/ga4.js";
import { getConversions, getCampaignPerformance, getSearchTerms } from "../lib/ads.js";

const handler = createMcpHandler((server) => {
  server.tool(
    "gsc_query",
    "Query Google Search Console performance data for thegrillauthority.com (clicks, impressions, CTR, position) over a date range, broken down by dimensions like query, page, country, or device.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
      dimensions: z
        .array(z.enum(["query", "page", "country", "device", "date"]))
        .optional()
        .describe("Defaults to ['query']"),
      rowLimit: z.number().optional().describe("Defaults to 25, max 25000"),
    },
    async ({ startDate, endDate, dimensions, rowLimit }) => {
      const rows = await querySearchConsole({ startDate, endDate, dimensions, rowLimit });
      return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
    }
  );

  server.tool(
    "gsc_sitemaps",
    "List submitted sitemaps and their status for thegrillauthority.com in Search Console.",
    {},
    async () => {
      const sitemaps = await listSitemaps();
      return { content: [{ type: "text", text: JSON.stringify(sitemaps, null, 2) }] };
    }
  );

  server.tool(
    "ga4_report",
    "Run a Google Analytics 4 report for The Grill Authority's property (432161524) over a date range with chosen metrics and dimensions, e.g. sessions, conversions, eventCount by eventName.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
      metrics: z.array(z.string()).optional().describe("Defaults to ['sessions','conversions']"),
      dimensions: z.array(z.string()).optional(),
    },
    async ({ startDate, endDate, metrics, dimensions }) => {
      const report = await runGa4Report({ startDate, endDate, metrics, dimensions });
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    }
  );

  server.tool(
    "ga4_booking_confirmed_count",
    "Get the count of the booking_confirmed custom event (fires on the HCP booking confirmation redirect) over a date range, broken out by event name.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
    },
    async ({ startDate, endDate }) => {
      const report = await getBookingConfirmedCount({ startDate, endDate });
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    }
  );

  server.tool(
    "ads_conversions",
    "Get Google Ads conversion counts and values (e.g. Book appointment / booking_confirmed) for The Grill Authority's account over a date range, broken out by conversion action and day.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
    },
    async ({ startDate, endDate }) => {
      const rows = await getConversions({ startDate, endDate });
      return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
    }
  );

  server.tool(
    "ads_campaign_performance",
    "Get Google Ads campaign-level performance (impressions, clicks, cost, conversions) for The Grill Authority's account over a date range.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
    },
    async ({ startDate, endDate }) => {
      const rows = await getCampaignPerformance({ startDate, endDate });
      return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
    }
  );

  server.tool(
    "ads_search_terms",
    "Get the actual search terms that triggered Google Ads for The Grill Authority over a date range, ranked by clicks. Useful for finding negative keywords and understanding real search intent.",
    {
      startDate: z.string().describe("YYYY-MM-DD"),
      endDate: z.string().describe("YYYY-MM-DD"),
      limit: z.number().optional().describe("Defaults to 50"),
    },
    async ({ startDate, endDate, limit }) => {
      const rows = await getSearchTerms({ startDate, endDate, limit });
      return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
    }
  );
}, {}, {
  basePath: "/api",
  maxDuration: 60,
});

export { handler as GET, handler as POST, handler as DELETE };
