// Server-only module - only imported via dynamic import in getServerSideProps
// The actual implementation is in @/server/tools-pages.server.ts
import { getAllToolPages, getToolPage } from "@/server/tools-pages.server";

export { getAllToolPages, getToolPage };

