import { google } from "googleapis";
import { getGoogleAuth } from "./google-auth.js";

const SITE_URL = process.env.GSC_SITE_URL || "sc-domain:thegrillauthority.com";

export async function querySearchConsole({
  startDate,
  endDate,
  dimensions = ["query"],
  rowLimit = 25,
}) {
  const auth = getGoogleAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions,
      rowLimit,
    },
  });

  return res.data.rows || [];
}

export async function listSitemaps() {
  const auth = getGoogleAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const res = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
  return res.data.sitemap || [];
}
