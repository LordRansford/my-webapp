export type Audience = "kids" | "students" | "professionals";

export function isKids(audience: Audience) {
  return audience === "kids";
}

export function isProfessionals(audience: Audience) {
  return audience === "professionals";
}

export function audienceTone(audience: Audience) {
  if (audience === "kids") return "kids";
  if (audience === "students") return "students";
  return "professionals";
}

export function wizardCopy(audience: Audience) {
  if (audience === "kids") {
    return {
      systemNameLabel: "System name",
      systemDescriptionLabel: "What does it do?",
      systemNameExample: "Online toy shop",
      systemDescriptionExample: "Customers browse toys, sign in, and pay. Admins manage products and orders.",
      containersHelp: "A container is a big building block, like a website, an app, or a database.",
      flowsHelp: "A flow is a message or action that moves from one thing to another. Example: Customer logs in.",
      securityHelp:
        "Security is about keeping the right things private and letting the right people in. Mark sensitive data and boundaries carefully.",
      professionalsReminder: null,
    };
  }

  if (audience === "students") {
    return {
      systemNameLabel: "System name",
      systemDescriptionLabel: "Short description",
      systemNameExample: "Customer support platform",
      systemDescriptionExample: "Agents manage tickets. Admins manage users. External login is handled by an identity provider.",
      containersHelp: "A container is a deployable unit, like a web app, API, or worker.",
      flowsHelp: "A flow is a key interaction between actors, systems, containers, or stores.",
      securityHelp: "Capture auth, trust boundaries, admin access, and sensitive data categories. Avoid assumptions.",
      professionalsReminder: null,
    };
  }

  return {
    systemNameLabel: "System name",
    systemDescriptionLabel: "Short description",
    systemNameExample: "Payments and checkout service",
    systemDescriptionExample: "List the system purpose, primary users, key integrations, and what data is processed.",
    containersHelp: "List the deployable units and the main integrations. Avoid internal class level detail.",
    flowsHelp: "Capture the few flows that matter for review. Use precise names and purposeful descriptions.",
    securityHelp: "Be explicit about trust boundaries, auth points, admin paths, and sensitive data crossings.",
    professionalsReminder: "Keep labels crisp. If something is unknown, omit it and record it as an omission.",
  };
}


