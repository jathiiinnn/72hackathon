const endpoint = import.meta.env.VITE_EVENTS_API_URL || "https://render72.pages.dev/api/test/events";

function normalizeEvent(event, index) {
  const schedule = event.schedule_summary || event.schedules?.[0] || {};
  const date = event.date || event.startDate || event.start_time || (schedule.start_date && `${schedule.start_date}T${schedule.start_time || "00:00"}`) || null;
  return {
    ...event,
    id: event.id || event._id || `event-${index}`,
    title: event.title || event.name || "Untitled event",
    description: event.description || event.blurb || event.summary || "A good reason to step away from the usual.",
    date,
    endDate: schedule.end_date && `${schedule.end_date}T${schedule.end_time || "00:00"}`,
    location: event.location || event.venue || event.schedules?.[0]?.venue || (event.event_mode === "ONLINE" ? "Online" : "Venue to be announced"),
    category: event.category || event.type || "Community",
    image: event.image || event.cover_image_url || event.coverImage || event.banner || null,
    bannerImage: event.banner_image_url || event.image || event.cover_image_url || null,
    imageAlt: event.cover_image_alt || event.banner_image_alt || event.title || event.name || "Event image",
  };
}

export async function getEvents(signal) {
  const response = await fetch(endpoint, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Events service returned ${response.status}`);
  const payload = await response.json();
  const events = Array.isArray(payload) ? payload : payload.events || payload.data || [];

  return events.map(normalizeEvent);
}

export async function getEventById(id, signal) {
  const response = await fetch(`${endpoint}/${encodeURIComponent(id)}`, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Event service returned ${response.status}`);
  const payload = await response.json();
  return normalizeEvent(payload.event || payload.data || payload, 0);
}
