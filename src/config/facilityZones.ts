export type FacilityZone = {
  id: string;
  name: string;
  /** Position on the plant image, in percent of image width/height. */
  x: number;
  y: number;
  /** Backend location names (matched case-insensitively) shown in this zone's card. */
  locations: string[];
};

export const FACILITY_IMAGE = {
  src: "/facility/plant-isometric.webp",
  width: 1600,
  height: 902,
};

export const FACILITY_ZONES: FacilityZone[] = [
  { id: "etp", name: "ETP & Gate", x: 25.6, y: 15, locations: ["ETP Inlet", "ETP2"] },
  { id: "cold-room", name: "Cold Room", x: 42.9, y: 27.2, locations: ["Cold Room"] },
  { id: "bottling", name: "Bottling", x: 47.5, y: 21, locations: ["Bottling", "Bottling 2"] },
  { id: "sachet", name: "Sachet", x: 58.2, y: 15.5, locations: ["Sachet", "Sachet 2"] },
  { id: "jc-area", name: "JC Area", x: 67.8, y: 19.7, locations: ["JC Area", "JC Area 2"] },
  {
    id: "boiler-utility",
    name: "Boiler & Utility",
    x: 34,
    y: 43,
    locations: ["Boiler & WTP", "Utility Panel Room 1", "Utility Panel Room 2"],
  },
  { id: "tankfarm", name: "Tankfarm", x: 54.5, y: 57, locations: ["Tankfarm Panel Room"] },
  {
    id: "refinery-panel",
    name: "Refinery Panel Room",
    x: 26,
    y: 57,
    locations: ["Refinery Panel Room 1", "Refinery Panel Room 2", "Refinery Panel Room 3"],
  },
  {
    id: "refinery",
    name: "Refinery",
    x: 18.2,
    y: 62.2,
    locations: ["0 MTR", "6 MTR", "0 MTR 2", "6 MTR 2", "QA Lab"],
  },
  { id: "canteen", name: "Canteen", x: 26.5, y: 78, locations: ["Canteen"] },
];
