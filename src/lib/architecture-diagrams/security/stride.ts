export type StrideItem = {
  id: "spoofing" | "tampering" | "repudiation" | "information-disclosure" | "denial-of-service" | "elevation-of-privilege";
  label: string;
  explanation: string;
};

export const STRIDE_ITEMS: StrideItem[] = [
  { id: "spoofing", label: "Spoofing", explanation: "Could someone pretend to be a trusted user or service?" },
  { id: "tampering", label: "Tampering", explanation: "Could data or messages be changed in transit or at rest?" },
  { id: "repudiation", label: "Repudiation", explanation: "Could actions happen without reliable audit evidence?" },
  { id: "information-disclosure", label: "Information disclosure", explanation: "Could sensitive data be exposed to the wrong party?" },
  { id: "denial-of-service", label: "Denial of service", explanation: "Could the system be overwhelmed or made unavailable?" },
  { id: "elevation-of-privilege", label: "Elevation of privilege", explanation: "Could someone gain permissions they should not have?" },
];


