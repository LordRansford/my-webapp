import SponsorAccessClient from "./SponsorAccessClient";
import { findSponsorLink } from "@/data/employers";

type PageParams = { token: string };

export default async function SponsorAccessPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;
  const resolved = findSponsorLink(resolvedParams.token);
  return <SponsorAccessClient resolved={resolved} token={resolvedParams.token} />;
}
