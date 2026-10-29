import { useEffect } from "react";
import FacilityMap from "./FacilityMap";

// A wall display can stay open for weeks: reload now and then so it picks up new releases.
const RELOAD_EVERY_MS = 6 * 60 * 60 * 1000;

/** /facility-map/live - the same map as the in-app page, with no login and no sidebar. */
const PublicFacilityMap = () => {
  useEffect(() => {
    const id = window.setTimeout(() => window.location.reload(), RELOAD_EVERY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return <FacilityMap publicMode />;
};

export default PublicFacilityMap;
