const endpoint = import.meta.env.VITE_EVENTS_API_URL || "/api/events";

export async function getEvents(signal) {
  const response = await fetch(endpoint, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Events service returned ${response.status}`);
  const payload = await response.json();
  const events = Array.isArray(payload) ? payload : payload.events || payload.data || [];

  return events.map((event, index) => ({
    id: event.id || event._id || `event-${index}`,
    title: event.title || event.name || "Untitled event",
    description: event.description || event.summary || "A good reason to step away from the usual.",
    date: event.date || event.startDate || event.start_time || null,
    location: event.location || event.venue || "Location to be announced",
    category: event.category || event.type || "Community",
    image: event.image || event.coverImage || event.banner || null,
  }));
}
