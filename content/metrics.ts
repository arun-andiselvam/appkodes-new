import type { Metric } from "./types";

export const metrics: Metric[] = [
  { 
    value: 2847392, 
    suffix: "", 
    prefix: "",
    label: "API requests today",
  },
  { 
    value: 99, 
    suffix: ".99%", 
    prefix: "",
    label: "Uptime this quarter",
  },
  { 
    value: 23, 
    suffix: "ms", 
    prefix: "",
    label: "Average response time",
  },
  { 
    value: 184, 
    suffix: "", 
    prefix: "",
    label: "Countries served",
  },
];
