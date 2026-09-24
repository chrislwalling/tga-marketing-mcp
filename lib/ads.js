import { GoogleAdsApi } from "google-ads-api";

let client;

function getClient() {
  if (!client) {
    client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    });
  }
  return client;
}

function getCustomer() {
  const client = getClient();
  return client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });
}

// Conversion counts (e.g. booking_confirmed imported from GA4) over a date range.
export async function getConversions({ startDate, endDate }) {
  const customer = getCustomer();
  const rows = await customer.query(`
    SELECT
      segments.conversion_action_name,
      segments.date,
      metrics.conversions,
      metrics.conversions_value
    FROM customer
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
  `);
  return rows;
}

// Campaign-level performance over a date range.
export async function getCampaignPerformance({ startDate, endDate }) {
  const customer = getCustomer();
  const rows = await customer.query(`
    SELECT
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY metrics.cost_micros DESC
  `);
  return rows;
}

// Search terms that triggered ads, useful for negative keyword mining and
// understanding what people are actually searching for.
export async function getSearchTerms({ startDate, endDate, limit = 50 }) {
  const customer = getCustomer();
  const rows = await customer.query(`
    SELECT
      search_term_view.search_term,
      campaign.name,
      ad_group.name,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY metrics.clicks DESC
    LIMIT ${limit}
  `);
  return rows;
}
