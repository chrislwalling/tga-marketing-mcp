import { google } from "googleapis";
import { getGoogleAuth } from "./google-auth.js";

const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "432161524";

export async function runGa4Report({
  startDate,
  endDate,
  metrics = ["sessions", "conversions"],
  dimensions = [],
}) {
  const auth = getGoogleAuth();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth });

  const res = await analyticsdata.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map((name) => ({ name })),
      dimensions: dimensions.map((name) => ({ name })),
    },
  });

  return {
    dimensionHeaders: res.data.dimensionHeaders || [],
    metricHeaders: res.data.metricHeaders || [],
    rows: res.data.rows || [],
  };
}

// Convenience wrapper for the exact question that started this build:
// how many booking_confirmed events happened in a date range.
export async function getBookingConfirmedCount({ startDate, endDate }) {
  return runGa4Report({
    startDate,
    endDate,
    metrics: ["eventCount"],
    dimensions: ["eventName"],
  });
}
