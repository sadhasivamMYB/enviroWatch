/** The location the client wants highlighted (big card on Realtime, pinned card on the Facility Map). */
export const HIGHLIGHT_LOCATION = "Boiler & WTP";

export const findHighlightLocation = (locations: any[]) =>
  locations.find(
    (l) => String(l.location_name ?? "").trim().toLowerCase() === HIGHLIGHT_LOCATION.toLowerCase()
  );
