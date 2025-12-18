type AgentLogEvent = {
  [key: string]: unknown;
};

export async function safeAgentLog(event: AgentLogEvent): Promise<void> {
  const url = process.env.NEXT_PUBLIC_AGENT_LOG_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Agent log failed", error);
    }
  }
}
