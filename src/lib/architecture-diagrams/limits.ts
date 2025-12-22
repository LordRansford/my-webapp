export const ARCH_DIAGRAM_LIMITS = {
  maxTotalTextChars: 12_000,
  maxSystemNameChars: 80,
  maxSystemDescriptionChars: 600,
  maxActors: 12,
  maxExternalSystems: 12,
  maxContainers: 24,
  maxDataStores: 12,
  maxDataTypes: 12,
  maxFlows: 30,
} as const;

export const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F]/g;


