// statsHelpers.js
import { parseISO, isAfter,format, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";

/**
 * Filter bookings by period: "weekly" | "monthly" | "yearly" | "all"
 * Assumes booking.date is ISO string or Date.
 */
export function filterBookingsByPeriod(bookings = [], period = "weekly") {
  if (!bookings || bookings.length === 0) return [];

  const now = new Date();
  let threshold;

  if (period === "weekly") {
    // last 7 days (including today)
    threshold = subDays(now, 7);
  } else if (period === "monthly") {
    // since start of current month
    threshold = startOfMonth(now);
  } else if (period === "yearly") {
    // since start of current year
    threshold = startOfYear(now);
  } else {
    return bookings; // "all"
  }

  return bookings.filter((b) => {
    if (!b?.date) return false;
    const d = typeof b.date === "string" ? parseISO(b.date) : new Date(b.date);
    return isAfter(d, threshold) || d.toDateString() === threshold.toDateString();
  });
}

/** Compute simple summary counts for statuses */
export function computeSummary(bookings = []) {
  const counts = { total: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  bookings.forEach((b) => {
    const s = (b.status || "").toLowerCase();
    if (s === "pending") counts.pending++;
    else if (s === "confirmed") counts.confirmed++;
    else if (s === "completed") counts.completed++;
    else if (s === "cancelled" || s === "canceled") counts.cancelled++;
  });
  return counts;
}

/** Compute status percentages (rounded) */
export function computeStatusPercentages(bookings = []) {
  const summary = computeSummary(bookings);
  const total = summary.total || 1; // avoid div0
  const percent = (n) => Math.round((n / total) * 100);
  return [
    { status: "Pending", percentage: percent(summary.pending) },
    { status: "Confirmed", percentage: percent(summary.confirmed) },
    { status: "Completed", percentage: percent(summary.completed) },
    { status: "Cancelled", percentage: percent(summary.cancelled) },
  ];
}

/** Provider stats:
 * returns array: [{ provider, total, pending, confirmed, completed, cancelled, topService }]
 */
export function computeProviderStats(bookings = []) {
  const map = {}; // providerName -> stats
  bookings.forEach((b) => {
    const pName = b.provider?.name || "Unknown Provider";
    const serviceName = b.service?.name || "Unknown Service";
    if (!map[pName]) {
      map[pName] = { provider: pName, total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, services: {} };
    }
    const rec = map[pName];
    rec.total++;
    const s = (b.status || "").toLowerCase();
    if (s === "pending") rec.pending++;
    else if (s === "confirmed") rec.confirmed++;
    else if (s === "completed") rec.completed++;
    else if (s === "cancelled" || s === "canceled") rec.cancelled++;

    // track service counts for top service
    rec.services[serviceName] = (rec.services[serviceName] || 0) + 1;
  });

  return Object.values(map).map((r) => {
    // compute topService
    const services = r.services;
    const topService = Object.keys(services).reduce((a, b) => (services[a] >= services[b] ? a : b), Object.keys(services)[0] || null);
    return { ...r, topService };
  }).sort((a, b) => b.total - a.total); // sort by total desc
}

export const groupBookingsByDay = (bookings) => {
  const map = {};
  bookings.forEach((b) => {
    const day = format(parseISO(b.date), "MMM d");
    map[day] = (map[day] || 0) + 1;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
};