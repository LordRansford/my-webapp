// Server-only config for credits and compute metering.
// Exported via a JS core module so the repo's Node test runner can import it without TS transpilation.

export {
  FREE_TIER_MS_PER_DAY,
  CREDIT_MS_PER_1,
  MAX_RUN_MS_HARD_CAP,
  MAX_UPLOAD_BYTES_FREE,
  MAX_UPLOAD_BYTES_PAID,
} from "./creditsConfig.core";


