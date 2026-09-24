import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { querySearchConsole, listSitemaps } from "../lib/gsc.js";
import { runGa4Report, getBookingConfirmedCount } from "../lib/ga4.js";

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
}, {}, {
  basePath: "/api",
  maxDuration: 60,
});

export { handler as GET, handler as POST, handler as DELETE };
