import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AIDashboardsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboards/ai");
  }, [router]);

  return null;
}
