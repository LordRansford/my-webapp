"use client";

import { 
  Lock as FiLock, 
  Shield as FiShield, 
  Key as FiKey, 
  Database as FiDatabase, 
  Server as FiServer, 
  Cloud as FiCloud,
  Code as FiCode,
  Cpu as FiCpu,
  Network as FiNetwork,
  AlertCircle as FiAlertCircle,
  CheckCircle as FiCheckCircle,
  Info as FiInfo,
  Zap as FiZap,
  TrendingUp as FiTrendingUp,
  Users as FiUsers,
  Globe as FiGlobe,
  Activity as FiActivity,
  Target as FiTarget,
  Layers as FiLayers,
  Box as FiBox,
  Award as FiAward,
  Book as FiBook,
  BookOpen as FiBookOpen,
  BookMarked as FiBookMarked,
  Brain as FiBrain,
  Cog as FiCog,
  FileText as FiFileText,
  GitBranch as FiGitBranch,
  Link as FiLink,
  Mail as FiMail,
  MessageSquare as FiMessageSquare,
  PieChart as FiPieChart,
  Settings as FiSettings,
  Star as FiStar,
  Wrench as FiTool,
  Wifi as FiWifi
} from "lucide-react";

const iconMap = {
  lock: FiLock,
  shield: FiShield,
  key: FiKey,
  database: FiDatabase,
  server: FiServer,
  cloud: FiCloud,
  code: FiCode,
  cpu: FiCpu,
  network: FiNetwork,
  alert: FiAlertCircle,
  check: FiCheckCircle,
  info: FiInfo,
  zap: FiZap,
  trending: FiTrendingUp,
  users: FiUsers,
  globe: FiGlobe,
  activity: FiActivity,
  target: FiTarget,
  layers: FiLayers,
  box: FiBox,
  award: FiAward,
  book: FiBook,
  "book-open": FiBookOpen,
  "book-marked": FiBookMarked,
  brain: FiBrain,
  cog: FiCog,
  "file-text": FiFileText,
  "git-branch": FiGitBranch,
  link: FiLink,
  mail: FiMail,
  "message-square": FiMessageSquare,
  "pie-chart": FiPieChart,
  settings: FiSettings,
  star: FiStar,
  tool: FiTool,
  wifi: FiWifi,
};

export default function Icon({ 
  name, 
  size = 20, 
  color = "#667eea",
  className = "",
  style = {}
}) {
  if (!name) {
    return null;
  }
  
  const iconKey = name.toLowerCase();
  const IconComponent = iconMap[iconKey] || FiInfo;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  
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
}

