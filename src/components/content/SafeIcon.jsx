"use client";

import { Info } from "lucide-react";

const iconComponents = {
  lock: require("lucide-react").Lock,
  shield: require("lucide-react").Shield,
  key: require("lucide-react").Key,
  database: require("lucide-react").Database,
  server: require("lucide-react").Server,
  cloud: require("lucide-react").Cloud,
  code: require("lucide-react").Code,
  cpu: require("lucide-react").Cpu,
  network: require("lucide-react").Network,
  alert: require("lucide-react").AlertCircle,
  check: require("lucide-react").CheckCircle,
  info: Info,
  zap: require("lucide-react").Zap,
  trending: require("lucide-react").TrendingUp,
  users: require("lucide-react").Users,
  globe: require("lucide-react").Globe,
  activity: require("lucide-react").Activity,
  target: require("lucide-react").Target,
  layers: require("lucide-react").Layers,
  box: require("lucide-react").Box,
  award: require("lucide-react").Award,
  book: require("lucide-react").Book,
  "book-open": require("lucide-react").BookOpen,
  brain: require("lucide-react").Brain,
  cog: require("lucide-react").Cog,
  "file-text": require("lucide-react").FileText,
  "git-branch": require("lucide-react").GitBranch,
  link: require("lucide-react").Link,
  mail: require("lucide-react").Mail,
  "message-square": require("lucide-react").MessageSquare,
  "pie-chart": require("lucide-react").PieChart,
  settings: require("lucide-react").Settings,
  star: require("lucide-react").Star,
  tool: require("lucide-react").Wrench,
  wifi: require("lucide-react").Wifi,
};

export default function SafeIcon({ name, size = 20, color = "#667eea", className = "", style = {} }) {
  try {
    const IconComponent = iconComponents[name?.toLowerCase()] || Info;
    return (
      <IconComponent
        size={size}
        color={color}
        className={className}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "0.5rem",
          ...style,
        }}
        aria-hidden="true"
      />
    );
  } catch (error) {
    console.warn(`Icon "${name}" not found, using default`, error);
    return (
      <Info
        size={size}
        color={color}
        className={className}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "0.5rem",
          ...style,
        }}
        aria-hidden="true"
      />
    );
  }
}

