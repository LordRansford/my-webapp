import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CyberDashboardsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboards/cybersecurity");
  }, [router]);

  return null;
}
