import { Eye, FileCheck, Lock, Shield } from "lucide-react";

import type { SecurityFeature } from "./types";

export const securityFeatures: SecurityFeature[] = [
  {
    icon: Shield,
    title: "SOC 2 Type II",
    description: "Independently audited security controls with continuous monitoring.",
  },
  {
    icon: Lock,
    title: "End-to-end encryption",
    description: "AES-256 encryption for data at rest and TLS 1.3 in transit.",
  },
  {
    icon: Eye,
    title: "Zero-trust architecture",
    description: "Every request is authenticated and authorized. No exceptions.",
  },
  {
    icon: FileCheck,
    title: "GDPR & HIPAA",
    description: "Full compliance with data protection and healthcare regulations.",
  },
];
export const certifications: string[] = ["SOC 2", "ISO 27001", "HIPAA", "GDPR", "CCPA"];
