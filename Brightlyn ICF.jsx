import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { Shield, LayoutDashboard, Library, FileCheck, FileText, Users, BarChart3, AlertTriangle, ChevronRight, ChevronDown, Search, Bell, Settings, LogOut, Plus, Filter, Download, Upload, Eye, Edit, Trash2, Check, X, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowRight, Layers, Globe, Lock, Activity, Zap, ChevronLeft, MoreVertical, RefreshCw, Star, BookOpen, ShieldCheck, Target, Briefcase, Database, Server, Cloud, Key, FileWarning, UserCheck, Menu, ChevronUp, Copy, MessageSquare, Send } from "lucide-react";

// ─── Design Tokens ───
const COLORS = {
  bg: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F2F5",
  border: "#E2E5EB",
  borderLight: "#EEF0F4",
  text: "#1A1D23",
  textSecondary: "#5A6175",
  textMuted: "#8B93A7",
  primary: "#3B6FED",
  primaryLight: "#EBF0FD",
  primaryDark: "#2B52B4",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  info: "#6366F1",
  infoLight: "#EEF2FF",
  accent: "#8B5CF6",
  accentLight: "#F5F3FF",
  navy: "#1E293B",
  chart: ["#3B6FED", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#F97316"],
};

const STATUS_MAP = {
  Compliant: { color: COLORS.success, bg: COLORS.successLight, icon: CheckCircle },
  Partial: { color: COLORS.warning, bg: COLORS.warningLight, icon: AlertCircle },
  "Critical Gap": { color: COLORS.danger, bg: COLORS.dangerLight, icon: XCircle },
  "N/A": { color: COLORS.textMuted, bg: COLORS.surfaceAlt, icon: X },
};

// ─── Mock Data ───
const FRAMEWORKS = ["NIS2", "DORA", "ISO 27001", "GDPR", "ABRO 2026", "ISO 20000-1", "PCI DSS", "CMMI"];

let CURRENT_USER = { name: "Niteen Kumar", role: "Super Admin" };

const DOMAINS = [
  { id: 1, name: "Governance & Enterprise Oversight", icon: Briefcase, controls: 42, compliant: 38, partial: 3, gap: 1 },
  { id: 2, name: "Risk Management", icon: Target, controls: 35, compliant: 28, partial: 5, gap: 2 },
  { id: 3, name: "Policy & Document Management", icon: FileText, controls: 28, compliant: 25, partial: 2, gap: 1 },
  { id: 4, name: "Legal & Regulatory Management", icon: BookOpen, controls: 22, compliant: 18, partial: 3, gap: 1 },
  { id: 5, name: "Third-Party & Supply Chain", icon: Layers, controls: 31, compliant: 22, partial: 6, gap: 3 },
  { id: 6, name: "Cyber Security", icon: Shield, controls: 48, compliant: 40, partial: 5, gap: 3 },
  { id: 7, name: "Cloud & Infrastructure Security", icon: Cloud, controls: 38, compliant: 30, partial: 5, gap: 3 },
  { id: 8, name: "Identity & Access Management", icon: Key, controls: 25, compliant: 22, partial: 2, gap: 1 },
  { id: 9, name: "Data Protection & Privacy", icon: Lock, controls: 33, compliant: 28, partial: 4, gap: 1 },
  { id: 10, name: "Incident & Crisis Management", icon: AlertTriangle, controls: 29, compliant: 24, partial: 3, gap: 2 },
  { id: 11, name: "Business Continuity & DR", icon: RefreshCw, controls: 26, compliant: 20, partial: 4, gap: 2 },
  { id: 12, name: "Audit & Assurance", icon: FileCheck, controls: 20, compliant: 17, partial: 2, gap: 1 },
  { id: 13, name: "Training & Awareness", icon: Users, controls: 18, compliant: 16, partial: 1, gap: 1 },
  { id: 14, name: "Monitoring & Continuous Improvement", icon: Activity, controls: 24, compliant: 20, partial: 3, gap: 1 },
];

let CONTROLS_DATA = [
  { id: "ICF-GOV-001", title: "Establish Information Security Governance Framework", domain: "Governance & Enterprise Oversight", status: "Compliant", frameworks: ["NIS2", "DORA", "ISO 27001", "ABRO 2026"], rigor: "High", owner: "CISO", reviewCycle: "Annual", lastReview: "2025-11-15", evidence: 4, lifecycle: "Active",
    description: "The organization shall establish, implement, maintain, and continually improve a formal information security governance framework that defines the strategic direction, roles, responsibilities, and accountability structures for managing information security across the enterprise. This framework must integrate with the organization's overall corporate governance model and ensure that information security objectives are aligned with business objectives and regulatory obligations.",
    objective: "Ensure that information security is governed through a formal, board-endorsed framework that provides clear accountability, strategic alignment with business goals, and compliance with NIS2 Article 20 (governance and accountability), DORA Article 5 (ICT risk management framework), ISO 27001 Clause 5.1 (Leadership and commitment), and ABRO 2026 Domain 1 (Governance requirements for government suppliers).",
    implementation: "Deploy a governance charter endorsed by the board. Define RACI matrices for security roles. Establish an Information Security Steering Committee with quarterly review cadence. Integrate security KPIs into enterprise risk dashboards. Conduct annual governance maturity assessments.",
    clauses: "NIS2 Art. 20(1), DORA Art. 5(1)-(4), ISO 27001 Cl. 5.1 & 5.2, ABRO 2026 §1.1-1.4" },
  { id: "ICF-GOV-002", title: "Board-Level Cybersecurity Reporting", domain: "Governance & Enterprise Oversight", status: "Compliant", frameworks: ["NIS2", "DORA"], rigor: "High", owner: "CISO", reviewCycle: "Quarterly", lastReview: "2025-12-01", evidence: 3, lifecycle: "Active",
    description: "The organization shall implement a structured cybersecurity reporting mechanism to the board of directors or equivalent governing body. Reports shall include the current threat landscape, compliance posture across all applicable frameworks, material incidents, risk appetite utilization, remediation progress, and investment requirements. The CISO or designated security executive shall present these reports at least quarterly, with ad-hoc reporting for critical incidents within 24 hours.",
    objective: "Ensure that senior leadership and the board maintain situational awareness of the organization's cybersecurity posture, enabling informed decision-making on risk acceptance, resource allocation, and strategic security investments. Satisfies NIS2 Article 20(2) requiring management body accountability and DORA Article 5(2) mandating ICT risk reporting to the management body.",
    implementation: "Create a standardized board reporting template covering: threat intelligence summary, compliance scorecard by framework, open critical/high findings, incident metrics (MTTD, MTTR), security investment ROI, and forward-looking risk projections. Automate data collection from SIEM, GRC, and ticketing systems into the reporting pipeline.",
    clauses: "NIS2 Art. 20(2), DORA Art. 5(2) & Art. 13(5)" },
  { id: "ICF-RSK-001", title: "Integrated Risk Assessment Methodology", domain: "Risk Management", status: "Partial", frameworks: ["ISO 27001", "DORA", "NIS2"], rigor: "High", owner: "CRO", reviewCycle: "Semi-Annual", lastReview: "2025-10-20", evidence: 2, lifecycle: "Active",
    description: "The organization shall adopt and maintain a unified risk assessment methodology that covers information security, ICT operational risks, third-party risks, and regulatory compliance risks. The methodology shall define risk identification, analysis (qualitative and quantitative), evaluation, and treatment processes. Risk assessments shall be conducted at least annually for all critical assets and processes, with trigger-based reassessments following significant changes, incidents, or new regulatory requirements. The methodology must incorporate threat intelligence feeds and consider cascading/systemic risk scenarios as required by DORA.",
    objective: "Provide a consistent, repeatable approach to identifying, assessing, and treating risks across the organization, ensuring that ICT risks are evaluated in the context of business operations and regulatory mandates. Fulfills ISO 27001 Clause 6.1.2 (risk assessment), DORA Article 6 (ICT risk management framework requirements), and NIS2 Article 21 (cybersecurity risk-management measures).",
    implementation: "Implement a risk assessment framework based on ISO 31000 principles, integrated into a GRC platform. Define risk scoring matrices with likelihood and impact scales calibrated to the organization's risk appetite. Establish asset-centric and scenario-based assessment workflows. Train all risk owners on methodology. Automate risk register updates and escalation triggers.",
    clauses: "ISO 27001 Cl. 6.1.2 & 8.2, DORA Art. 6(1)-(8), NIS2 Art. 21(1)" },
  { id: "ICF-RSK-002", title: "ICT Risk Register Maintenance", domain: "Risk Management", status: "Critical Gap", frameworks: ["DORA", "ISO 27001"], rigor: "Critical", owner: "Security Manager", reviewCycle: "Quarterly", lastReview: "2025-09-01", evidence: 0, lifecycle: "In Review",
    description: "The organization shall maintain a comprehensive, centralized ICT risk register that documents all identified ICT-related risks, their assessment outcomes, risk owners, treatment plans, residual risk levels, and acceptance decisions. The register shall be updated continuously as new risks emerge and shall be reviewed formally at least quarterly by the risk management function. Each risk entry must include: risk description, threat source, affected assets/processes, inherent risk score, applied controls, residual risk score, treatment timeline, and regulatory mapping. The register must specifically track ICT concentration risks related to third-party ICT service providers as mandated by DORA.",
    objective: "Maintain an authoritative, auditable record of all ICT risks and their treatment status, enabling proactive risk management and demonstrating regulatory compliance. Directly satisfies DORA Article 6(5) requiring financial entities to maintain an ICT risk register and ISO 27001 Clause 6.1.2 requiring documented risk assessment results.",
    implementation: "Deploy a centralized risk register within the GRC platform with automated workflows for risk identification, assessment, treatment tracking, and escalation. Integrate with vulnerability scanners, threat intelligence platforms, and the CMDB to auto-populate risk data. Establish quarterly risk review boards with documented minutes and decision logs. Implement automated alerts for overdue risk treatments and threshold breaches.",
    clauses: "DORA Art. 6(5), Art. 6(8), ISO 27001 Cl. 6.1.2, Cl. 8.2" },
  { id: "ICF-CYB-001", title: "Network Segmentation & Micro-Segmentation", domain: "Cyber Security", status: "Compliant", frameworks: ["NIS2", "ISO 27001", "PCI DSS", "ABRO 2026"], rigor: "Critical", owner: "Security Architect", reviewCycle: "Annual", lastReview: "2025-11-30", evidence: 5, lifecycle: "Active",
    description: "The organization shall implement network segmentation and micro-segmentation controls to isolate critical systems, sensitive data environments, and high-risk network zones. Segmentation shall be enforced at both the network layer (VLANs, firewalls, SDN policies) and the application/workload layer (micro-segmentation using zero-trust principles). The cardholder data environment (CDE) shall be fully isolated per PCI DSS requirements. Critical infrastructure systems identified under NIS2 shall reside in dedicated security zones with strict ingress/egress controls. All segmentation rules shall be documented, tested annually via penetration testing, and validated against unauthorized lateral movement scenarios.",
    objective: "Minimize the blast radius of security incidents by preventing unauthorized lateral movement between network zones, protecting critical assets and sensitive data through defense-in-depth network architecture. Satisfies NIS2 Article 21(2)(a) (network security), ISO 27001 Annex A 8.22 (network segregation), PCI DSS Requirement 1.3 (CDE isolation), and ABRO 2026 §6.3 (infrastructure security requirements).",
    implementation: "Design and deploy a tiered network architecture with DMZ, internal, management, and restricted security zones. Implement next-gen firewalls with application-aware rules between segments. Deploy micro-segmentation agents on critical workloads using zero-trust policies. Conduct quarterly firewall rule reviews and annual penetration tests validating segmentation effectiveness. Maintain network diagrams with data flow documentation.",
    clauses: "NIS2 Art. 21(2)(a), ISO 27001 A.8.22, PCI DSS Req. 1.3 & 1.4, ABRO 2026 §6.3" },
  { id: "ICF-CYB-002", title: "Vulnerability Management Program", domain: "Cyber Security", status: "Partial", frameworks: ["NIS2", "ISO 27001", "PCI DSS"], rigor: "High", owner: "Security Manager", reviewCycle: "Monthly", lastReview: "2026-01-15", evidence: 3, lifecycle: "Active",
    description: "The organization shall establish and operate a continuous vulnerability management program encompassing automated vulnerability scanning, risk-based prioritization, timely remediation, and verification. The program shall cover all IT assets including servers, endpoints, network devices, cloud resources, containers, and applications. Vulnerability scans shall be performed at least weekly for external-facing assets and monthly for internal assets, with critical vulnerabilities remediated within 48 hours and high-severity within 14 days. The program must include patch management processes, exception/risk acceptance workflows with documented justifications, and integration with threat intelligence for zero-day response. Metrics including scan coverage, mean time to remediate (MTTR), and aging vulnerability trends shall be reported monthly.",
    objective: "Proactively identify and remediate security vulnerabilities before they can be exploited, maintaining the organization's security posture and reducing attack surface exposure. Addresses NIS2 Article 21(2)(e) (vulnerability handling and disclosure), ISO 27001 Annex A 8.8 (management of technical vulnerabilities), and PCI DSS Requirement 6.3 (security vulnerabilities identification and remediation).",
    implementation: "Deploy enterprise vulnerability scanners (authenticated and unauthenticated) across all asset classes. Integrate with CMDB for complete asset coverage validation. Implement risk-based prioritization using CVSS scores enriched with threat intelligence and asset criticality. Automate ticket creation and SLA tracking in ITSM. Conduct monthly vulnerability review meetings and report KPIs to security leadership.",
    clauses: "NIS2 Art. 21(2)(e), ISO 27001 A.8.8, PCI DSS Req. 6.3 & 11.3" },
  { id: "ICF-CLD-001", title: "Cloud Security Posture Management", domain: "Cloud & Infrastructure Security", status: "Critical Gap", frameworks: ["ISO 27001", "DORA", "ABRO 2026"], rigor: "High", owner: "Cloud Architect", reviewCycle: "Quarterly", lastReview: "2025-08-20", evidence: 1, lifecycle: "Draft",
    description: "The organization shall implement a Cloud Security Posture Management (CSPM) program to continuously monitor, assess, and enforce security configurations across all cloud environments (IaaS, PaaS, SaaS). The program shall include automated misconfiguration detection against CIS Benchmarks and provider-specific security baselines, real-time compliance monitoring, identity and entitlement analysis (CIEM), data exposure detection, and automated remediation workflows for critical findings. All cloud workloads must be inventoried, classified, and subject to security controls proportionate to data sensitivity and regulatory requirements. Cloud-specific risks including data residency, shared responsibility gaps, and vendor lock-in shall be assessed and documented.",
    objective: "Ensure that cloud environments maintain a consistently secure configuration state, preventing data exposure, unauthorized access, and compliance violations arising from cloud misconfigurations. Addresses ISO 27001 Annex A 5.23 (cloud services security), DORA Article 6(1) (ICT systems shall be resilient and secure), and ABRO 2026 §7.1 (cloud infrastructure requirements for government suppliers).",
    implementation: "Deploy CSPM tooling across all cloud accounts and subscriptions. Establish cloud security baselines derived from CIS Benchmarks. Configure automated alerts and remediation for critical misconfigurations (public S3 buckets, open security groups, unencrypted storage). Implement IaC security scanning in CI/CD pipelines. Conduct quarterly cloud security reviews with documented findings and remediation tracking.",
    clauses: "ISO 27001 A.5.23, DORA Art. 6(1) & Art. 9(4), ABRO 2026 §7.1-7.4" },
  { id: "ICF-IAM-001", title: "Privileged Access Management", domain: "Identity & Access Management", status: "Compliant", frameworks: ["ISO 27001", "NIS2", "PCI DSS", "ABRO 2026"], rigor: "Critical", owner: "IAM Lead", reviewCycle: "Quarterly", lastReview: "2026-01-10", evidence: 6, lifecycle: "Active",
    description: "The organization shall implement a comprehensive Privileged Access Management (PAM) program to control, monitor, and audit all privileged access across the IT environment. This includes enforcing just-in-time (JIT) privilege elevation, session recording for all administrative actions, credential vaulting with automated rotation, multi-factor authentication for all privileged sessions, and segregation of duties between administrative and operational roles. The program shall cover all forms of privileged access including domain administrators, database administrators, cloud IAM roles, service accounts, API keys, and emergency/break-glass accounts. Privileged access reviews shall be conducted quarterly, and all privileged session activity shall be logged with tamper-proof audit trails retained for a minimum of 7 years.",
    objective: "Minimize the risk of unauthorized privileged access, credential theft, and insider threats by enforcing least-privilege principles and maintaining complete auditability of all administrative actions. Satisfies ISO 27001 Annex A 8.2 & 8.3 (privileged access rights and access restriction), NIS2 Article 21(2)(i) (human resources security and access control), PCI DSS Requirement 7 & 8 (restrict and identify access), and ABRO 2026 §8.1-8.3 (access management requirements).",
    implementation: "Deploy an enterprise PAM solution with credential vaulting, session recording, and JIT access provisioning. Enforce MFA on all privileged sessions without exception. Implement automated service account discovery and rotation. Configure alerting for anomalous privileged activity. Conduct quarterly access certification campaigns for all privileged accounts. Integrate PAM logs with SIEM for real-time monitoring.",
    clauses: "ISO 27001 A.8.2 & A.8.3, NIS2 Art. 21(2)(i), PCI DSS Req. 7.1-7.3 & 8.1-8.6, ABRO 2026 §8.1-8.3" },
  { id: "ICF-DPP-001", title: "Data Classification & Handling", domain: "Data Protection & Privacy", status: "Compliant", frameworks: ["GDPR", "ISO 27001", "NIS2"], rigor: "High", owner: "DPO", reviewCycle: "Annual", lastReview: "2025-12-05", evidence: 4, lifecycle: "Active",
    description: "The organization shall implement a formal data classification scheme and associated handling procedures that categorize all information assets based on sensitivity, regulatory requirements, and business criticality. Classification levels shall include at minimum: Public, Internal, Confidential, and Strictly Confidential. Each classification level must have defined handling requirements covering storage, transmission, processing, sharing, retention, and destruction. Personal data processing activities shall be mapped and documented in a Record of Processing Activities (ROPA) as required by GDPR Article 30. Data handling procedures shall address cross-border transfer requirements, data minimization principles, and purpose limitation. All employees and third parties handling organizational data shall receive classification-specific training.",
    objective: "Ensure that all organizational data is appropriately classified and handled according to its sensitivity and applicable regulatory requirements, preventing unauthorized disclosure, data breaches, and regulatory non-compliance. Addresses GDPR Articles 5, 25, 30, and 32 (data protection principles and security), ISO 27001 Annex A 5.12-5.14 (classification, labeling, and transfer of information), and NIS2 Article 21(2)(d) (supply chain security including information handling).",
    implementation: "Define and publish a data classification policy with clear examples and decision trees. Deploy automated data discovery and classification tools across structured and unstructured data stores. Implement DLP policies aligned with classification levels. Maintain the ROPA with quarterly reviews. Conduct annual data handling training for all personnel. Integrate classification metadata into document management and collaboration platforms.",
    clauses: "GDPR Art. 5, 25, 30 & 32, ISO 27001 A.5.12-5.14, NIS2 Art. 21(2)(d)" },
  { id: "ICF-INC-001", title: "Incident Response Plan & Playbooks", domain: "Incident & Crisis Management", status: "Partial", frameworks: ["NIS2", "DORA", "ISO 27001", "ABRO 2026"], rigor: "Critical", owner: "IR Lead", reviewCycle: "Semi-Annual", lastReview: "2025-10-01", evidence: 2, lifecycle: "Active",
    description: "The organization shall develop, maintain, and regularly test a comprehensive incident response plan (IRP) supported by detailed playbooks for common incident types. The IRP shall define: incident classification and severity levels, escalation procedures and communication chains, roles and responsibilities (including RACI), containment and eradication procedures, evidence preservation and forensic protocols, regulatory notification timelines (NIS2: 24h early warning, 72h full notification; DORA: major ICT incident classification and reporting), stakeholder communication templates, and post-incident review processes. Playbooks shall be created for at minimum: ransomware, data breach, DDoS, insider threat, supply chain compromise, and cloud security incidents. The plan and playbooks shall be tested through tabletop exercises at least semi-annually and full simulation exercises annually.",
    objective: "Enable rapid, coordinated, and effective response to security incidents, minimizing business impact, preserving evidence, and ensuring compliance with regulatory notification requirements. Satisfies NIS2 Article 23 (incident reporting obligations), DORA Article 17-19 (ICT incident management and reporting), ISO 27001 Annex A 5.24-5.28 (incident management), and ABRO 2026 §10.1-10.4 (incident handling requirements).",
    implementation: "Formalize the IRP with executive endorsement. Develop scenario-specific playbooks with step-by-step procedures, decision trees, and checklists. Integrate with SOAR platform for automated response actions. Establish incident communication templates pre-approved by legal and PR. Conduct semi-annual tabletop exercises involving cross-functional teams. Perform annual full-scale incident simulations. Document all exercises with findings and improvement actions.",
    clauses: "NIS2 Art. 23(1)-(4), DORA Art. 17(1)-(3) & Art. 19, ISO 27001 A.5.24-5.28, ABRO 2026 §10.1-10.4" },
  { id: "ICF-BCP-001", title: "Business Continuity Planning", domain: "Business Continuity & DR", status: "Partial", frameworks: ["DORA", "ISO 27001", "ABRO 2026"], rigor: "High", owner: "BCM Lead", reviewCycle: "Annual", lastReview: "2025-09-15", evidence: 2, lifecycle: "In Review",
    description: "The organization shall establish, implement, and maintain business continuity plans (BCPs) that ensure the continued delivery of critical business services during and after disruptive events. The BCP program shall include: business impact analysis (BIA) identifying critical processes, maximum tolerable downtime (MTD), recovery time objectives (RTO), and recovery point objectives (RPO); continuity strategies for all critical processes; disaster recovery plans for ICT infrastructure with defined RTO < 4 hours and RPO < 1 hour for critical systems; crisis management and communication procedures; and regular testing through at least annual BCP exercises including failover testing of DR environments. Plans must specifically address ICT service continuity scenarios as required by DORA, including third-party ICT service provider failure scenarios.",
    objective: "Ensure organizational resilience by maintaining the ability to continue critical business operations during disruptions and recover ICT services within defined timeframes. Addresses DORA Article 11-12 (ICT business continuity management and response/recovery plans), ISO 27001 Annex A 5.29-5.30 (business continuity and ICT readiness), and ABRO 2026 §11.1-11.3 (continuity requirements for government supply chains).",
    implementation: "Conduct annual BIA to identify and prioritize critical business processes. Develop and maintain BCPs for each critical business unit. Implement DR solutions meeting RTO/RPO targets with automated failover capabilities. Establish crisis management team with defined activation triggers. Test BCPs annually through tabletop and functional exercises. Maintain alternate processing sites and communication channels. Document test results with corrective action tracking.",
    clauses: "DORA Art. 11(1)-(11) & Art. 12, ISO 27001 A.5.29 & A.5.30, ABRO 2026 §11.1-11.3" },
  { id: "ICF-TPR-001", title: "Third-Party Risk Assessment Program", domain: "Third-Party & Supply Chain", status: "Critical Gap", frameworks: ["DORA", "NIS2", "ISO 27001"], rigor: "Critical", owner: "Vendor Mgmt Lead", reviewCycle: "Quarterly", lastReview: "2025-07-20", evidence: 1, lifecycle: "Draft",
    description: "The organization shall implement a comprehensive third-party risk management program that covers the entire vendor lifecycle: onboarding due diligence, contract security requirements, ongoing monitoring, and offboarding. All ICT third-party service providers shall be assessed for security risks prior to engagement, with risk-tiered assessment depth (critical providers receiving full on-site or SOC 2 Type II assessments). The program shall maintain a register of all ICT third-party providers with classification of their criticality and concentration risk. Contracts shall include mandatory security clauses covering: right to audit, incident notification timelines, data handling requirements, subcontracting restrictions, exit strategies, and service continuity guarantees. Continuous monitoring shall include periodic reassessments, real-time threat intelligence on third-party compromises, and financial stability monitoring for critical providers. DORA-specific requirements for ICT third-party provider oversight, including the identification of critical ICT providers and concentration risk management, shall be fully implemented.",
    objective: "Manage and mitigate risks arising from the organization's reliance on third-party service providers, preventing supply chain attacks, service disruptions, and regulatory non-compliance. Satisfies DORA Chapter V Articles 28-44 (ICT third-party risk management), NIS2 Article 21(2)(d) (supply chain security), and ISO 27001 Annex A 5.19-5.22 (supplier relationships security).",
    implementation: "Deploy a vendor risk management platform with automated assessment workflows. Define vendor tiering criteria and assessment templates per tier. Establish security contract clauses library pre-approved by legal. Implement continuous monitoring with automated alerts for vendor security incidents. Maintain a critical ICT provider register with concentration risk analysis. Conduct annual strategic vendor reviews with executive oversight. Implement vendor exit plans for all critical providers.",
    clauses: "DORA Art. 28-30 & Art. 31-44, NIS2 Art. 21(2)(d), ISO 27001 A.5.19-5.22" },
  { id: "ICF-AUD-001", title: "Internal Audit Program", domain: "Audit & Assurance", status: "Compliant", frameworks: ["ISO 27001", "DORA", "ABRO 2026"], rigor: "High", owner: "Head of Audit", reviewCycle: "Annual", lastReview: "2025-11-01", evidence: 5, lifecycle: "Active",
    description: "The organization shall establish and maintain an internal audit program for information security and ICT risk management that operates independently from the functions being audited. The program shall include: a risk-based annual audit plan covering all critical controls, processes, and systems; qualified auditors with relevant certifications (CISA, ISO 27001 Lead Auditor); standardized audit methodology including planning, fieldwork, reporting, and follow-up phases; a formal audit findings tracking system with severity ratings, remediation timelines, and escalation procedures; and regular reporting of audit results to the board audit committee. Audits shall assess the effectiveness of the ICT risk management framework, compliance with applicable regulations, and the adequacy of implemented controls. DORA Article 6(6) requires digital operational resilience testing, which shall be coordinated with the audit program.",
    objective: "Provide independent assurance that information security controls are effective, regulatory obligations are met, and risk management processes function as designed. Satisfies ISO 27001 Clause 9.2 (internal audit), DORA Article 6(6) and Article 24-27 (digital operational resilience testing), and ABRO 2026 §12.1 (audit and assurance requirements for government suppliers).",
    implementation: "Establish an independent internal audit function with direct reporting to the board audit committee. Develop a risk-based annual audit plan. Use standardized audit checklists aligned with ISO 27001, DORA, and ABRO requirements. Implement an audit management tool for findings tracking and remediation monitoring. Conduct follow-up audits to verify remediation effectiveness. Report quarterly to the audit committee on findings, trends, and management action plan status.",
    clauses: "ISO 27001 Cl. 9.2, DORA Art. 6(6) & Art. 24-27, ABRO 2026 §12.1" },
  { id: "ICF-TRN-001", title: "Security Awareness Training Program", domain: "Training & Awareness", status: "Compliant", frameworks: ["NIS2", "ISO 27001", "GDPR"], rigor: "Medium", owner: "HR Security Lead", reviewCycle: "Annual", lastReview: "2026-01-20", evidence: 3, lifecycle: "Active",
    description: "The organization shall implement a comprehensive security awareness and training program for all personnel, including employees, contractors, and temporary staff. The program shall include: mandatory onboarding security training within the first week of employment; annual refresher training for all staff; role-based specialized training for IT, security, development, and management personnel; regular phishing simulations (at least monthly) with targeted re-training for employees who fail; awareness campaigns covering current threat trends, social engineering techniques, data protection responsibilities, and incident reporting procedures; and training on applicable regulatory requirements including GDPR data subject rights and NIS2 security obligations. Training completion and phishing simulation results shall be tracked and reported to management quarterly. The program shall include knowledge assessments to verify comprehension, with a minimum 85% pass rate required.",
    objective: "Build and maintain a security-aware organizational culture where all personnel understand their role in protecting the organization's information assets and can recognize and respond to common threats. Addresses NIS2 Article 20(2) (training obligations for management), ISO 27001 Annex A 6.3 (awareness, education, and training), and GDPR Article 39(1)(b) (DPO training obligations).",
    implementation: "Deploy an LMS-based security awareness platform with automated enrollment and tracking. Develop role-specific training curricula covering general awareness, secure development, incident response, and executive-level cyber risk. Conduct monthly phishing simulations with progressive difficulty. Create a security champions program across business units. Measure program effectiveness through completion rates, phishing click rates, incident reporting rates, and knowledge assessment scores.",
    clauses: "NIS2 Art. 20(2), ISO 27001 A.6.3, GDPR Art. 39(1)(b) & Art. 47(2)(n)" },
  { id: "ICF-MON-001", title: "SIEM & Log Management", domain: "Monitoring & Continuous Improvement", status: "Compliant", frameworks: ["NIS2", "ISO 27001", "PCI DSS", "DORA"], rigor: "Critical", owner: "SOC Manager", reviewCycle: "Quarterly", lastReview: "2026-02-01", evidence: 7, lifecycle: "Active",
    description: "The organization shall implement a centralized Security Information and Event Management (SIEM) system integrated with comprehensive log management capabilities to enable real-time threat detection, investigation, and response. All security-relevant systems shall forward logs to the SIEM, including: firewalls, IDS/IPS, endpoints, servers, cloud platforms, identity providers, databases, applications, and network devices. Log sources shall include authentication events, privilege escalation, configuration changes, data access, network flows, and security tool alerts. Detection rules shall be developed and maintained covering MITRE ATT&CK framework tactics and techniques relevant to the organization's threat model. Logs shall be retained for a minimum of 7 years in compliance with DORA audit trail requirements, with real-time analysis on at least 12 months of hot data. SOC analysts shall operate 24/7 or with managed detection and response (MDR) coverage for critical alerts. Correlation rules, anomaly detection, and UEBA capabilities shall be tuned continuously based on the evolving threat landscape and false positive analysis.",
    objective: "Provide continuous monitoring and rapid detection of security threats, enabling timely incident response and maintaining comprehensive audit trails for forensic investigation and regulatory compliance. Satisfies NIS2 Article 21(2)(b) (incident handling), ISO 27001 Annex A 8.15-8.16 (logging and monitoring), PCI DSS Requirement 10 (log and monitor all access), and DORA Article 10 (detection of anomalous activities).",
    implementation: "Deploy enterprise SIEM with log aggregation from all critical sources. Implement log collection agents and syslog forwarding for comprehensive coverage. Develop detection rules mapped to MITRE ATT&CK. Configure SOAR integration for automated response playbooks. Establish SOC operating procedures with tiered escalation. Implement UEBA for behavioral anomaly detection. Conduct quarterly detection rule tuning and coverage gap analysis. Archive logs to compliant long-term storage with 7-year retention.",
    clauses: "NIS2 Art. 21(2)(b), ISO 27001 A.8.15 & A.8.16, PCI DSS Req. 10.1-10.7, DORA Art. 10(1)-(5)" },
  { id: "ICF-POL-001", title: "Information Security Policy Suite", domain: "Policy & Document Management", status: "Compliant", frameworks: ["ISO 27001", "NIS2", "DORA", "GDPR", "ABRO 2026"], rigor: "High", owner: "CISO", reviewCycle: "Annual", lastReview: "2025-12-15", evidence: 8, lifecycle: "Active",
    description: "The organization shall develop, maintain, and enforce a comprehensive suite of information security policies that collectively address all aspects of the organization's security program. The policy suite shall include at minimum: overarching Information Security Policy, Acceptable Use Policy, Access Control Policy, Data Classification and Handling Policy, Incident Response Policy, Business Continuity Policy, Third-Party Risk Management Policy, Cloud Security Policy, Cryptographic Controls Policy, Physical Security Policy, Change Management Policy, and Data Protection/Privacy Policy. All policies shall follow a standardized structure including: purpose, scope, definitions, policy statements, roles and responsibilities, compliance requirements, exceptions process, and references. Policies shall be reviewed annually or upon significant regulatory, organizational, or threat landscape changes. Policy approval shall follow a defined workflow with version control, stakeholder review periods, executive sign-off, and formal communication to all affected personnel. Policy compliance monitoring shall be automated where possible and reported in the compliance dashboard.",
    objective: "Establish a complete, authoritative set of security policies that provide the organizational foundation for the information security management system, ensuring consistent security practices and regulatory compliance. Addresses ISO 27001 Clause 5.2 & Annex A 5.1 (policies for information security), NIS2 Article 21(1) (cybersecurity risk-management measures), DORA Article 5(1) (ICT risk management framework), GDPR Article 24 (controller responsibilities), and ABRO 2026 §3.1 (policy management for government suppliers).",
    implementation: "Establish a policy governance framework with defined ownership, review cadence, and approval workflows. Deploy a policy management platform integrated with the ICF for version control and distribution tracking. Use the 14-domain taxonomy to ensure complete policy coverage. Automate policy acknowledgment tracking for all personnel. Map each policy to applicable regulatory requirements and controls. Conduct annual policy effectiveness reviews and gap assessments.",
    clauses: "ISO 27001 Cl. 5.2 & A.5.1, NIS2 Art. 21(1), DORA Art. 5(1), GDPR Art. 24, ABRO 2026 §3.1" },
];

const EVIDENCE_DATA = [
  { id: "EV-001", name: "Information Security Policy v3.2", type: "Policy", controls: ["ICF-GOV-001", "ICF-POL-001"], status: "Approved", qualityScore: 92, uploadDate: "2025-12-15", expiry: "2026-12-15", owner: "CISO", scope: "Enterprise", frameworks: ["ISO 27001", "NIS2", "DORA"], uploadedBy: "Niteen Kumar", uploadedByRole: "Super Admin" },
  { id: "EV-002", name: "Q4 2025 Penetration Test Report", type: "Report", controls: ["ICF-CYB-001", "ICF-CYB-002"], status: "Approved", qualityScore: 88, uploadDate: "2025-12-20", expiry: "2026-06-20", owner: "Security Manager", scope: "BU-Finance", frameworks: ["PCI DSS", "ISO 27001"], uploadedBy: "Anna Müller", uploadedByRole: "Security Manager" },
  { id: "EV-003", name: "Risk Assessment Methodology v2.1", type: "Methodology", controls: ["ICF-RSK-001"], status: "In Review", qualityScore: 75, uploadDate: "2025-10-20", expiry: "2026-10-20", owner: "CRO", scope: "Enterprise", frameworks: ["ISO 27001", "DORA"], uploadedBy: "Pieter de Groot", uploadedByRole: "Compliance Officer" },
  { id: "EV-004", name: "PAM Configuration Screenshots", type: "Evidence", controls: ["ICF-IAM-001"], status: "Approved", qualityScore: 85, uploadDate: "2026-01-10", expiry: "2026-07-10", owner: "IAM Lead", scope: "Enterprise", frameworks: ["ISO 27001", "PCI DSS"], uploadedBy: "Anna Müller", uploadedByRole: "Security Manager" },
  { id: "EV-005", name: "Incident Response Plan v4.0", type: "Plan", controls: ["ICF-INC-001"], status: "Draft", qualityScore: 62, uploadDate: "2025-10-01", expiry: "2026-04-01", owner: "IR Lead", scope: "Enterprise", frameworks: ["NIS2", "DORA"], uploadedBy: "Pieter de Groot", uploadedByRole: "Compliance Officer" },
  { id: "EV-006", name: "GDPR Data Processing Records", type: "Register", controls: ["ICF-DPP-001"], status: "Approved", qualityScore: 94, uploadDate: "2025-12-05", expiry: "2026-12-05", owner: "DPO", scope: "Enterprise", frameworks: ["GDPR"], uploadedBy: "Niteen Kumar", uploadedByRole: "Super Admin" },
  { id: "EV-007", name: "Network Segmentation Diagram v2.0", type: "Diagram", controls: ["ICF-CYB-001", "ICF-CLD-001"], status: "Approved", qualityScore: 90, uploadDate: "2025-11-30", expiry: "2026-11-30", owner: "Network Architect", scope: "Enterprise", frameworks: ["ISO 27001", "PCI DSS"], uploadedBy: "Anna Müller", uploadedByRole: "Security Manager" },
  { id: "EV-008", name: "Security Awareness Training Records 2025", type: "Records", controls: ["ICF-TRN-001"], status: "Approved", qualityScore: 96, uploadDate: "2026-01-20", expiry: "2027-01-20", owner: "HR Security Lead", scope: "Enterprise", frameworks: ["NIS2", "ISO 27001", "GDPR"], uploadedBy: "Pieter de Groot", uploadedByRole: "Compliance Officer" },
];

const POLICIES_DATA = [
  { id: "POL-001", title: "Information Security Policy", version: "3.2", status: "Approved", category: "Governance", lastUpdated: "2025-12-15", approver: "CISO", domain: "Governance & Enterprise Oversight", owner: "CISO", author: "Niteen Kumar", effectiveDate: "2025-12-20", nextReview: "2026-12-20", reviewCycle: "Annual", frameworks: ["ISO 27001", "NIS2", "DORA"], controls: ["ICF-GOV-001", "ICF-GOV-002", "ICF-POL-001"], attestationRate: 96, attestationRequired: 120, attestationComplete: 115, exceptions: 1, changeRequests: 0, versions: [{v: "3.2", date: "2025-12-15", by: "Niteen Kumar"}, {v: "3.1", date: "2025-06-10", by: "Pieter de Groot"}, {v: "3.0", date: "2024-12-01", by: "Niteen Kumar"}, {v: "2.0", date: "2023-11-15", by: "Anna Müller"}] },
  { id: "POL-002", title: "Acceptable Use Policy", version: "2.5", status: "Approved", category: "Operations", lastUpdated: "2025-11-20", approver: "CISO", domain: "Governance & Enterprise Oversight", owner: "CISO", author: "Pieter de Groot", effectiveDate: "2025-11-25", nextReview: "2026-11-25", reviewCycle: "Annual", frameworks: ["ISO 27001", "NIS2"], controls: ["ICF-GOV-001", "ICF-TRN-001"], attestationRate: 92, attestationRequired: 120, attestationComplete: 110, exceptions: 2, changeRequests: 0, versions: [{v: "2.5", date: "2025-11-20", by: "Pieter de Groot"}, {v: "2.4", date: "2025-05-10", by: "Pieter de Groot"}, {v: "2.0", date: "2024-06-01", by: "Anna Müller"}] },
  { id: "POL-003", title: "Data Protection & Privacy Policy", version: "4.0", status: "Approved", category: "Privacy", lastUpdated: "2025-12-05", approver: "DPO", domain: "Data Protection & Privacy", owner: "DPO", author: "Anna Müller", effectiveDate: "2025-12-10", nextReview: "2026-06-10", reviewCycle: "Semi-Annual", frameworks: ["GDPR", "ISO 27001", "NIS2"], controls: ["ICF-DPP-001"], attestationRate: 98, attestationRequired: 120, attestationComplete: 118, exceptions: 0, changeRequests: 1, versions: [{v: "4.0", date: "2025-12-05", by: "Anna Müller"}, {v: "3.5", date: "2025-06-01", by: "Anna Müller"}, {v: "3.0", date: "2024-12-01", by: "Jan Kowalski"}] },
  { id: "POL-004", title: "Incident Response Policy", version: "3.8", status: "In Review", category: "Security", lastUpdated: "2025-10-01", approver: "CISO", domain: "Incident & Crisis Management", owner: "IR Lead", author: "Anna Müller", effectiveDate: null, nextReview: "2026-04-01", reviewCycle: "Semi-Annual", frameworks: ["NIS2", "DORA", "ISO 27001"], controls: ["ICF-INC-001"], attestationRate: 0, attestationRequired: 80, attestationComplete: 0, exceptions: 0, changeRequests: 2, versions: [{v: "3.8", date: "2025-10-01", by: "Anna Müller"}, {v: "3.7", date: "2025-04-15", by: "Pieter de Groot"}] },
  { id: "POL-005", title: "Third-Party Risk Management Policy", version: "1.2", status: "Draft", category: "Risk", lastUpdated: "2025-07-20", approver: "CRO", domain: "Third-Party & Supply Chain", owner: "Vendor Mgmt Lead", author: "Pieter de Groot", effectiveDate: null, nextReview: null, reviewCycle: "Annual", frameworks: ["DORA", "NIS2", "ISO 27001"], controls: ["ICF-TPR-001"], attestationRate: 0, attestationRequired: 45, attestationComplete: 0, exceptions: 0, changeRequests: 0, versions: [{v: "1.2", date: "2025-07-20", by: "Pieter de Groot"}, {v: "1.0", date: "2025-03-01", by: "Pieter de Groot"}] },
  { id: "POL-006", title: "Business Continuity Policy", version: "2.0", status: "In Review", category: "Resilience", lastUpdated: "2025-09-15", approver: "BCM Lead", domain: "Business Continuity & DR", owner: "BCM Lead", author: "Jan Kowalski", effectiveDate: null, nextReview: "2026-09-15", reviewCycle: "Annual", frameworks: ["DORA", "ISO 27001", "ABRO 2026"], controls: ["ICF-BCP-001"], attestationRate: 0, attestationRequired: 60, attestationComplete: 0, exceptions: 0, changeRequests: 1, versions: [{v: "2.0", date: "2025-09-15", by: "Jan Kowalski"}, {v: "1.5", date: "2025-03-10", by: "Jan Kowalski"}] },
  { id: "POL-007", title: "Cloud Security Policy", version: "1.0", status: "Draft", category: "Security", lastUpdated: "2025-08-20", approver: "Cloud Architect", domain: "Cloud & Infrastructure Security", owner: "Cloud Architect", author: "Anna Müller", effectiveDate: null, nextReview: null, reviewCycle: "Annual", frameworks: ["ISO 27001", "DORA", "ABRO 2026"], controls: ["ICF-CLD-001"], attestationRate: 0, attestationRequired: 35, attestationComplete: 0, exceptions: 0, changeRequests: 0, versions: [{v: "1.0", date: "2025-08-20", by: "Anna Müller"}] },
  { id: "POL-008", title: "Access Control Policy", version: "3.1", status: "Approved", category: "IAM", lastUpdated: "2026-01-10", approver: "IAM Lead", domain: "Identity & Access Management", owner: "IAM Lead", author: "Niteen Kumar", effectiveDate: "2026-01-15", nextReview: "2026-07-15", reviewCycle: "Semi-Annual", frameworks: ["ISO 27001", "NIS2", "PCI DSS"], controls: ["ICF-IAM-001"], attestationRate: 89, attestationRequired: 90, attestationComplete: 80, exceptions: 3, changeRequests: 0, versions: [{v: "3.1", date: "2026-01-10", by: "Niteen Kumar"}, {v: "3.0", date: "2025-07-01", by: "Niteen Kumar"}, {v: "2.0", date: "2024-12-15", by: "Pieter de Groot"}] },
];

let USERS_DATA = [
  { id: 1, name: "Niteen Kumar", email: "n.kumar@brightlyn.nl", role: "Super Admin", status: "Active", lastLogin: "2026-02-18 09:15", mfa: true },
  { id: 2, name: "Pieter de Groot", email: "p.degroot@brightlyn.nl", role: "Compliance Officer", status: "Active", lastLogin: "2026-02-18 08:42", mfa: true },
  { id: 3, name: "Anna Müller", email: "a.mueller@brightlyn.nl", role: "Security Manager", status: "Active", lastLogin: "2026-02-17 16:30", mfa: true },
  { id: 4, name: "Jan Kowalski", email: "j.kowalski@brightlyn.nl", role: "Internal Auditor", status: "Active", lastLogin: "2026-02-16 14:20", mfa: true },
  { id: 5, name: "Marie Dupont", email: "m.dupont@brightlyn.nl", role: "Executive Viewer", status: "Active", lastLogin: "2026-02-15 11:00", mfa: false },
  { id: 6, name: "Thomas Schmidt", email: "t.schmidt@brightlyn.nl", role: "Compliance Officer", status: "Inactive", lastLogin: "2026-01-20 09:45", mfa: true },
];

const COMPLIANCE_TREND = [
  { month: "Sep", compliant: 68, partial: 18, gap: 14 },
  { month: "Oct", compliant: 72, partial: 17, gap: 11 },
  { month: "Nov", compliant: 76, partial: 15, gap: 9 },
  { month: "Dec", compliant: 79, partial: 13, gap: 8 },
  { month: "Jan", compliant: 82, partial: 12, gap: 6 },
  { month: "Feb", compliant: 85, partial: 10, gap: 5 },
];

const FRAMEWORK_COMPLIANCE = [
  { framework: "ISO 27001", compliance: 91 },
  { framework: "NIS2", compliance: 84 },
  { framework: "DORA", compliance: 78 },
  { framework: "GDPR", compliance: 93 },
  { framework: "ABRO 2026", compliance: 72 },
  { framework: "PCI DSS", compliance: 87 },
  { framework: "ISO 20000-1", compliance: 80 },
  { framework: "CMMI", compliance: 75 },
];

const RADAR_DATA = [
  { domain: "Governance", score: 92 },
  { domain: "Risk Mgmt", score: 78 },
  { domain: "Cyber Sec", score: 86 },
  { domain: "Cloud Sec", score: 71 },
  { domain: "IAM", score: 90 },
  { domain: "Data Prot", score: 88 },
  { domain: "Incident", score: 76 },
  { domain: "BCP/DR", score: 73 },
  { domain: "3rd Party", score: 65 },
  { domain: "Audit", score: 89 },
];

const AUDIT_LOG = [
  { time: "09:15", user: "Niteen Kumar", action: "Approved control ICF-MON-001", type: "approval" },
  { time: "08:42", user: "Pieter de Groot", action: "Uploaded evidence EV-008", type: "upload" },
  { time: "08:30", user: "Anna Müller", action: "Updated policy POL-004 to v3.8", type: "update" },
  { time: "Yesterday", user: "Jan Kowalski", action: "Completed audit review of Domain 12", type: "review" },
  { time: "Yesterday", user: "Niteen Kumar", action: "Modified RBAC for user t.schmidt", type: "admin" },
  { time: "Feb 16", user: "Pieter de Groot", action: "Generated gap analysis report", type: "report" },
];

// ─── Shared Components ───
const Badge = ({ children, variant = "default", size = "sm" }) => {
  const styles = {
    default: { bg: COLORS.surfaceAlt, color: COLORS.textSecondary, border: COLORS.border },
    primary: { bg: COLORS.primaryLight, color: COLORS.primary, border: "transparent" },
    success: { bg: COLORS.successLight, color: COLORS.success, border: "transparent" },
    warning: { bg: COLORS.warningLight, color: COLORS.warning, border: "transparent" },
    danger: { bg: COLORS.dangerLight, color: COLORS.danger, border: "transparent" },
    info: { bg: COLORS.infoLight, color: COLORS.info, border: "transparent" },
    accent: { bg: COLORS.accentLight, color: COLORS.accent, border: "transparent" },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: size === "xs" ? "1px 6px" : "2px 10px",
      borderRadius: 6, fontSize: size === "xs" ? 10 : 11, fontWeight: 600, letterSpacing: 0.3,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

const StatusBadge = ({ status }) => {
  const map = { Compliant: "success", Partial: "warning", "Critical Gap": "danger", "N/A": "default", Active: "success", "In Review": "info", Draft: "default", Approved: "success", Deprecated: "warning", Archived: "default", Inactive: "danger" };
  return <Badge variant={map[status] || "default"}>{status}</Badge>;
};

const StatCard = ({ icon: Icon, label, value, sub, trend, color = COLORS.primary }) => (
  <div style={{
    background: COLORS.surface, borderRadius: 14, padding: "20px 22px",
    border: `1px solid ${COLORS.borderLight}`, flex: 1, minWidth: 200,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, marginBottom: 6, letterSpacing: 0.3 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
    </div>
    {trend && (
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12 }}>
        <TrendingUp size={14} color={COLORS.success} />
        <span style={{ color: COLORS.success, fontWeight: 600 }}>{trend}</span>
        <span style={{ color: COLORS.textMuted }}>vs last month</span>
      </div>
    )}
  </div>
);

const SearchBar = ({ placeholder = "Search...", value, onChange, style = {} }) => (
  <div style={{ position: "relative", ...style }}>
    <Search size={16} color={COLORS.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10,
        border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.text,
        background: COLORS.surface, outline: "none", boxSizing: "border-box",
      }}
      onFocus={e => e.target.style.borderColor = COLORS.primary}
      onBlur={e => e.target.style.borderColor = COLORS.border}
    />
  </div>
);

const Button = ({ children, variant = "primary", size = "md", icon: Icon, onClick, style = {} }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600,
    borderRadius: 10, cursor: "pointer", border: "none", fontSize: 13,
    transition: "all 0.15s ease", whiteSpace: "nowrap",
    padding: size === "sm" ? "6px 12px" : "9px 18px",
  };
  const variants = {
    primary: { background: COLORS.primary, color: "#fff" },
    secondary: { background: COLORS.surfaceAlt, color: COLORS.textSecondary, border: `1px solid ${COLORS.border}` },
    ghost: { background: "transparent", color: COLORS.textSecondary },
    danger: { background: COLORS.dangerLight, color: COLORS.danger },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (variant === "primary") e.target.style.background = COLORS.primaryDark; }}
      onMouseLeave={e => { if (variant === "primary") e.target.style.background = COLORS.primary; }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, background: COLORS.surfaceAlt, borderRadius: 10, padding: 3 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500,
        cursor: "pointer", transition: "all 0.15s",
        background: active === t.id ? COLORS.surface : "transparent",
        color: active === t.id ? COLORS.text : COLORS.textMuted,
        boxShadow: active === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
      }}>{t.label}{t.count != null && <span style={{ marginLeft: 6, fontSize: 11, color: COLORS.textMuted }}>({t.count})</span>}</button>
    ))}
  </div>
);

const ProgressBar = ({ value, color = COLORS.primary, height = 6, showLabel = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
    <div style={{ flex: 1, height, background: COLORS.surfaceAlt, borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.6s ease" }} />
    </div>
    {showLabel && <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: "right" }}>{value}%</span>}
  </div>
);

const QualityScore = ({ score }) => {
  const color = score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color }}>{score}</div>
    </div>
  );
};

const TableHeader = ({ children, style = {} }) => (
  <th style={{
    padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600,
    color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5,
    borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt,
    whiteSpace: "nowrap", ...style,
  }}>{children}</th>
);

const TableCell = ({ children, style = {} }) => (
  <td style={{
    padding: "12px 14px", fontSize: 13, color: COLORS.text,
    borderBottom: `1px solid ${COLORS.borderLight}`, ...style,
  }}>{children}</td>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.surfaceAlt, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <Icon size={24} color={COLORS.textMuted} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: COLORS.textMuted }}>{desc}</div>
  </div>
);

const Card = ({ title, children, actions, style = {}, headerStyle = {} }) => (
  <div style={{ background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
    {title && (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${COLORS.borderLight}`, ...headerStyle }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{title}</span>
        {actions}
      </div>
    )}
    {children}
  </div>
);

const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", background: COLORS.surface, borderRadius: 16, width, maxWidth: "90vw",
        maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${COLORS.borderLight}` }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color={COLORS.textMuted} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Page: Dashboard ───
const Dashboard = () => {
  const totalControls = DOMAINS.reduce((s, d) => s + d.controls, 0);
  const totalCompliant = DOMAINS.reduce((s, d) => s + d.compliant, 0);
  const totalPartial = DOMAINS.reduce((s, d) => s + d.partial, 0);
  const totalGap = DOMAINS.reduce((s, d) => s + d.gap, 0);
  const complianceRate = Math.round((totalCompliant / totalControls) * 100);
  const pieData = [
    { name: "Compliant", value: totalCompliant, color: COLORS.success },
    { name: "Partial", value: totalPartial, color: COLORS.warning },
    { name: "Critical Gap", value: totalGap, color: COLORS.danger },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Compliance Dashboard</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Enterprise-wide regulatory compliance overview</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" icon={Download} size="sm">Export Report</Button>
          <Button icon={RefreshCw} size="sm">Sync Status</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon={Shield} label="TOTAL CONTROLS" value={totalControls} sub="Across 14 domains" color={COLORS.primary} />
        <StatCard icon={CheckCircle} label="COMPLIANCE RATE" value={`${complianceRate}%`} trend="+3.2%" color={COLORS.success} />
        <StatCard icon={AlertCircle} label="PARTIAL GAPS" value={totalPartial} sub="Require attention" color={COLORS.warning} />
        <StatCard icon={XCircle} label="CRITICAL GAPS" value={totalGap} sub="Immediate action" color={COLORS.danger} />
        <StatCard icon={Layers} label="FRAMEWORKS" value={FRAMEWORKS.length} sub="Active mappings" color={COLORS.info} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Card title="Compliance Trend" style={{ gridColumn: "1 / 3" }}>
          <div style={{ padding: "8px 20px 16px" }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={COMPLIANCE_TREND}>
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.success} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Area type="monotone" dataKey="compliant" stroke={COLORS.success} fill="url(#gradGreen)" strokeWidth={2.5} name="Compliant %" />
                <Area type="monotone" dataKey="partial" stroke={COLORS.warning} fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Partial %" />
                <Area type="monotone" dataKey="gap" stroke={COLORS.danger} fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Gap %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Compliance Distribution">
          <div style={{ padding: "8px 12px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                <Legend formatter={v => <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Framework + Radar + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Card title="Framework Compliance">
          <div style={{ padding: "12px 20px 16px" }}>
            {FRAMEWORK_COMPLIANCE.map(f => (
              <div key={f.framework} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: COLORS.textSecondary, minWidth: 80 }}>{f.framework}</span>
                <ProgressBar value={f.compliance} color={f.compliance >= 85 ? COLORS.success : f.compliance >= 70 ? COLORS.warning : COLORS.danger} height={7} />
                <span style={{ fontSize: 12, fontWeight: 600, color: f.compliance >= 85 ? COLORS.success : f.compliance >= 70 ? COLORS.warning : COLORS.danger, minWidth: 36, textAlign: "right" }}>{f.compliance}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Domain Maturity Radar">
          <div style={{ padding: "0 8px 8px" }}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={COLORS.borderLight} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 9, fill: COLORS.textMuted }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: COLORS.textMuted }} domain={[0, 100]} />
                <Radar name="Score" dataKey="score" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div style={{ padding: "8px 0" }}>
            {AUDIT_LOG.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 20px", borderBottom: i < AUDIT_LOG.length - 1 ? `1px solid ${COLORS.borderLight}` : "none" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 6, background: a.type === "approval" ? COLORS.success : a.type === "upload" ? COLORS.primary : a.type === "admin" ? COLORS.accent : COLORS.warning, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.4 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{a.user} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Domain Overview */}
      <Card title="14-Domain Compliance Overview" actions={<Button variant="ghost" size="sm" icon={Filter}>Filter</Button>}>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>Domain</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Controls</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Compliant</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Partial</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Gaps</TableHeader>
                <TableHeader>Compliance</TableHeader>
              </tr>
            </thead>
            <tbody>
              {DOMAINS.map(d => {
                const pct = Math.round((d.compliant / d.controls) * 100);
                const Icon = d.icon;
                return (
                  <tr key={d.id} style={{ cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <TableCell><span style={{ fontSize: 11, color: COLORS.textMuted }}>{d.id}</span></TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${COLORS.primary}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={15} color={COLORS.primary} />
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell style={{ textAlign: "center", fontWeight: 600 }}>{d.controls}</TableCell>
                    <TableCell style={{ textAlign: "center", color: COLORS.success, fontWeight: 600 }}>{d.compliant}</TableCell>
                    <TableCell style={{ textAlign: "center", color: COLORS.warning, fontWeight: 600 }}>{d.partial}</TableCell>
                    <TableCell style={{ textAlign: "center", color: d.gap > 0 ? COLORS.danger : COLORS.textMuted, fontWeight: 600 }}>{d.gap}</TableCell>
                    <TableCell><ProgressBar value={pct} color={pct >= 85 ? COLORS.success : pct >= 70 ? COLORS.warning : COLORS.danger} showLabel height={7} /></TableCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── Form Field Component ───
const FormField = ({ label, required, children, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, textTransform: "uppercase", letterSpacing: 0.3 }}>
      {label}{required && <span style={{ color: COLORS.danger, marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {hint && <span style={{ fontSize: 11, color: COLORS.textMuted }}>{hint}</span>}
  </div>
);

const FormInput = ({ value, onChange, placeholder, ...rest }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.text, background: COLORS.surface, outline: "none", width: "100%", boxSizing: "border-box" }}
    onFocus={e => e.target.style.borderColor = COLORS.primary}
    onBlur={e => e.target.style.borderColor = COLORS.border}
    {...rest}
  />
);

const FormTextarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.text, background: COLORS.surface, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
    onFocus={e => e.target.style.borderColor = COLORS.primary}
    onBlur={e => e.target.style.borderColor = COLORS.border}
  />
);

const FormSelect = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, color: value ? COLORS.text : COLORS.textMuted, background: COLORS.surface, width: "100%", boxSizing: "border-box" }}>
    <option value="">{placeholder || "Select..."}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const FrameworkCheckboxes = ({ selected, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {FRAMEWORKS.map(f => {
      const active = selected.includes(f);
      return (
        <button key={f} onClick={() => onChange(active ? selected.filter(s => s !== f) : [...selected, f])}
          style={{
            padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer",
            border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
            background: active ? COLORS.primaryLight : COLORS.surface,
            color: active ? COLORS.primary : COLORS.textSecondary,
            transition: "all 0.12s",
          }}>
          {active && <span style={{ marginRight: 4 }}>✓</span>}{f}
        </button>
      );
    })}
  </div>
);

const WIZARD_STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Description & Objective" },
  { id: 3, label: "Mapping & Implementation" },
  { id: 4, label: "Review & Create" },
];

const EMPTY_FORM = {
  title: "", domain: "", rigor: "", owner: "", reviewCycle: "",
  description: "", objective: "",
  frameworks: [], implementation: "", clauses: "",
};

// ─── Page: Control Library ───
const ControlLibrary = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [frameworkFilter, setFrameworkFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  const [selectedControl, setSelectedControl] = useState(null);
  const [controls, setControls] = useState(CONTROLS_DATA);
  const [showNewControl, setShowNewControl] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState({});

  // Bulk Import state
  const [importFile, setImportFile] = useState(null);
  const [importDragOver, setImportDragOver] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1=upload, 2=preview/map, 3=validating, 4=done
  const [importPreview, setImportPreview] = useState(null);

  // AI Generate state
  const [aiFrameworks, setAiFrameworks] = useState([]);
  const [aiDomains, setAiDomains] = useState([]);
  const [aiRigor, setAiRigor] = useState("High");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStep, setAiStep] = useState(1); // 1=configure, 2=generating, 3=review, 4=done
  const [aiGenerated, setAiGenerated] = useState([]);
  const [aiSelectedControls, setAiSelectedControls] = useState(new Set());

  // Status Change state
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [statusChangeType, setStatusChangeType] = useState(null); // "compliance" or "lifecycle"
  const [statusChangeTarget, setStatusChangeTarget] = useState("");
  const [statusChangeJustification, setStatusChangeJustification] = useState("");
  const [statusChangeEvidence, setStatusChangeEvidence] = useState("");
  const [statusChangeHistory, setStatusChangeHistory] = useState([]);

  // Edit Control state
  const [showEditControl, setShowEditControl] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editChanges, setEditChanges] = useState({});
  const [editChangeReason, setEditChangeReason] = useState("");
  const [editHistory, setEditHistory] = useState([]);

  // ── State Machine Definitions ──
  const LIFECYCLE_TRANSITIONS = {
    Draft: ["In Review"],
    "In Review": ["Approved", "Draft"],
    Approved: ["Active", "Draft"],
    Active: ["Deprecated", "In Review"],
    Deprecated: ["Archived", "Active"],
    Archived: [],
  };

  const COMPLIANCE_TRANSITIONS = {
    "Critical Gap": ["Partial", "N/A"],
    Partial: ["Compliant", "Critical Gap", "N/A"],
    Compliant: ["Partial", "Critical Gap"],
    "N/A": ["Critical Gap"],
  };

  // Role-based authorization matrix
  const STATUS_ROLE_AUTH = {
    "Super Admin": { compliance: ["Compliant", "Partial", "Critical Gap", "N/A"], lifecycle: ["Draft", "In Review", "Approved", "Active", "Deprecated", "Archived"] },
    "Compliance Officer": { compliance: ["Compliant", "Partial", "Critical Gap", "N/A"], lifecycle: ["Draft", "In Review", "Approved", "Active"] },
    "Security Manager": { compliance: ["Partial", "Critical Gap"], lifecycle: ["Draft", "In Review"] },
    "Internal Auditor": { compliance: [], lifecycle: [] },
    "Executive Viewer": { compliance: [], lifecycle: [] },
  };

  // Determine which transitions the current user can make
  const getAvailableTransitions = (currentStatus, type) => {
    const machine = type === "compliance" ? COMPLIANCE_TRANSITIONS : LIFECYCLE_TRANSITIONS;
    const possible = machine[currentStatus] || [];
    const authorized = STATUS_ROLE_AUTH[CURRENT_USER.role]?.[type] || [];
    return possible.filter(s => authorized.includes(s));
  };

  // Requirements for specific transitions
  const getTransitionRequirements = (from, to, type) => {
    const reqs = [];
    if (type === "compliance") {
      if (to === "Compliant") {
        reqs.push({ label: "Evidence linked", desc: "At least one approved evidence artifact must be linked", required: true });
        reqs.push({ label: "Justification", desc: "Written justification explaining how the control satisfies all mapped framework requirements", required: true });
        reqs.push({ label: "Reviewer sign-off", desc: "Compliance Officer or above must confirm the assessment", required: true });
      }
      if (to === "Partial" && from === "Compliant") {
        reqs.push({ label: "Gap explanation", desc: "Describe which specific requirements are no longer fully met", required: true });
        reqs.push({ label: "Remediation plan", desc: "Outline steps and timeline to return to compliant status", required: false });
      }
      if (to === "Critical Gap") {
        reqs.push({ label: "Gap root cause", desc: "Document the root cause of the gap (e.g., missing implementation, expired evidence, failed audit)", required: true });
        reqs.push({ label: "Risk acceptance or remediation", desc: "Either provide a risk acceptance approval or a remediation plan with deadline", required: true });
      }
      if (to === "N/A") {
        reqs.push({ label: "Non-applicability justification", desc: "Explain why this control does not apply to the current scope (must reference framework exemption criteria)", required: true });
        reqs.push({ label: "Approval required", desc: "Super Admin or Compliance Officer must approve N/A designation", required: true });
      }
    }
    if (type === "lifecycle") {
      if (to === "In Review") reqs.push({ label: "Control content complete", desc: "All fields (description, objective, implementation, clause mappings) must be populated", required: true });
      if (to === "Approved") {
        reqs.push({ label: "Review completed", desc: "At least one reviewer must have assessed the control", required: true });
        reqs.push({ label: "Compliance Officer sign-off", desc: "Compliance Officer or Super Admin must approve", required: true });
      }
      if (to === "Active") reqs.push({ label: "Activation confirmation", desc: "Confirm the control is operationally enforced and evidence collection has begun", required: true });
      if (to === "Deprecated") reqs.push({ label: "Deprecation reason", desc: "Explain why this control is being deprecated (e.g., superseded, framework change, scope reduction)", required: true });
    }
    return reqs;
  };

  const handleStatusChange = () => {
    if (!statusChangeTarget || !statusChangeJustification.trim()) return;
    const ctrl = selectedControl;
    const field = statusChangeType === "compliance" ? "status" : "lifecycle";
    const oldValue = ctrl[field];

    // Create audit entry
    const auditEntry = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: CURRENT_USER.name,
      role: CURRENT_USER.role,
      type: statusChangeType,
      from: oldValue,
      to: statusChangeTarget,
      justification: statusChangeJustification,
      evidence: statusChangeEvidence,
      controlId: ctrl.id,
    };

    // Update the control
    const updatedControls = controls.map(c => c.id === ctrl.id ? { ...c, [field]: statusChangeTarget } : c);
    setControls(updatedControls);
    CONTROLS_DATA = updatedControls;
    setSelectedControl({ ...ctrl, [field]: statusChangeTarget });
    setStatusChangeHistory(prev => [auditEntry, ...prev]);

    // Reset and close
    setShowStatusChange(false);
    setStatusChangeTarget("");
    setStatusChangeJustification("");
    setStatusChangeEvidence("");
    setStatusChangeType(null);
  };

  const openStatusChange = (type) => {
    setStatusChangeType(type);
    setStatusChangeTarget("");
    setStatusChangeJustification("");
    setStatusChangeEvidence("");
    setShowStatusChange(true);
  };

  // ── Edit Control Definitions ──
  // Field-level edit permissions per role
  const EDIT_FIELD_AUTH = {
    "Super Admin":       { title: true, domain: true, description: true, objective: true, implementation: true, clauses: true, frameworks: true, rigor: true, owner: true, reviewCycle: true },
    "Compliance Officer": { title: true, domain: false, description: true, objective: true, implementation: true, clauses: true, frameworks: true, rigor: true, owner: true, reviewCycle: true },
    "Security Manager":  { title: false, domain: false, description: true, objective: true, implementation: true, clauses: false, frameworks: false, rigor: false, owner: false, reviewCycle: false },
    "Internal Auditor":  { title: false, domain: false, description: false, objective: false, implementation: false, clauses: false, frameworks: false, rigor: false, owner: false, reviewCycle: false },
    "Executive Viewer":  { title: false, domain: false, description: false, objective: false, implementation: false, clauses: false, frameworks: false, rigor: false, owner: false, reviewCycle: false },
  };

  // Which lifecycle states allow edits
  const EDITABLE_LIFECYCLE_STATES = { Draft: true, "In Review": true, Approved: false, Active: false, Deprecated: false, Archived: false };

  // Super Admin and Compliance Officer can override lifecycle edit lock
  const LIFECYCLE_EDIT_OVERRIDE_ROLES = ["Super Admin", "Compliance Officer"];

  const canEditField = (field) => {
    if (!selectedControl) return false;
    const rolePerms = EDIT_FIELD_AUTH[CURRENT_USER.role] || {};
    if (!rolePerms[field]) return false;
    // Check lifecycle state allows editing
    if (!EDITABLE_LIFECYCLE_STATES[selectedControl.lifecycle] && !LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role)) return false;
    return true;
  };

  const canEditAny = () => {
    if (!selectedControl) return false;
    const rolePerms = EDIT_FIELD_AUTH[CURRENT_USER.role] || {};
    const hasAnyPerm = Object.values(rolePerms).some(v => v);
    if (!hasAnyPerm) return false;
    if (!EDITABLE_LIFECYCLE_STATES[selectedControl.lifecycle] && !LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role)) return false;
    return true;
  };

  const openEditControl = () => {
    if (!selectedControl || !canEditAny()) return;
    setEditForm({
      title: selectedControl.title,
      domain: selectedControl.domain,
      description: selectedControl.description,
      objective: selectedControl.objective,
      implementation: selectedControl.implementation,
      clauses: selectedControl.clauses,
      frameworks: [...selectedControl.frameworks],
      rigor: selectedControl.rigor,
      owner: selectedControl.owner,
      reviewCycle: selectedControl.reviewCycle,
    });
    setEditChanges({});
    setEditChangeReason("");
    setShowEditControl(true);
  };

  const setEditField = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    // Track what changed
    const original = field === "frameworks" ? selectedControl[field].join(",") : selectedControl[field];
    const newVal = field === "frameworks" ? value.join(",") : value;
    if (original !== newVal) {
      setEditChanges(prev => ({ ...prev, [field]: { from: selectedControl[field], to: value } }));
    } else {
      setEditChanges(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleSaveEdit = () => {
    const changeCount = Object.keys(editChanges).length;
    if (changeCount === 0 || !editChangeReason.trim()) return;

    const auditEntry = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: CURRENT_USER.name,
      role: CURRENT_USER.role,
      controlId: selectedControl.id,
      changes: { ...editChanges },
      reason: editChangeReason,
      fieldsChanged: Object.keys(editChanges),
      requiresApproval: !LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role) && selectedControl.lifecycle !== "Draft",
    };

    const updatedControl = { ...selectedControl };
    Object.entries(editChanges).forEach(([field, { to }]) => { updatedControl[field] = to; });

    const updatedControls = controls.map(c => c.id === selectedControl.id ? updatedControl : c);
    setControls(updatedControls);
    CONTROLS_DATA = updatedControls;
    setSelectedControl(updatedControl);
    setEditHistory(prev => [auditEntry, ...prev]);
    setShowEditControl(false);
    setEditChangeReason("");
    setEditChanges({});
  };

  const DOMAIN_LIST = [...new Set(controls.map(c => c.domain))].sort();
  const ALL_DOMAINS = DOMAINS.map(d => d.name).sort();
  const RIGOR_OPTIONS = ["Critical", "High", "Medium", "Low"];
  const REVIEW_OPTIONS = ["Monthly", "Quarterly", "Semi-Annual", "Annual"];
  const OWNER_OPTIONS = ["CISO", "CRO", "DPO", "Security Manager", "Security Architect", "Cloud Architect", "IAM Lead", "IR Lead", "BCM Lead", "Vendor Mgmt Lead", "Head of Audit", "HR Security Lead", "SOC Manager", "Network Architect"];

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!form.title.trim()) errs.title = "Title is required";
      if (!form.domain) errs.domain = "Domain is required";
      if (!form.rigor) errs.rigor = "Rigor level is required";
      if (!form.owner) errs.owner = "Owner is required";
      if (!form.reviewCycle) errs.reviewCycle = "Review cycle is required";
    }
    if (step === 2) {
      if (!form.description.trim()) errs.description = "Description is required";
      if (!form.objective.trim()) errs.objective = "Objective is required";
    }
    if (step === 3) {
      if (form.frameworks.length === 0) errs.frameworks = "Select at least one framework";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(wizardStep)) setWizardStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => setWizardStep(prev => Math.max(prev - 1, 1));

  const generateControlId = () => {
    const domainPrefixMap = {
      "Governance & Enterprise Oversight": "GOV", "Risk Management": "RSK", "Policy & Document Management": "POL",
      "Legal & Regulatory Management": "LEG", "Third-Party & Supply Chain": "TPR", "Cyber Security": "CYB",
      "Cloud & Infrastructure Security": "CLD", "Identity & Access Management": "IAM", "Data Protection & Privacy": "DPP",
      "Incident & Crisis Management": "INC", "Business Continuity & DR": "BCP", "Audit & Assurance": "AUD",
      "Training & Awareness": "TRN", "Monitoring & Continuous Improvement": "MON",
    };
    const prefix = domainPrefixMap[form.domain] || "CTL";
    const existing = controls.filter(c => c.id.startsWith(`ICF-${prefix}-`));
    const nextNum = existing.length + 1;
    return `ICF-${prefix}-${String(nextNum).padStart(3, "0")}`;
  };

  const handleCreate = () => {
    if (!validateStep(3)) { setWizardStep(3); return; }
    const newControl = {
      id: generateControlId(),
      title: form.title,
      domain: form.domain,
      status: "Critical Gap",
      frameworks: form.frameworks,
      rigor: form.rigor,
      owner: form.owner,
      reviewCycle: form.reviewCycle,
      lastReview: "—",
      evidence: 0,
      lifecycle: "Draft",
      description: form.description,
      objective: form.objective,
      implementation: form.implementation || "Implementation guidance to be defined during control activation.",
      clauses: form.clauses || "Clause mapping pending AI analysis",
    };
    const updated = [newControl, ...controls];
    setControls(updated);
    CONTROLS_DATA = updated;
    setShowNewControl(false);
    setWizardStep(1);
    setForm({ ...EMPTY_FORM });
    setFormErrors({});
    setSelectedControl(newControl);
  };

  const handleCloseWizard = () => {
    setShowNewControl(false);
    setWizardStep(1);
    setForm({ ...EMPTY_FORM });
    setFormErrors({});
  };

  // ── Bulk Import Handlers ──
  const TEMPLATE_COLUMNS = ["Control ID", "Control Title", "Domain", "Control Description", "Control Objective", "Status", "Rigor", "Lifecycle", "Owner", "Review Cycle", "Last Review Date", "Implementation Guidance", "Regulatory Clause References", "Mapped Frameworks", "Semantic Analysis", "Coverage", "HCF Rigor", "Reason Code"];

  const handleImportFile = (file) => {
    if (!file) return;
    setImportFile(file);
    // Simulate parsing the Excel file
    setTimeout(() => {
      setImportPreview({
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        totalRows: 12,
        validRows: 10,
        warningRows: 1,
        errorRows: 1,
        columns: TEMPLATE_COLUMNS,
        sampleRows: [
          { id: "ICF-CYB-003", title: "Endpoint Detection & Response", domain: "Cyber Security", status: "Draft", rigor: "Critical", valid: true },
          { id: "ICF-IAM-002", title: "Zero Trust Network Access", domain: "Identity & Access Management", status: "Draft", rigor: "High", valid: true },
          { id: "ICF-CLD-002", title: "Container Security Baseline", domain: "Cloud & Infrastructure Security", status: "Draft", rigor: "High", valid: true },
          { id: "", title: "Missing ID Row", domain: "Risk Management", status: "", rigor: "", valid: false, error: "Missing Control ID and Status" },
          { id: "ICF-DPP-002", title: "Data Loss Prevention Program", domain: "Data Protection & Privacy", status: "Draft", rigor: "High", valid: true },
        ],
      });
      setImportStep(2);
    }, 800);
  };

  const handleImportConfirm = () => {
    setImportStep(3);
    // Simulate validation + import
    setTimeout(() => {
      const newControls = [
        { id: "ICF-CYB-003", title: "Endpoint Detection & Response", domain: "Cyber Security", status: "Critical Gap", frameworks: ["NIS2", "ISO 27001", "ABRO 2026"], rigor: "Critical", owner: "SOC Manager", reviewCycle: "Monthly", lastReview: "—", evidence: 0, lifecycle: "Draft",
          description: "The organization shall deploy and maintain Endpoint Detection and Response (EDR) capabilities on all endpoints including workstations, servers, and mobile devices. EDR solutions must provide real-time behavioral analysis, automated threat detection, incident investigation capabilities, and integration with SIEM/SOAR platforms for centralized response orchestration.",
          objective: "Enable rapid detection and containment of endpoint-level threats including malware, fileless attacks, and advanced persistent threats, reducing attacker dwell time and limiting lateral movement.", implementation: "Deploy EDR agents across all managed endpoints. Configure behavioral detection rules. Integrate with SIEM for correlated alerting. Establish SOC playbooks for EDR-triggered incidents.", clauses: "NIS2 Art. 21(2)(b), ISO 27001 A.8.7, ABRO 2026 §6.4" },
        { id: "ICF-IAM-002", title: "Zero Trust Network Access", domain: "Identity & Access Management", status: "Critical Gap", frameworks: ["NIS2", "ISO 27001", "DORA"], rigor: "High", owner: "IAM Lead", reviewCycle: "Quarterly", lastReview: "—", evidence: 0, lifecycle: "Draft",
          description: "The organization shall implement a Zero Trust Network Access (ZTNA) architecture that enforces identity-based, context-aware access decisions for all users and devices accessing organizational resources. Access shall be granted per-session based on user identity, device posture, location, and risk score, with continuous verification throughout the session.",
          objective: "Eliminate implicit trust based on network location and enforce continuous identity verification for all resource access, reducing the attack surface from compromised credentials and lateral movement.", implementation: "Deploy ZTNA solution replacing traditional VPN. Configure device posture checks. Implement risk-based conditional access policies. Integrate with identity provider for SSO and MFA enforcement.", clauses: "NIS2 Art. 21(2)(i), ISO 27001 A.8.1 & A.8.3, DORA Art. 9(2)" },
        { id: "ICF-CLD-002", title: "Container Security Baseline", domain: "Cloud & Infrastructure Security", status: "Critical Gap", frameworks: ["ISO 27001", "DORA"], rigor: "High", owner: "Cloud Architect", reviewCycle: "Quarterly", lastReview: "—", evidence: 0, lifecycle: "Draft",
          description: "The organization shall establish and enforce a container security baseline covering image scanning, runtime protection, network policies, secret management, and supply chain integrity for all containerized workloads. All container images must be scanned for vulnerabilities before deployment, and runtime behavior must be monitored for anomalous activity.",
          objective: "Ensure that containerized workloads maintain a secure posture throughout their lifecycle, preventing deployment of vulnerable images and detecting runtime compromises.", implementation: "Implement container image scanning in CI/CD pipelines. Deploy runtime security monitoring. Enforce Kubernetes network policies. Configure pod security standards. Implement secret management via vault integration.", clauses: "ISO 27001 A.8.9 & A.8.25, DORA Art. 9(4)" },
      ];
      const updated = [...newControls, ...controls];
      setControls(updated);
      CONTROLS_DATA = updated;
      setImportStep(4);
    }, 2000);
  };

  const handleCloseBulkImport = () => {
    setShowBulkImport(false);
    setImportStep(1);
    setImportFile(null);
    setImportPreview(null);
  };

  // ── AI Generate Handlers ──
  const AI_CONTROL_TEMPLATES = {
    "Cyber Security": [
      { suffix: "EDR", title: "Endpoint Detection & Response Deployment", desc: "Deploy and maintain EDR capabilities across all endpoints for real-time behavioral analysis, automated threat detection, and incident investigation. Integration with SIEM/SOAR platforms is required for centralized response orchestration.", obj: "Enable rapid detection of endpoint threats, reducing attacker dwell time and preventing lateral movement.", impl: "Deploy EDR agents across all endpoints. Configure behavioral detection rules. Integrate with SIEM. Establish SOC response playbooks.", clauses: "NIS2 Art. 21(2)(b), ISO 27001 A.8.7" },
      { suffix: "TI", title: "Threat Intelligence Program", desc: "Establish a structured threat intelligence program incorporating strategic, tactical, and operational intelligence feeds. Intelligence shall be analyzed, contextualized to the organization's threat landscape, and operationalized through detection rules, hunting hypotheses, and risk assessments.", obj: "Proactively identify and anticipate threats targeting the organization's industry and technology stack, enabling preemptive defensive actions.", impl: "Subscribe to commercial and open-source TI feeds. Establish TI analysis function. Integrate IOCs with SIEM detection. Conduct quarterly threat landscape briefings.", clauses: "NIS2 Art. 21(2)(a), ISO 27001 A.5.7" },
    ],
    "Identity & Access Management": [
      { suffix: "ZTNA", title: "Zero Trust Network Access Architecture", desc: "Implement ZTNA enforcing identity-based, context-aware access decisions for all users and devices. Access shall be per-session based on identity, device posture, location, and risk scoring with continuous verification.", obj: "Eliminate implicit network trust, enforce continuous identity verification, and reduce attack surface from credential compromise.", impl: "Deploy ZTNA solution. Configure device posture checks. Implement conditional access policies. Integrate with IdP for SSO/MFA.", clauses: "NIS2 Art. 21(2)(i), ISO 27001 A.8.1 & A.8.3, DORA Art. 9(2)" },
    ],
    "Cloud & Infrastructure Security": [
      { suffix: "CONT", title: "Container & Kubernetes Security Baseline", desc: "Establish and enforce container security baselines covering image scanning, runtime protection, network policies, secret management, and supply chain integrity for all containerized workloads in production and staging environments.", obj: "Prevent deployment of vulnerable container images and detect runtime compromises across orchestrated environments.", impl: "Integrate image scanning in CI/CD. Deploy runtime monitoring. Enforce Kubernetes network policies and pod security standards. Implement vault-based secret management.", clauses: "ISO 27001 A.8.9 & A.8.25, DORA Art. 9(4)" },
    ],
    "Data Protection & Privacy": [
      { suffix: "DLP", title: "Enterprise Data Loss Prevention Program", desc: "Implement a multi-channel DLP program covering email, web, endpoint, and cloud storage channels. DLP policies shall be aligned with the data classification scheme and enforce automated blocking or quarantine of sensitive data exfiltration attempts.", obj: "Prevent unauthorized data exfiltration across all channels, protecting personal data and confidential information from insider and external threats.", impl: "Deploy DLP across email, web proxy, endpoints, and cloud apps. Create policies mapped to data classification levels. Configure incident workflows. Report monthly on DLP events.", clauses: "GDPR Art. 32(1), ISO 27001 A.8.12, NIS2 Art. 21(2)(d)" },
    ],
    "Risk Management": [
      { suffix: "SCENRIO", title: "Scenario-Based Risk Analysis for Systemic Threats", desc: "Conduct scenario-based risk assessments for systemic and cascading threat scenarios including ransomware pandemic, critical supplier failure, cloud region outage, and coordinated cyber-physical attacks. Scenarios shall be updated annually and validated through simulation exercises.", obj: "Identify and quantify exposure to systemic risks that could cascade across multiple business functions and third parties.", impl: "Define top-10 systemic threat scenarios. Conduct quantitative risk modeling. Run annual simulation exercises. Update risk register with scenario outcomes. Report to board risk committee.", clauses: "DORA Art. 6(5), ISO 27001 Cl. 6.1.2, NIS2 Art. 21(1)" },
    ],
    "Incident & Crisis Management": [
      { suffix: "AUTOMATE", title: "Automated Incident Response & SOAR Integration", desc: "Implement SOAR platform integration to automate initial incident triage, enrichment, containment actions, and notification workflows for predefined incident types. Automated playbooks shall cover at minimum: phishing response, malware containment, account compromise lockout, and DDoS mitigation.", obj: "Reduce mean time to detect (MTTD) and mean time to respond (MTTR) through automated response orchestration, ensuring consistent incident handling.", impl: "Deploy SOAR platform integrated with SIEM, EDR, and firewall APIs. Build automated playbooks for top incident types. Configure approval gates for destructive actions. Measure MTTD/MTTR improvements.", clauses: "NIS2 Art. 23(1), DORA Art. 17(1), ISO 27001 A.5.26" },
    ],
    "Third-Party & Supply Chain": [
      { suffix: "CONTMON", title: "Continuous Third-Party Security Monitoring", desc: "Implement continuous external security monitoring of critical third-party providers using automated security rating services, dark web monitoring for credential leaks, and real-time alerting on vendor-related security events. Monitoring results shall feed into the vendor risk register and trigger reassessment workflows when thresholds are breached.", obj: "Detect third-party security posture degradation between periodic assessments, enabling proactive risk mitigation before incidents occur.", impl: "Subscribe to security ratings platform. Configure continuous monitoring for Tier-1 and Tier-2 vendors. Establish alerting thresholds and reassessment triggers. Integrate with vendor risk register.", clauses: "DORA Art. 28(2) & Art. 30, NIS2 Art. 21(2)(d), ISO 27001 A.5.22" },
    ],
    "Governance & Enterprise Oversight": [
      { suffix: "KPIS", title: "Security Metrics & KPI Framework", desc: "Establish a comprehensive security metrics and KPI framework covering operational security effectiveness, compliance posture, risk reduction progress, and security investment ROI. Metrics shall be collected automatically where possible and presented through dashboards for operational, management, and board-level audiences.", obj: "Enable data-driven security decision-making and demonstrate the value and effectiveness of the security program to stakeholders.", impl: "Define metrics taxonomy across operational, tactical, and strategic tiers. Automate collection from SIEM, vulnerability scanners, GRC, and training platforms. Build role-specific dashboards. Report quarterly to board.", clauses: "ISO 27001 Cl. 9.1, DORA Art. 13(5), NIS2 Art. 20(1)" },
    ],
    "Monitoring & Continuous Improvement": [
      { suffix: "HUNT", title: "Proactive Threat Hunting Program", desc: "Establish a structured threat hunting program that proactively searches for indicators of compromise, advanced persistent threats, and anomalous behaviors that evade automated detection. Hunting hypotheses shall be derived from threat intelligence, incident post-mortems, and MITRE ATT&CK technique coverage gaps.", obj: "Identify advanced threats that bypass automated detection, reducing attacker dwell time and uncovering security control gaps.", impl: "Establish dedicated threat hunting function or retainer. Define hypothesis-driven hunting methodology. Create quarterly hunting calendar. Document and operationalize findings into detection rules. Track mean time to hunt (MTTH).", clauses: "NIS2 Art. 21(2)(b), ISO 27001 A.8.16, DORA Art. 10(1)" },
    ],
  };

  const handleAIGenerate = () => {
    if (aiFrameworks.length === 0 || aiDomains.length === 0) return;
    setAiStep(2);
    setAiGenerating(true);

    setTimeout(() => {
      const generated = [];
      aiDomains.forEach(domain => {
        const templates = AI_CONTROL_TEMPLATES[domain] || [];
        templates.forEach(t => {
          const domainPrefixMap = { "Governance & Enterprise Oversight": "GOV", "Risk Management": "RSK", "Policy & Document Management": "POL", "Third-Party & Supply Chain": "TPR", "Cyber Security": "CYB", "Cloud & Infrastructure Security": "CLD", "Identity & Access Management": "IAM", "Data Protection & Privacy": "DPP", "Incident & Crisis Management": "INC", "Business Continuity & DR": "BCP", "Audit & Assurance": "AUD", "Training & Awareness": "TRN", "Monitoring & Continuous Improvement": "MON" };
          const prefix = domainPrefixMap[domain] || "CTL";
          const existing = controls.filter(c => c.id.startsWith(`ICF-${prefix}-`)).length;
          const id = `ICF-${prefix}-${String(existing + generated.filter(g => g.domain === domain).length + 1).padStart(3, "0")}`;
          generated.push({
            id, title: t.title, domain, status: "Critical Gap",
            frameworks: aiFrameworks.filter(f => t.clauses.includes(f.split(" ")[0]) || Math.random() > 0.3),
            rigor: aiRigor, owner: "Pending Assignment", reviewCycle: "Quarterly", lastReview: "—", evidence: 0, lifecycle: "Draft",
            description: t.desc, objective: t.obj, implementation: t.impl, clauses: t.clauses,
            semanticScore: Math.floor(Math.random() * 10 + 88),
            coverage: Math.random() > 0.3 ? "Full" : "Partial",
            reasonCode: `RC-${Math.floor(Math.random() * 900 + 100)}`,
          });
        });
      });
      // Ensure framework list is reasonable
      generated.forEach(g => { if (g.frameworks.length === 0) g.frameworks = [aiFrameworks[0]]; });
      setAiGenerated(generated);
      setAiSelectedControls(new Set(generated.map(g => g.id)));
      setAiGenerating(false);
      setAiStep(3);
    }, 2500);
  };

  const handleAIImport = () => {
    const toImport = aiGenerated.filter(g => aiSelectedControls.has(g.id)).map(g => ({
      ...g, semanticScore: undefined, coverage: undefined, reasonCode: undefined,
    }));
    const updated = [...toImport, ...controls];
    setControls(updated);
    CONTROLS_DATA = updated;
    setAiStep(4);
    setTimeout(() => {
      setShowAIGenerate(false);
      setAiStep(1);
      setAiFrameworks([]);
      setAiDomains([]);
      setAiGenerated([]);
      setAiSelectedControls(new Set());
    }, 1500);
  };

  const handleCloseAIGenerate = () => {
    setShowAIGenerate(false);
    setAiStep(1);
    setAiFrameworks([]);
    setAiDomains([]);
    setAiGenerated([]);
    setAiSelectedControls(new Set());
    setAiGenerating(false);
  };

  const filtered = controls.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (frameworkFilter !== "All" && !c.frameworks.includes(frameworkFilter)) return false;
    if (domainFilter !== "All" && c.domain !== domainFilter) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Control Library & Mapping Engine</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Unified controls mapped across {FRAMEWORKS.length} regulatory frameworks</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
          <Button icon={Upload} variant="secondary" onClick={() => setShowBulkImport(true)}>Import Excel</Button>
          <Button icon={Zap} variant="secondary" onClick={() => setShowAIGenerate(true)} style={{ background: COLORS.accentLight, color: COLORS.accent, border: `1px solid ${COLORS.accent}30` }}>AI Generate</Button>
          <Button icon={Plus} onClick={() => setShowNewControl(true)}>New Control</Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <SearchBar placeholder="Search controls..." value={search} onChange={setSearch} style={{ width: 300 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${statusFilter !== "All" ? COLORS.primary : COLORS.border}`, fontSize: 13, color: statusFilter !== "All" ? COLORS.primary : COLORS.text, background: statusFilter !== "All" ? COLORS.primaryLight : COLORS.surface, fontWeight: statusFilter !== "All" ? 600 : 400 }}>
          <option value="All">All Status</option>
          <option value="Compliant">Compliant</option>
          <option value="Partial">Partial</option>
          <option value="Critical Gap">Critical Gap</option>
        </select>
        <select value={frameworkFilter} onChange={e => setFrameworkFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${frameworkFilter !== "All" ? COLORS.primary : COLORS.border}`, fontSize: 13, color: frameworkFilter !== "All" ? COLORS.primary : COLORS.text, background: frameworkFilter !== "All" ? COLORS.primaryLight : COLORS.surface, fontWeight: frameworkFilter !== "All" ? 600 : 400 }}>
          <option value="All">All Frameworks</option>
          {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${domainFilter !== "All" ? COLORS.primary : COLORS.border}`, fontSize: 13, color: domainFilter !== "All" ? COLORS.primary : COLORS.text, background: domainFilter !== "All" ? COLORS.primaryLight : COLORS.surface, fontWeight: domainFilter !== "All" ? 600 : 400 }}>
          <option value="All">All Domains</option>
          {DOMAIN_LIST.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(search || statusFilter !== "All" || frameworkFilter !== "All" || domainFilter !== "All") && (
          <button onClick={() => { setSearch(""); setStatusFilter("All"); setFrameworkFilter("All"); setDomainFilter("All"); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10,
              border: `1px solid ${COLORS.danger}20`, background: COLORS.dangerLight, color: COLORS.danger,
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.danger}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLORS.dangerLight; }}
          ><X size={13} /> Clear filters</button>
        )}
        <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 2 }}>{filtered.length} controls</span>
      </div>

      <Card>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TableHeader>Control ID</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Domain</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Rigor</TableHeader>
                <TableHeader>Frameworks</TableHeader>
                <TableHeader>Lifecycle</TableHeader>
                <TableHeader style={{ textAlign: "center" }}>Evidence</TableHeader>
                <TableHeader>Owner</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ cursor: "pointer" }}
                  onClick={() => setSelectedControl(c)}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <TableCell><span style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>{c.id}</span></TableCell>
                  <TableCell style={{ maxWidth: 420 }}>
                    <div>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{c.title}</span>
                      <div style={{ fontSize: 11.5, color: COLORS.textMuted, lineHeight: 1.5, marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {c.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{c.domain}</span></TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell><Badge variant={c.rigor === "Critical" ? "danger" : c.rigor === "High" ? "warning" : "default"}>{c.rigor}</Badge></TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {c.frameworks.slice(0, 3).map(f => <Badge key={f} variant="primary" size="xs">{f}</Badge>)}
                      {c.frameworks.length > 3 && <Badge size="xs">+{c.frameworks.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={c.lifecycle} /></TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.evidence > 0 ? COLORS.primary : COLORS.danger }}>{c.evidence}</span>
                  </TableCell>
                  <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{c.owner}</span></TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Control Detail Modal */}
      <Modal open={!!selectedControl} onClose={() => setSelectedControl(null)} title={selectedControl?.id} width={780}>
        {selectedControl && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 6px" }}>{selectedControl.title}</h3>
              <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{selectedControl.domain}</span>
            </div>

            {/* Control Description */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Control Description</div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7, background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${COLORS.primary}` }}>
                {selectedControl.description}
              </div>
            </div>

            {/* Control Objective */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Control Objective</div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7, background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${COLORS.success}` }}>
                {selectedControl.objective}
              </div>
            </div>

            {/* Properties Grid — clickable statuses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {/* Compliance Status — clickable */}
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Compliance Status</div>
                <button onClick={() => openStatusChange("compliance")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", background: "none", border: "none", cursor: "pointer" }}>
                  <StatusBadge status={selectedControl.status} />
                  <Edit size={12} color={COLORS.textMuted} />
                </button>
                {getAvailableTransitions(selectedControl.status, "compliance").length > 0 && (
                  <div style={{ fontSize: 10, color: COLORS.primary, marginTop: 3, cursor: "pointer" }} onClick={() => openStatusChange("compliance")}>
                    Can transition to: {getAvailableTransitions(selectedControl.status, "compliance").join(", ")}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Rigor</div>
                <div style={{ fontSize: 13, color: COLORS.text }}><Badge variant={selectedControl.rigor === "Critical" ? "danger" : "warning"}>{selectedControl.rigor}</Badge></div>
              </div>
              {/* Lifecycle Status — clickable */}
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Lifecycle</div>
                <button onClick={() => openStatusChange("lifecycle")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", background: "none", border: "none", cursor: "pointer" }}>
                  <StatusBadge status={selectedControl.lifecycle} />
                  <Edit size={12} color={COLORS.textMuted} />
                </button>
                {getAvailableTransitions(selectedControl.lifecycle, "lifecycle").length > 0 && (
                  <div style={{ fontSize: 10, color: COLORS.primary, marginTop: 3, cursor: "pointer" }} onClick={() => openStatusChange("lifecycle")}>
                    Can transition to: {getAvailableTransitions(selectedControl.lifecycle, "lifecycle").join(", ")}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Owner</div>
                <div style={{ fontSize: 13, color: COLORS.text }}>{selectedControl.owner}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Review Cycle</div>
                <div style={{ fontSize: 13, color: COLORS.text }}>{selectedControl.reviewCycle}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Last Review</div>
                <div style={{ fontSize: 13, color: COLORS.text }}>{selectedControl.lastReview}</div>
              </div>
            </div>

            {/* Status Change Audit Trail (if exists for this control) */}
            {statusChangeHistory.filter(h => h.controlId === selectedControl.id).length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Status Change History</div>
                <div style={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: 10, overflow: "hidden" }}>
                  {statusChangeHistory.filter(h => h.controlId === selectedControl.id).map((h, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderBottom: i < statusChangeHistory.filter(x => x.controlId === selectedControl.id).length - 1 ? `1px solid ${COLORS.borderLight}` : "none", fontSize: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Clock size={12} color={COLORS.textMuted} />
                        <span style={{ color: COLORS.textMuted }}>{h.timestamp}</span>
                        <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>{h.user}</span>
                        <Badge size="xs">{h.role}</Badge>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ textTransform: "capitalize", fontSize: 11, color: COLORS.textMuted }}>{h.type}:</span>
                        <StatusBadge status={h.from} />
                        <ArrowRight size={12} color={COLORS.textMuted} />
                        <StatusBadge status={h.to} />
                      </div>
                      <div style={{ color: COLORS.textSecondary, lineHeight: 1.5, paddingLeft: 2 }}>{h.justification}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Authorization Info */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Role Authorization Matrix</div>
              <div style={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <TableHeader style={{ fontSize: 10 }}>Role</TableHeader>
                      <TableHeader style={{ fontSize: 10, textAlign: "center" }}>Change Compliance</TableHeader>
                      <TableHeader style={{ fontSize: 10, textAlign: "center" }}>Change Lifecycle</TableHeader>
                      <TableHeader style={{ fontSize: 10, textAlign: "center" }}>Approve N/A</TableHeader>
                      <TableHeader style={{ fontSize: 10, textAlign: "center" }}>Approve Active</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Super Admin", true, true, true, true],
                      ["Compliance Officer", true, true, true, true],
                      ["Security Manager", "Partial only", "Draft/Review", false, false],
                      ["Internal Auditor", false, false, false, false],
                      ["Executive Viewer", false, false, false, false],
                    ].map(([role, comp, life, na, active]) => (
                      <tr key={role} style={{ background: role === CURRENT_USER.role ? `${COLORS.primary}06` : "transparent" }}>
                        <TableCell style={{ fontSize: 12, fontWeight: role === CURRENT_USER.role ? 600 : 400 }}>
                          {role} {role === CURRENT_USER.role && <span style={{ fontSize: 9, color: COLORS.primary }}>(YOU)</span>}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {comp === true ? <Check size={14} color={COLORS.success} /> : comp === false ? <X size={14} color={COLORS.border} /> : <span style={{ fontSize: 10, color: COLORS.warning }}>{comp}</span>}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {life === true ? <Check size={14} color={COLORS.success} /> : life === false ? <X size={14} color={COLORS.border} /> : <span style={{ fontSize: 10, color: COLORS.warning }}>{life}</span>}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>{na ? <Check size={14} color={COLORS.success} /> : <X size={14} color={COLORS.border} />}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{active ? <Check size={14} color={COLORS.success} /> : <X size={14} color={COLORS.border} />}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Implementation Guidance */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Implementation Guidance</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7, background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${COLORS.accent}` }}>
                {selectedControl.implementation}
              </div>
            </div>

            {/* Regulatory Clause References */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Regulatory Clause References</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedControl.clauses.split(", ").map((clause, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 6,
                    background: COLORS.infoLight, color: COLORS.info, fontSize: 11, fontWeight: 500,
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.2,
                  }}>{clause}</span>
                ))}
              </div>
            </div>

            {/* Mapped Frameworks */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Mapped Frameworks</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedControl.frameworks.map(f => <Badge key={f} variant="primary">{f}</Badge>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>AI Mapping Traceability</div>
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: 14, fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                <strong>Semantic Analysis:</strong> Control intent matches across {selectedControl.frameworks.length} frameworks with high confidence.<br />
                <strong>Coverage:</strong> Full coverage for primary clauses. Partial coverage noted for supplementary requirements.<br />
                <strong>HCF Rigor:</strong> Control synthesized at <span style={{ color: COLORS.danger, fontWeight: 600 }}>{selectedControl.rigor}</span> level based on strictest mapped requirement.<br />
                <strong>Reason Code:</strong> RC-{Math.floor(Math.random() * 900 + 100)} — Superset control satisfies all mapped clause objectives.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {canEditAny() ? (
                <Button variant="secondary" icon={Edit} onClick={openEditControl}>Edit Control</Button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Button variant="secondary" icon={Edit} style={{ opacity: 0.4, cursor: "not-allowed" }}>Edit Control</Button>
                  <span style={{ fontSize: 10, color: COLORS.textMuted }}>
                    {!EDITABLE_LIFECYCLE_STATES[selectedControl.lifecycle] && !LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role) ? `Locked (${selectedControl.lifecycle})` : "No edit permission"}
                  </span>
                </div>
              )}
              <Button variant="secondary" icon={RefreshCw} onClick={() => openStatusChange("compliance")}>Change Status</Button>
              <Button icon={FileCheck}>Link Evidence</Button>
            </div>

            {/* Edit History */}
            {editHistory.filter(h => h.controlId === selectedControl.id).length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Edit History</div>
                <div style={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: 10, overflow: "hidden" }}>
                  {editHistory.filter(h => h.controlId === selectedControl.id).map((h, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderBottom: i < editHistory.filter(x => x.controlId === selectedControl.id).length - 1 ? `1px solid ${COLORS.borderLight}` : "none", fontSize: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Edit size={12} color={COLORS.primary} />
                        <span style={{ color: COLORS.textMuted }}>{h.timestamp}</span>
                        <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>{h.user}</span>
                        <Badge size="xs">{h.role}</Badge>
                        {h.requiresApproval && <Badge variant="warning" size="xs">Pending Approval</Badge>}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                        {h.fieldsChanged.map(f => <Badge key={f} variant="primary" size="xs">{f}</Badge>)}
                      </div>
                      <div style={{ color: COLORS.textSecondary, lineHeight: 1.5 }}>{h.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ══════════════ Status Change Modal ══════════════ */}
      <Modal open={showStatusChange && !!selectedControl} onClose={() => { setShowStatusChange(false); setStatusChangeType(null); }} title={`Change ${statusChangeType === "compliance" ? "Compliance Status" : "Lifecycle State"}`} width={620}>
        {selectedControl && statusChangeType && (() => {
          const currentVal = statusChangeType === "compliance" ? selectedControl.status : selectedControl.lifecycle;
          const available = getAvailableTransitions(currentVal, statusChangeType);
          const requirements = statusChangeTarget ? getTransitionRequirements(currentVal, statusChangeTarget, statusChangeType) : [];

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Current state info */}
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>Control</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{selectedControl.id} — {selectedControl.title}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Current {statusChangeType === "compliance" ? "Status" : "State"}</div>
                  <StatusBadge status={currentVal} />
                </div>
                <ArrowRight size={18} color={COLORS.textMuted} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>New {statusChangeType === "compliance" ? "Status" : "State"}</div>
                  {statusChangeTarget ? <StatusBadge status={statusChangeTarget} /> : <span style={{ fontSize: 12, color: COLORS.textMuted }}>Select below</span>}
                </div>
              </div>

              {/* Available transitions */}
              {available.length > 0 ? (
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>Available Transitions</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {available.map(s => {
                      const active = statusChangeTarget === s;
                      const sInfo = STATUS_MAP[s] || {};
                      return (
                        <button key={s} onClick={() => setStatusChangeTarget(s)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, cursor: "pointer",
                            border: `2px solid ${active ? (sInfo.color || COLORS.primary) : COLORS.border}`,
                            background: active ? (sInfo.bg || COLORS.primaryLight) : COLORS.surface,
                            transition: "all 0.12s", flex: "1 1 auto", minWidth: 120,
                          }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: sInfo.color || COLORS.textMuted, border: active ? "none" : `1px solid ${COLORS.border}` }} />
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? (sInfo.color || COLORS.text) : COLORS.textSecondary }}>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={16} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                    <strong>No transitions available.</strong> Your role ({CURRENT_USER.role}) does not have permission to change the {statusChangeType} from "{currentVal}", or there are no valid next states in the workflow.
                  </div>
                </div>
              )}

              {/* Requirements for selected transition */}
              {statusChangeTarget && requirements.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
                    Transition Requirements: {currentVal} → {statusChangeTarget}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {requirements.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 8, background: COLORS.surfaceAlt }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: r.required ? COLORS.dangerLight : COLORS.surfaceAlt, border: `1.5px solid ${r.required ? COLORS.danger : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: r.required ? COLORS.danger : COLORS.textMuted }}>{r.required ? "!" : "?"}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{r.label} {r.required && <span style={{ fontSize: 10, color: COLORS.danger }}>(Required)</span>}</div>
                          <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{r.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Justification & Evidence */}
              {statusChangeTarget && (
                <>
                  <FormField label="Justification / Rationale" required hint="Provide a detailed explanation for this status change — this will be recorded in the immutable audit trail">
                    <FormTextarea value={statusChangeJustification} onChange={setStatusChangeJustification}
                      placeholder={statusChangeType === "compliance" && statusChangeTarget === "Compliant"
                        ? "All mapped framework requirements have been satisfied. Evidence artifacts EV-001 through EV-004 are linked and approved. Last assessment conducted on..."
                        : statusChangeType === "compliance" && statusChangeTarget === "Partial"
                        ? "The control partially meets requirements. Gaps identified in: [specific area]. Remediation plan targets completion by..."
                        : statusChangeTarget === "Critical Gap"
                        ? "The control does not meet minimum requirements due to: [root cause]. Remediation priority assigned as P1 with target date..."
                        : "Provide justification for this transition..."
                      } rows={4} />
                  </FormField>

                  <FormField label="Supporting Evidence Reference" hint="Optional — reference evidence IDs, audit findings, or assessment reports">
                    <FormInput value={statusChangeEvidence} onChange={setStatusChangeEvidence} placeholder="e.g., EV-001, EV-002, Audit Finding AF-2026-003" />
                  </FormField>

                  {/* Audit preview */}
                  <div style={{ background: COLORS.infoLight, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Lock size={14} color={COLORS.info} style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ fontSize: 11, color: COLORS.info, lineHeight: 1.5 }}>
                      This change will be recorded as an <strong>immutable audit trail entry</strong> with timestamp, your identity ({CURRENT_USER.name}), role ({CURRENT_USER.role}), justification, and evidence references. Audit entries are retained for <strong>7 years</strong> per DORA compliance requirements.
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}` }}>
                <Button variant="ghost" onClick={() => { setShowStatusChange(false); setStatusChangeType(null); }}>Cancel</Button>
                <Button icon={Check} onClick={handleStatusChange}
                  style={{
                    background: statusChangeTarget && statusChangeJustification.trim() ? COLORS.success : COLORS.border,
                    cursor: statusChangeTarget && statusChangeJustification.trim() ? "pointer" : "not-allowed",
                  }}>
                  Confirm Transition
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ══════════════ Edit Control Modal ══════════════ */}
      <Modal open={showEditControl && !!selectedControl} onClose={() => setShowEditControl(false)} title={`Edit Control — ${selectedControl?.id || ""}`} width={740}>
        {selectedControl && (() => {
          const changeCount = Object.keys(editChanges).length;
          const fieldAuth = EDIT_FIELD_AUTH[CURRENT_USER.role] || {};
          const isLockedState = !EDITABLE_LIFECYCLE_STATES[selectedControl.lifecycle];
          const hasOverride = LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role);

          const FIELD_LABELS = {
            title: "Control Title", domain: "Domain", description: "Control Description", objective: "Control Objective",
            implementation: "Implementation Guidance", clauses: "Regulatory Clause References", frameworks: "Mapped Frameworks",
            rigor: "Rigor Level", owner: "Control Owner", reviewCycle: "Review Cycle",
          };

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Info Banner */}
              {isLockedState && hasOverride && (
                <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={15} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                    This control is in <strong>{selectedControl.lifecycle}</strong> state, which normally locks editing. Your role (<strong>{CURRENT_USER.role}</strong>) has override authority. Changes will be flagged for audit review.
                  </div>
                </div>
              )}

              {/* Edit Permission Legend */}
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
                  Field Edit Permissions — {CURRENT_USER.role}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.entries(FIELD_LABELS).map(([key, label]) => {
                    const allowed = fieldAuth[key] && (EDITABLE_LIFECYCLE_STATES[selectedControl.lifecycle] || hasOverride);
                    return (
                      <span key={key} style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                        background: allowed ? COLORS.successLight : COLORS.surfaceAlt,
                        color: allowed ? COLORS.success : COLORS.textMuted,
                        border: `1px solid ${allowed ? COLORS.success + "40" : COLORS.border}`,
                        textDecoration: allowed ? "none" : "line-through",
                      }}>
                        {allowed ? "✓ " : ""}{label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Editable Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <FormField label="Control Title" required>
                  <FormInput value={editForm.title || ""} onChange={v => setEditField("title", v)} placeholder="Control title..."
                    disabled={!canEditField("title")} style={!canEditField("title") ? { opacity: 0.5, cursor: "not-allowed" } : {}} />
                  {editChanges.title && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                </FormField>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <FormField label="Domain">
                    <FormSelect value={editForm.domain || ""} onChange={v => setEditField("domain", v)} options={ALL_DOMAINS} placeholder="Select..."
                      disabled={!canEditField("domain")} />
                    {editChanges.domain && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                  </FormField>
                  <FormField label="Rigor Level">
                    <FormSelect value={editForm.rigor || ""} onChange={v => setEditField("rigor", v)} options={RIGOR_OPTIONS} placeholder="Select..."
                      disabled={!canEditField("rigor")} />
                    {editChanges.rigor && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                  </FormField>
                  <FormField label="Owner">
                    <FormSelect value={editForm.owner || ""} onChange={v => setEditField("owner", v)} options={OWNER_OPTIONS} placeholder="Select..."
                      disabled={!canEditField("owner")} />
                    {editChanges.owner && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                  </FormField>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormField label="Review Cycle">
                    <FormSelect value={editForm.reviewCycle || ""} onChange={v => setEditField("reviewCycle", v)} options={REVIEW_OPTIONS} placeholder="Select..."
                      disabled={!canEditField("reviewCycle")} />
                    {editChanges.reviewCycle && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                  </FormField>
                  <FormField label="Mapped Frameworks">
                    {canEditField("frameworks") ? (
                      <FrameworkCheckboxes selected={editForm.frameworks || []} onChange={v => setEditField("frameworks", v)} />
                    ) : (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", opacity: 0.5 }}>
                        {(editForm.frameworks || []).map(f => <Badge key={f} variant="primary">{f}</Badge>)}
                      </div>
                    )}
                    {editChanges.frameworks && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                  </FormField>
                </div>

                <FormField label="Control Description">
                  <FormTextarea value={editForm.description || ""} onChange={v => setEditField("description", v)} rows={4}
                    disabled={!canEditField("description")} />
                  {editChanges.description && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                </FormField>

                <FormField label="Control Objective">
                  <FormTextarea value={editForm.objective || ""} onChange={v => setEditField("objective", v)} rows={3}
                    disabled={!canEditField("objective")} />
                  {editChanges.objective && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                </FormField>

                <FormField label="Implementation Guidance">
                  <FormTextarea value={editForm.implementation || ""} onChange={v => setEditField("implementation", v)} rows={3}
                    disabled={!canEditField("implementation")} />
                  {editChanges.implementation && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                </FormField>

                <FormField label="Regulatory Clause References">
                  <FormInput value={editForm.clauses || ""} onChange={v => setEditField("clauses", v)} placeholder="Comma-separated clause references"
                    disabled={!canEditField("clauses")} />
                  {editChanges.clauses && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
                </FormField>
              </div>

              {/* Change Summary */}
              {changeCount > 0 && (
                <div style={{ border: `1px solid ${COLORS.primary}30`, borderRadius: 10, padding: "14px 16px", background: `${COLORS.primaryLight}60` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
                    Change Summary — {changeCount} field{changeCount > 1 ? "s" : ""} modified
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {Object.entries(editChanges).map(([field, { from, to }]) => (
                      <div key={field} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: COLORS.text, minWidth: 120 }}>{FIELD_LABELS[field] || field}:</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: COLORS.danger, textDecoration: "line-through", fontSize: 11 }}>
                            {Array.isArray(from) ? from.join(", ") : (typeof from === "string" && from.length > 80 ? from.slice(0, 80) + "…" : from)}
                          </span>
                          <span style={{ color: COLORS.textMuted, margin: "0 6px" }}>→</span>
                          <span style={{ color: COLORS.success, fontSize: 11 }}>
                            {Array.isArray(to) ? to.join(", ") : (typeof to === "string" && to.length > 80 ? to.slice(0, 80) + "…" : to)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Change Reason */}
              {changeCount > 0 && (
                <FormField label="Change Reason / Justification" required hint="Required — recorded in the immutable audit trail">
                  <FormTextarea value={editChangeReason} onChange={setEditChangeReason} rows={2}
                    placeholder="Explain why these changes are being made (e.g., updated to reflect new regulatory guidance, corrected mapping errors, enhanced based on audit feedback)..." />
                </FormField>
              )}

              {/* Approval workflow info */}
              {changeCount > 0 && !LIFECYCLE_EDIT_OVERRIDE_ROLES.includes(CURRENT_USER.role) && selectedControl.lifecycle !== "Draft" && (
                <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertCircle size={15} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                    Changes to controls in <strong>{selectedControl.lifecycle}</strong> state by <strong>{CURRENT_USER.role}</strong> require Compliance Officer or Super Admin approval before they take effect.
                  </div>
                </div>
              )}

              <div style={{ background: COLORS.infoLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Lock size={14} color={COLORS.info} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: COLORS.info, lineHeight: 1.5 }}>
                  All changes are version-controlled. A diff of every modified field, your identity, role, and justification will be stored as an <strong>immutable audit entry</strong> retained for 7 years.
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}` }}>
                <Button variant="ghost" onClick={() => setShowEditControl(false)}>Cancel</Button>
                <Button icon={Check} onClick={handleSaveEdit}
                  style={{
                    background: changeCount > 0 && editChangeReason.trim() ? COLORS.success : COLORS.border,
                    cursor: changeCount > 0 && editChangeReason.trim() ? "pointer" : "not-allowed",
                  }}>
                  {changeCount > 0 ? `Save ${changeCount} Change${changeCount > 1 ? "s" : ""}` : "No Changes"}
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── New Control Wizard Modal ── */}
      <Modal open={showNewControl} onClose={handleCloseWizard} title="Create New Control" width={740}>
        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
          {WIZARD_STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                  background: wizardStep > step.id ? COLORS.success : wizardStep === step.id ? COLORS.primary : COLORS.surfaceAlt,
                  color: wizardStep >= step.id ? "#fff" : COLORS.textMuted,
                }}>
                  {wizardStep > step.id ? <Check size={14} /> : step.id}
                </div>
                <span style={{ fontSize: 12, fontWeight: wizardStep === step.id ? 600 : 400, color: wizardStep === step.id ? COLORS.text : COLORS.textMuted, whiteSpace: "nowrap" }}>{step.label}</span>
              </div>
              {i < WIZARD_STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: wizardStep > step.id ? COLORS.success : COLORS.borderLight, margin: "0 12px", borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {wizardStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Control Title" required hint="A clear, concise title describing the control requirement">
              <FormInput value={form.title} onChange={v => setField("title", v)} placeholder="e.g., Endpoint Detection & Response Deployment" />
              {formErrors.title && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.title}</span>}
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Domain" required>
                <FormSelect value={form.domain} onChange={v => setField("domain", v)} options={ALL_DOMAINS} placeholder="Select domain..." />
                {formErrors.domain && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.domain}</span>}
              </FormField>
              <FormField label="Rigor Level" required hint="HCF rigor based on strictest mapped requirement">
                <FormSelect value={form.rigor} onChange={v => setField("rigor", v)} options={RIGOR_OPTIONS} placeholder="Select rigor..." />
                {formErrors.rigor && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.rigor}</span>}
              </FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Control Owner" required>
                <FormSelect value={form.owner} onChange={v => setField("owner", v)} options={OWNER_OPTIONS} placeholder="Select owner..." />
                {formErrors.owner && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.owner}</span>}
              </FormField>
              <FormField label="Review Cycle" required>
                <FormSelect value={form.reviewCycle} onChange={v => setField("reviewCycle", v)} options={REVIEW_OPTIONS} placeholder="Select cycle..." />
                {formErrors.reviewCycle && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.reviewCycle}</span>}
              </FormField>
            </div>
          </div>
        )}

        {/* Step 2: Description & Objective */}
        {wizardStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Control Description" required hint="Detailed description of what the control requires, including specific technical and procedural requirements">
              <FormTextarea value={form.description} onChange={v => setField("description", v)} placeholder="The organization shall establish, implement, and maintain..." rows={6} />
              {formErrors.description && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.description}</span>}
            </FormField>
            <FormField label="Control Objective" required hint="Why this control exists, which regulatory articles it satisfies, and what outcome it achieves">
              <FormTextarea value={form.objective} onChange={v => setField("objective", v)} placeholder="Ensure that the organization maintains... Satisfies ISO 27001 Annex A..., NIS2 Article..., DORA Article..." rows={5} />
              {formErrors.objective && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.objective}</span>}
            </FormField>
          </div>
        )}

        {/* Step 3: Framework Mapping & Implementation */}
        {wizardStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Applicable Frameworks" required hint="Select all regulatory frameworks this control maps to">
              <FrameworkCheckboxes selected={form.frameworks} onChange={v => setField("frameworks", v)} />
              {formErrors.frameworks && <span style={{ fontSize: 11, color: COLORS.danger }}>{formErrors.frameworks}</span>}
            </FormField>
            <FormField label="Implementation Guidance" hint="Practical steps for deploying this control (optional — can be completed later)">
              <FormTextarea value={form.implementation} onChange={v => setField("implementation", v)} placeholder="Deploy enterprise-grade tooling for... Configure automated alerts... Establish review cadence..." rows={4} />
            </FormField>
            <FormField label="Regulatory Clause References" hint="Specific clause/article references, comma-separated (optional — AI can auto-map)">
              <FormInput value={form.clauses} onChange={v => setField("clauses", v)} placeholder="e.g., ISO 27001 A.8.8, NIS2 Art. 21(2)(e), PCI DSS Req. 6.3" />
            </FormField>
          </div>
        )}

        {/* Step 4: Review & Create */}
        {wizardStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={16} color={COLORS.primary} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{form.title || "Untitled Control"}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{form.domain || "No domain"} · Created as <strong>Draft</strong> with <strong>Critical Gap</strong> status</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[["Rigor", form.rigor], ["Owner", form.owner], ["Review", form.reviewCycle], ["Frameworks", `${form.frameworks.length} selected`]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 13, color: v ? COLORS.text : COLORS.danger, fontWeight: 500 }}>{v || "Missing"}</div>
                  </div>
                ))}
              </div>

              {form.frameworks.length > 0 && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                  {form.frameworks.map(f => <Badge key={f} variant="primary">{f}</Badge>)}
                </div>
              )}

              {form.description && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6, borderLeft: `3px solid ${COLORS.primary}`, paddingLeft: 12 }}>
                    {form.description.length > 300 ? form.description.slice(0, 300) + "…" : form.description}
                  </div>
                </div>
              )}

              {form.objective && (
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Objective</div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6, borderLeft: `3px solid ${COLORS.success}`, paddingLeft: 12 }}>
                    {form.objective.length > 300 ? form.objective.slice(0, 300) + "…" : form.objective}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: COLORS.infoLight, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <Zap size={16} color={COLORS.info} style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: COLORS.info, lineHeight: 1.5 }}>
                <strong>What happens next:</strong> The control will be created in <strong>Draft</strong> lifecycle with <strong>Critical Gap</strong> compliance status. The AI Mapping Engine will automatically perform semantic analysis to validate framework mappings and generate traceability records. You can then link evidence, adjust mappings, and promote through the approval workflow.
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${COLORS.borderLight}` }}>
          <div>
            {wizardStep > 1 && <Button variant="secondary" icon={ChevronLeft} onClick={handleBack}>Back</Button>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={handleCloseWizard}>Cancel</Button>
            {wizardStep < 4 ? (
              <Button icon={ChevronRight} onClick={handleNext}>Continue</Button>
            ) : (
              <Button icon={Check} onClick={handleCreate} style={{ background: COLORS.success }}>Create Control</Button>
            )}
          </div>
        </div>
      </Modal>

      {/* ══════════════ Bulk Import Modal ══════════════ */}
      <Modal open={showBulkImport} onClose={handleCloseBulkImport} title="Import Controls from Excel" width={720}>
        {/* Step 1: Upload */}
        {importStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
              Upload an Excel file (.xlsx) containing controls with the required column structure. Each row represents one control with all fields including AI mapping traceability details.
            </div>

            {/* Template download */}
            <div style={{ background: COLORS.primaryLight, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Download size={16} color={COLORS.primary} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>Download Template</div>
                  <div style={{ fontSize: 11, color: COLORS.primary, opacity: 0.7 }}>ICF_Control_Import_Template.xlsx — {TEMPLATE_COLUMNS.length} columns</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon={Download}>Download</Button>
            </div>

            {/* Required columns */}
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>Required Column Structure</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {TEMPLATE_COLUMNS.map((col, i) => (
                  <span key={col} style={{ padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                    background: i < 14 ? COLORS.primaryLight : COLORS.accentLight, color: i < 14 ? COLORS.primary : COLORS.accent }}>
                    {col}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: COLORS.primaryLight, marginRight: 4, verticalAlign: "middle" }} /> Core fields
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: COLORS.accentLight, marginLeft: 12, marginRight: 4, verticalAlign: "middle" }} /> AI Traceability fields (optional)
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setImportDragOver(true); }}
              onDragLeave={() => setImportDragOver(false)}
              onDrop={e => { e.preventDefault(); setImportDragOver(false); handleImportFile(e.dataTransfer.files[0]); }}
              onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".xlsx,.xls,.csv"; inp.onchange = e => handleImportFile(e.target.files[0]); inp.click(); }}
              style={{
                border: `2px dashed ${importDragOver ? COLORS.primary : COLORS.border}`,
                borderRadius: 12, padding: "36px 20px", textAlign: "center", cursor: "pointer",
                background: importDragOver ? COLORS.primaryLight : COLORS.surfaceAlt,
                transition: "all 0.15s",
              }}>
              <Upload size={28} color={importDragOver ? COLORS.primary : COLORS.textMuted} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>Drop your Excel file here or click to browse</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Supports .xlsx, .xls, and .csv formats</div>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Map */}
        {importStep === 2 && importPreview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* File Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.successLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileCheck size={18} color={COLORS.success} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{importPreview.fileName}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{importPreview.fileSize} · {importPreview.columns.length} columns detected</div>
              </div>
              <button onClick={() => { setImportStep(1); setImportFile(null); setImportPreview(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={16} color={COLORS.textMuted} /></button>
            </div>

            {/* Validation Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: COLORS.successLight, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.success }}>{importPreview.validRows}</div>
                <div style={{ fontSize: 11, color: COLORS.success, fontWeight: 500 }}>Valid Rows</div>
              </div>
              <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.warning }}>{importPreview.warningRows}</div>
                <div style={{ fontSize: 11, color: COLORS.warning, fontWeight: 500 }}>Warnings</div>
              </div>
              <div style={{ background: COLORS.dangerLight, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.danger }}>{importPreview.errorRows}</div>
                <div style={{ fontSize: 11, color: COLORS.danger, fontWeight: 500 }}>Errors (skipped)</div>
              </div>
            </div>

            {/* Preview Table */}
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Row Preview</div>
            <div style={{ overflow: "auto", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <TableHeader></TableHeader>
                    <TableHeader>Control ID</TableHeader>
                    <TableHeader>Title</TableHeader>
                    <TableHeader>Domain</TableHeader>
                    <TableHeader>Rigor</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.sampleRows.map((r, i) => (
                    <tr key={i} style={{ background: !r.valid ? `${COLORS.danger}06` : "transparent" }}>
                      <TableCell style={{ width: 30 }}>
                        {r.valid ? <CheckCircle size={14} color={COLORS.success} /> : <XCircle size={14} color={COLORS.danger} />}
                      </TableCell>
                      <TableCell><span style={{ fontFamily: "monospace", fontSize: 11, color: r.id ? COLORS.primary : COLORS.danger }}>{r.id || "MISSING"}</span></TableCell>
                      <TableCell><span style={{ fontSize: 12, fontWeight: 500 }}>{r.title}</span></TableCell>
                      <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary }}>{r.domain}</span></TableCell>
                      <TableCell>{r.rigor ? <Badge variant={r.rigor === "Critical" ? "danger" : "warning"}>{r.rigor}</Badge> : <span style={{ fontSize: 11, color: COLORS.danger }}>—</span>}</TableCell>
                      <TableCell>
                        {r.valid ? <Badge variant="default">Ready</Badge> : <span style={{ fontSize: 11, color: COLORS.danger }}>{r.error}</span>}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button variant="secondary" icon={ChevronLeft} onClick={() => { setImportStep(1); setImportFile(null); setImportPreview(null); }}>Back</Button>
              <Button icon={Check} onClick={handleImportConfirm}>Import {importPreview.validRows} Controls</Button>
            </div>
          </div>
        )}

        {/* Step 3: Importing */}
        {importStep === 3 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.primaryLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={24} color={COLORS.primary} style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Importing Controls...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Validating data, generating IDs, and running AI semantic analysis</div>
            <div style={{ marginTop: 20, maxWidth: 300, marginInline: "auto" }}><ProgressBar value={65} color={COLORS.primary} height={6} /></div>
          </div>
        )}

        {/* Step 4: Done */}
        {importStep === 4 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <CheckCircle size={28} color={COLORS.success} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Import Complete!</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>3 controls successfully imported as Draft with AI mapping traceability generated</div>
            <Button onClick={handleCloseBulkImport}>View Controls</Button>
          </div>
        )}
      </Modal>

      {/* ══════════════ AI Generate Modal ══════════════ */}
      <Modal open={showAIGenerate} onClose={handleCloseAIGenerate} title="Create Controls Based on Framework (AI)" width={780}>
        {/* Step 1: Configure */}
        {aiStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.primaryLight})`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Zap size={20} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>AI-Powered Control Generation</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  Select the frameworks and domains you want to target. The AI engine will analyze regulatory requirements, perform semantic cross-mapping, and generate fully populated controls with descriptions, objectives, implementation guidance, clause references, and HCF rigor analysis.
                </div>
              </div>
            </div>

            <FormField label="Target Frameworks" required hint="Select frameworks the AI should analyze for control generation">
              <FrameworkCheckboxes selected={aiFrameworks} onChange={setAiFrameworks} />
              {aiFrameworks.length === 0 && <span style={{ fontSize: 11, color: COLORS.textMuted }}>Select at least one framework</span>}
            </FormField>

            <FormField label="Target Domains" required hint="Select which ICF domains to generate controls for">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DOMAINS.map(d => {
                  const active = aiDomains.includes(d.name);
                  const Icon = d.icon;
                  return (
                    <button key={d.name} onClick={() => setAiDomains(active ? aiDomains.filter(x => x !== d.name) : [...aiDomains, d.name])}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                        border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
                        background: active ? COLORS.primaryLight : COLORS.surface,
                        color: active ? COLORS.primary : COLORS.textSecondary,
                        fontWeight: active ? 600 : 400, transition: "all 0.12s",
                      }}>
                      <Icon size={13} />
                      {d.name.length > 28 ? d.name.slice(0, 26) + "…" : d.name}
                    </button>
                  );
                })}
              </div>
              {aiDomains.length === 0 && <span style={{ fontSize: 11, color: COLORS.textMuted }}>Select at least one domain</span>}
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Default Rigor Level" hint="HCF rigor for generated controls (adjustable per control later)">
                <FormSelect value={aiRigor} onChange={setAiRigor} options={["Critical", "High", "Medium"]} placeholder="Select rigor..." />
              </FormField>
              <FormField label="Estimated Output" hint="Based on your selection">
                <div style={{ padding: "9px 12px", borderRadius: 8, background: COLORS.surfaceAlt, fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
                  ~{aiDomains.length * 1 + Math.min(aiDomains.length, 2)} controls across {aiDomains.length} domain{aiDomains.length !== 1 ? "s" : ""}
                </div>
              </FormField>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button variant="ghost" onClick={handleCloseAIGenerate}>Cancel</Button>
              <Button icon={Zap} onClick={handleAIGenerate}
                style={{ background: aiFrameworks.length > 0 && aiDomains.length > 0 ? COLORS.accent : COLORS.border, cursor: aiFrameworks.length > 0 && aiDomains.length > 0 ? "pointer" : "not-allowed" }}>
                Generate Controls
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Generating (loading) */}
        {aiStep === 2 && (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.primaryLight})`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Zap size={28} color={COLORS.accent} style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.92); } }`}</style>
            <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>AI Engine Processing...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, maxWidth: 400, marginInline: "auto", lineHeight: 1.6 }}>
              Analyzing {aiFrameworks.length} framework{aiFrameworks.length > 1 ? "s" : ""} across {aiDomains.length} domain{aiDomains.length > 1 ? "s" : ""}. Performing semantic analysis, intent matching, coverage determination, and superset control synthesis.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28, maxWidth: 340, marginInline: "auto", textAlign: "left" }}>
              {["Semantic Interpretation", "Intent Alignment", "Coverage Determination", "Superset Control Synthesis"].map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < 2 ? COLORS.successLight : COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i < 2 ? <Check size={12} color={COLORS.success} /> : <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 2 ? COLORS.primary : COLORS.border }} />}
                  </div>
                  <span style={{ fontSize: 12, color: i < 2 ? COLORS.success : i === 2 ? COLORS.text : COLORS.textMuted, fontWeight: i === 2 ? 600 : 400 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review generated controls */}
        {aiStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>AI Generated {aiGenerated.length} Controls</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>Review, select, and import the controls you want to add</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button variant="ghost" size="sm" onClick={() => setAiSelectedControls(new Set(aiGenerated.map(g => g.id)))}>Select All</Button>
                <Button variant="ghost" size="sm" onClick={() => setAiSelectedControls(new Set())}>Deselect All</Button>
              </div>
            </div>

            <div style={{ maxHeight: 420, overflow: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {aiGenerated.map(g => {
                const selected = aiSelectedControls.has(g.id);
                return (
                  <div key={g.id} onClick={() => {
                    const next = new Set(aiSelectedControls);
                    selected ? next.delete(g.id) : next.add(g.id);
                    setAiSelectedControls(next);
                  }}
                    style={{
                      background: selected ? COLORS.primaryLight + "80" : COLORS.surface,
                      border: `1px solid ${selected ? COLORS.primary : COLORS.borderLight}`,
                      borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.12s",
                    }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? COLORS.primary : COLORS.border}`,
                        background: selected ? COLORS.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: 1, flexShrink: 0, transition: "all 0.12s",
                      }}>
                        {selected && <Check size={13} color="#fff" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{g.id}</span>
                          <Badge variant={g.rigor === "Critical" ? "danger" : "warning"}>{g.rigor}</Badge>
                          <Badge>{g.domain}</Badge>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{g.title}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 8 }}>{g.description}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 8, borderLeft: `2px solid ${COLORS.success}`, paddingLeft: 10 }}>
                          <strong style={{ color: COLORS.text }}>Objective:</strong> {g.objective}
                        </div>

                        {/* AI Traceability */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: COLORS.accentLight, color: COLORS.accent }}>Semantic: {g.semanticScore}%</span>
                          <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: g.coverage === "Full" ? COLORS.successLight : COLORS.warningLight, color: g.coverage === "Full" ? COLORS.success : COLORS.warning }}>Coverage: {g.coverage}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: COLORS.surfaceAlt, color: COLORS.textSecondary }}>{g.reasonCode}</span>
                        </div>

                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {g.frameworks.map(f => <Badge key={f} variant="primary" size="xs">{f}</Badge>)}
                          <span style={{ fontSize: 10, color: COLORS.textMuted, padding: "2px 6px" }}>· {g.clauses}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <Button variant="secondary" icon={ChevronLeft} onClick={() => { setAiStep(1); setAiGenerated([]); }}>Back to Config</Button>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>{aiSelectedControls.size} of {aiGenerated.length} selected</span>
                <Button icon={Check} onClick={handleAIImport}
                  style={{ background: aiSelectedControls.size > 0 ? COLORS.success : COLORS.border, cursor: aiSelectedControls.size > 0 ? "pointer" : "not-allowed" }}>
                  Import {aiSelectedControls.size} Control{aiSelectedControls.size !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {aiStep === 4 && (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <CheckCircle size={30} color={COLORS.success} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Controls Created Successfully!</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>AI-generated controls have been added to the library as Drafts with full traceability</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Page: Evidence Management ───
const EvidenceManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceList, setEvidenceList] = useState(EVIDENCE_DATA);
  const [showUpload, setShowUpload] = useState(false);
  const [showEditMeta, setShowEditMeta] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({ name: "", type: "", controls: [], scope: "Enterprise", frameworks: [], expiry: "" });
  const [editMetaForm, setEditMetaForm] = useState({});
  const [editMetaChanges, setEditMetaChanges] = useState({});
  const [editMetaReason, setEditMetaReason] = useState("");
  const [evAuditLog, setEvAuditLog] = useState([]);

  // Role-based permissions for evidence actions
  const EV_ROLE_AUTH = {
    "Super Admin":       { upload: true, approve: true, editMeta: true, download: true, delete: true },
    "Compliance Officer": { upload: true, approve: true, editMeta: true, download: true, delete: false },
    "Security Manager":  { upload: true, approve: false, editMeta: true, download: true, delete: false },
    "Internal Auditor":  { upload: true, approve: false, editMeta: false, download: true, delete: false },
    "Executive Viewer":  { upload: false, approve: false, editMeta: false, download: true, delete: false },
  };

  const perms = EV_ROLE_AUTH[CURRENT_USER.role] || {};

  // Approval conditions: evidence must be in Draft or In Review, Qs ≥ 70, and at least 1 control mapped
  const canApprove = (ev) => perms.approve && (ev.status === "Draft" || ev.status === "In Review") && ev.qualityScore >= 70 && ev.controls.length > 0;
  const canEditMeta = (ev) => perms.editMeta && ev.status !== "Approved";
  const canEditMetaOverride = (ev) => (CURRENT_USER.role === "Super Admin" || CURRENT_USER.role === "Compliance Officer") && ev.status === "Approved";
  const canDownload = () => perms.download;

  const EV_TYPES = ["Policy", "Report", "Methodology", "Evidence", "Plan", "Register", "Diagram", "Records", "Certificate", "Assessment", "Configuration"];
  const SCOPE_OPTIONS = ["Enterprise", "BU-Finance", "BU-Technology", "BU-Government", "Project-Specific"];
  const CONTROL_OPTIONS = CONTROLS_DATA.map(c => c.id);

  // Upload handler
  const handleUploadFile = (file) => {
    if (!file) return;
    setUploadFile(file);
    setUploadForm(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, "") }));
    setUploadStep(2);
  };

  const handleUploadConfirm = () => {
    if (!uploadForm.name || !uploadForm.type) return;
    setUploadStep(3);
    setTimeout(() => {
      const newId = `EV-${String(evidenceList.length + 1).padStart(3, "0")}`;
      const newEv = {
        id: newId, name: uploadForm.name, type: uploadForm.type, controls: uploadForm.controls,
        status: "Draft", qualityScore: Math.floor(Math.random() * 15 + 65),
        uploadDate: new Date().toISOString().slice(0, 10),
        expiry: uploadForm.expiry || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
        owner: CURRENT_USER.name.split(" ").pop(), scope: uploadForm.scope,
        frameworks: uploadForm.frameworks.length > 0 ? uploadForm.frameworks : ["ISO 27001"],
        uploadedBy: CURRENT_USER.name, uploadedByRole: CURRENT_USER.role,
      };
      setEvidenceList(prev => [newEv, ...prev]);
      setEvAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Uploaded", evidenceId: newId, detail: `Uploaded "${uploadForm.name}" as ${uploadForm.type}` }, ...prev]);
      setUploadStep(4);
    }, 1500);
  };

  const handleCloseUpload = () => { setShowUpload(false); setUploadStep(1); setUploadFile(null); setUploadForm({ name: "", type: "", controls: [], scope: "Enterprise", frameworks: [], expiry: "" }); };

  // Approve handler
  const handleApprove = (ev) => {
    const updated = evidenceList.map(e => e.id === ev.id ? { ...e, status: "Approved" } : e);
    setEvidenceList(updated);
    setSelectedEvidence({ ...ev, status: "Approved" });
    setEvAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Approved", evidenceId: ev.id, detail: `Approved evidence "${ev.name}" (Qs: ${ev.qualityScore})` }, ...prev]);
  };

  // Edit Metadata
  const openEditMeta = (ev) => {
    setEditMetaForm({ name: ev.name, type: ev.type, controls: [...ev.controls], scope: ev.scope, frameworks: [...ev.frameworks], expiry: ev.expiry, owner: ev.owner });
    setEditMetaChanges({});
    setEditMetaReason("");
    setShowEditMeta(true);
  };

  const setMetaField = (field, value) => {
    setEditMetaForm(prev => ({ ...prev, [field]: value }));
    const orig = field === "controls" || field === "frameworks" ? selectedEvidence[field].join(",") : selectedEvidence[field];
    const newV = field === "controls" || field === "frameworks" ? value.join(",") : value;
    if (orig !== newV) setEditMetaChanges(prev => ({ ...prev, [field]: { from: selectedEvidence[field], to: value } }));
    else setEditMetaChanges(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSaveMeta = () => {
    const changeCount = Object.keys(editMetaChanges).length;
    if (changeCount === 0 || !editMetaReason.trim()) return;
    const updatedEv = { ...selectedEvidence };
    Object.entries(editMetaChanges).forEach(([field, { to }]) => { updatedEv[field] = to; });
    const updated = evidenceList.map(e => e.id === selectedEvidence.id ? updatedEv : e);
    setEvidenceList(updated);
    setSelectedEvidence(updatedEv);
    setEvAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Edited Metadata", evidenceId: selectedEvidence.id, detail: `Modified ${Object.keys(editMetaChanges).join(", ")} — ${editMetaReason}` }, ...prev]);
    setShowEditMeta(false);
  };

  // Download state
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = (ev, format) => {
    setShowDownloadMenu(false);
    setDownloading(true);
    setDownloadComplete(false);

    // Log the download
    setEvAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Downloaded", evidenceId: ev.id, detail: `Downloaded "${ev.name}" as ${format.toUpperCase()}` }, ...prev]);

    // Generate the file content based on format
    setTimeout(() => {
      const qsDims = ["Metadata Completeness", "Content Depth", "Clause Coverage", "Recency", "Structural Clarity"];
      const qsScores = qsDims.map((dim, i) => ({ dim, score: Math.max(50, Math.min(100, ev.qualityScore + (i * 3 - 6))) }));

      if (format === "pdf-meta") {
        // Generate a metadata report as HTML→download
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ev.name} — Evidence Report</title>
<style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:40px auto;color:#1A1D23;line-height:1.6}
h1{font-size:22px;border-bottom:3px solid #3B6FED;padding-bottom:8px;margin-bottom:4px}
.subtitle{color:#8B93A7;font-size:13px;margin-bottom:24px}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px}
.field-label{font-size:11px;color:#8B93A7;text-transform:uppercase;letter-spacing:0.5px;font-weight:600}
.field-value{font-size:14px;font-weight:500;margin-top:2px}
.section{margin-bottom:24px}.section-title{font-size:13px;font-weight:700;color:#3B6FED;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;border-left:3px solid #3B6FED;padding-left:10px}
.qs-box{background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px}
.qs-score{font-size:36px;font-weight:700;color:${ev.qualityScore >= 70 ? "#16A34A" : "#E53E3E"}}
.qs-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px}
.qs-bar{height:8px;border-radius:4px;background:#E2E5EB;flex:1;margin:0 12px}
.qs-fill{height:100%;border-radius:4px;background:#16A34A}
.badge{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-right:6px}
.badge-blue{background:#EBF0FF;color:#3B6FED}.badge-green{background:#E8F9EE;color:#16A34A}
table{width:100%;border-collapse:collapse;margin-top:8px}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #E2E5EB;font-size:12px}th{background:#F7F8FA;font-weight:600;color:#5A6175;text-transform:uppercase;font-size:10px;letter-spacing:0.3px}
.footer{margin-top:40px;padding-top:16px;border-top:2px solid #E2E5EB;font-size:11px;color:#8B93A7;text-align:center}
.watermark{position:fixed;bottom:20px;right:20px;font-size:10px;color:#E2E5EB}</style></head>
<body>
<h1>${ev.name}</h1>
<div class="subtitle">Evidence Report — Generated ${new Date().toISOString().slice(0, 10)} by ${CURRENT_USER.name} (${CURRENT_USER.role})</div>
<div class="grid">
<div><div class="field-label">Evidence ID</div><div class="field-value">${ev.id}</div></div>
<div><div class="field-label">Type</div><div class="field-value">${ev.type}</div></div>
<div><div class="field-label">Status</div><div class="field-value"><span class="badge badge-green">${ev.status}</span></div></div>
<div><div class="field-label">Owner</div><div class="field-value">${ev.owner}</div></div>
<div><div class="field-label">Scope</div><div class="field-value">${ev.scope}</div></div>
<div><div class="field-label">Upload Date</div><div class="field-value">${ev.uploadDate}</div></div>
<div><div class="field-label">Uploaded By</div><div class="field-value">${ev.uploadedBy || "—"}${ev.uploadedByRole ? " (" + ev.uploadedByRole + ")" : ""}</div></div>
<div><div class="field-label">Expiry Date</div><div class="field-value">${ev.expiry}</div></div>
<div><div class="field-label">Frameworks</div><div class="field-value">${ev.frameworks.map(f => '<span class="badge badge-blue">' + f + '</span>').join("")}</div></div>
<div><div class="field-label">Mapped Controls</div><div class="field-value">${ev.controls.map(c => '<span class="badge badge-blue">' + c + '</span>').join("")}</div></div>
</div>
<div class="section"><div class="section-title">AI Quality Gate Assessment</div>
<div class="qs-box"><div class="qs-score">${ev.qualityScore}% — ${ev.qualityScore >= 70 ? "PASSED" : "BELOW THRESHOLD"}</div>
<div style="margin-top:16px">${qsScores.map(q => '<div class="qs-row"><span>' + q.dim + '</span><span style="font-weight:600">' + q.score + '%</span></div>').join("")}</div>
</div></div>
<div class="section"><div class="section-title">Control Mapping Details</div>
<table><thead><tr><th>Control ID</th><th>Control Title</th><th>Domain</th><th>Status</th></tr></thead>
<tbody>${ev.controls.map(cid => { const ctrl = CONTROLS_DATA.find(c => c.id === cid); return ctrl ? '<tr><td>' + ctrl.id + '</td><td>' + ctrl.title + '</td><td>' + ctrl.domain + '</td><td>' + ctrl.status + '</td></tr>' : ''; }).join("")}</tbody></table></div>
<div class="section"><div class="section-title">Audit Trail</div>
<p style="font-size:12px;color:#5A6175">Downloaded by ${CURRENT_USER.name} (${CURRENT_USER.role}) on ${new Date().toISOString().slice(0, 19).replace("T", " ")}.</p>
<p style="font-size:12px;color:#5A6175">This document is auto-generated from the ICF platform. Retention: 7 years per DORA Art. 10.</p></div>
<div class="footer">ICF — Integrated Control Framework · Generated ${new Date().toISOString().slice(0, 10)} · Confidential</div>
<div class="watermark">ICF Platform Export</div>
</body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${ev.id}_${ev.name.replace(/[^a-zA-Z0-9]/g, "_")}_Report.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === "json") {
        const data = { ...ev, qualityDimensions: qsScores.reduce((acc, q) => ({ ...acc, [q.dim]: q.score }), {}), exportedBy: CURRENT_USER.name, exportedAt: new Date().toISOString(), platform: "ICF" };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${ev.id}_${ev.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === "csv") {
        const rows = [["Field", "Value"], ["ID", ev.id], ["Name", ev.name], ["Type", ev.type], ["Status", ev.status], ["Owner", ev.owner], ["Uploaded By", ev.uploadedBy || "—"], ["Uploader Role", ev.uploadedByRole || "—"], ["Scope", ev.scope], ["Upload Date", ev.uploadDate], ["Expiry", ev.expiry], ["Quality Score", ev.qualityScore], ...qsScores.map(q => [q.dim, q.score]), ["Frameworks", ev.frameworks.join("; ")], ["Controls", ev.controls.join("; ")], ["Exported By", CURRENT_USER.name], ["Export Date", new Date().toISOString().slice(0, 10)]];
        const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${ev.id}_${ev.name.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 2500);
    }, 600);
  };

  const filtered = evidenceList.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Evidence & Artifact Management</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Centralized repository with AI quality scoring</p>
        </div>
        {perms.upload ? (
          <Button icon={Upload} onClick={() => setShowUpload(true)}>Upload Evidence</Button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Button icon={Upload} style={{ opacity: 0.4, cursor: "not-allowed" }}>Upload Evidence</Button>
            <span style={{ fontSize: 10, color: COLORS.textMuted }}>No upload permission ({CURRENT_USER.role})</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon={Database} label="TOTAL ARTIFACTS" value={evidenceList.length} color={COLORS.primary} />
        <StatCard icon={CheckCircle} label="AVG QUALITY SCORE" value={`${Math.round(evidenceList.reduce((s, e) => s + e.qualityScore, 0) / evidenceList.length)}%`} color={COLORS.success} />
        <StatCard icon={Layers} label="EVIDENCE REUSE RATIO" value="2.8x" sub="Across frameworks" color={COLORS.info} />
        <StatCard icon={AlertCircle} label="EXPIRING SOON" value={evidenceList.filter(e => new Date(e.expiry) < new Date("2026-05-18")).length} sub="Within 90 days" color={COLORS.warning} />
      </div>

      {/* Role permission banner */}
      <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>Your permissions ({CURRENT_USER.role}):</span>
        {[["Upload", perms.upload], ["Approve", perms.approve], ["Edit Metadata", perms.editMeta], ["Download", perms.download], ["Delete", perms.delete]].map(([label, allowed]) => (
          <span key={label} style={{ fontSize: 11, fontWeight: 500, color: allowed ? COLORS.success : COLORS.textMuted }}>
            {allowed ? "✓" : "✗"} {label}
          </span>
        ))}
      </div>

      <SearchBar placeholder="Search evidence..." value={search} onChange={setSearch} style={{ maxWidth: 400 }} />

      <Card>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Artifact Name</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Quality (Qs)</TableHeader>
                <TableHeader>Mapped Controls</TableHeader>
                <TableHeader>Frameworks</TableHeader>
                <TableHeader>Scope</TableHeader>
                <TableHeader>Expiry</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ cursor: "pointer" }}
                  onClick={() => setSelectedEvidence(e)}
                  onMouseEnter={ev => ev.currentTarget.style.background = COLORS.surfaceAlt}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <TableCell><span style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.primary, fontWeight: 600 }}>{e.id}</span></TableCell>
                  <TableCell><span style={{ fontWeight: 500 }}>{e.name}</span></TableCell>
                  <TableCell><Badge>{e.type}</Badge></TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell><QualityScore score={e.qualityScore} /></TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {e.controls.map(c => <Badge key={c} variant="primary" size="xs">{c}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {e.frameworks.slice(0, 2).map(f => <Badge key={f} size="xs">{f}</Badge>)}
                      {e.frameworks.length > 2 && <Badge size="xs">+{e.frameworks.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{e.scope}</span></TableCell>
                  <TableCell>
                    <span style={{ fontSize: 12, color: new Date(e.expiry) < new Date("2026-05-18") ? COLORS.danger : COLORS.textSecondary }}>{e.expiry}</span>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ══════ Evidence Detail Modal ══════ */}
      <Modal open={!!selectedEvidence && !showEditMeta} onClose={() => setSelectedEvidence(null)} title={selectedEvidence?.name} width={640}>
        {selectedEvidence && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {[["ID", selectedEvidence.id], ["Type", <Badge>{selectedEvidence.type}</Badge>], ["Status", <StatusBadge status={selectedEvidence.status} />],
                ["Owner", selectedEvidence.owner], ["Scope", selectedEvidence.scope], ["Upload Date", selectedEvidence.uploadDate],
                ["Uploaded By", <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontWeight: 500 }}>{selectedEvidence.uploadedBy || "—"}</span>{selectedEvidence.uploadedByRole && <Badge size="xs">{selectedEvidence.uploadedByRole}</Badge>}</span>],
                ["Expiry", <span style={{ color: new Date(selectedEvidence.expiry) < new Date("2026-05-18") ? COLORS.danger : COLORS.text }}>{selectedEvidence.expiry}</span>],
                ["Frameworks", <span style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{selectedEvidence.frameworks.map(f => <Badge key={f} variant="primary" size="xs">{f}</Badge>)}</span>],
              ].map(([l, v], i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>{l}</div>
                  <div style={{ fontSize: 13, color: COLORS.text }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>AI Quality Gate (Qs ≥ 70)</div>
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <QualityScore score={selectedEvidence.qualityScore} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: selectedEvidence.qualityScore >= 70 ? COLORS.success : COLORS.danger }}>
                    {selectedEvidence.qualityScore >= 70 ? "PASSED" : "BELOW THRESHOLD"}
                  </span>
                </div>
                {["Metadata Completeness", "Content Depth", "Clause Coverage", "Recency", "Structural Clarity"].map((dim, i) => {
                  const v = Math.max(50, Math.min(100, selectedEvidence.qualityScore + (i * 3 - 6)));
                  return (
                    <div key={dim} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: COLORS.textSecondary, minWidth: 130 }}>{dim}</span>
                      <ProgressBar value={v} color={v >= 80 ? COLORS.success : v >= 60 ? COLORS.warning : COLORS.danger} height={5} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, minWidth: 30 }}>{v}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>Mapped Controls</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedEvidence.controls.map(c => <Badge key={c} variant="primary">{c}</Badge>)}
              </div>
            </div>

            {/* Approval conditions info */}
            {(selectedEvidence.status === "Draft" || selectedEvidence.status === "In Review") && (
              <div style={{ background: selectedEvidence.qualityScore >= 70 && selectedEvidence.controls.length > 0 ? COLORS.successLight : COLORS.warningLight, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Approval Preconditions</div>
                {[
                  { label: "Quality Score ≥ 70", met: selectedEvidence.qualityScore >= 70, detail: `Current: ${selectedEvidence.qualityScore}%` },
                  { label: "At least 1 control mapped", met: selectedEvidence.controls.length > 0, detail: `${selectedEvidence.controls.length} control(s) linked` },
                  { label: "Status is Draft or In Review", met: true, detail: `Currently: ${selectedEvidence.status}` },
                  { label: "Authorized role", met: perms.approve, detail: `${CURRENT_USER.role}: ${perms.approve ? "Authorized" : "Not authorized"}` },
                ].map((cond, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {cond.met ? <CheckCircle size={13} color={COLORS.success} /> : <XCircle size={13} color={COLORS.danger} />}
                    <span style={{ fontSize: 12, color: cond.met ? COLORS.success : COLORS.danger, fontWeight: 500 }}>{cond.label}</span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>— {cond.detail}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Audit trail for this evidence */}
            {evAuditLog.filter(a => a.evidenceId === selectedEvidence.id).length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>Activity Log</div>
                <div style={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: 8, overflow: "hidden" }}>
                  {evAuditLog.filter(a => a.evidenceId === selectedEvidence.id).map((a, i) => (
                    <div key={i} style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <Clock size={12} color={COLORS.textMuted} style={{ marginTop: 2 }} />
                      <div>
                        <span style={{ color: COLORS.textMuted }}>{a.time}</span>{" "}
                        <span style={{ fontWeight: 600, color: COLORS.text }}>{a.user}</span>{" "}
                        <Badge size="xs">{a.action}</Badge>
                        <div style={{ color: COLORS.textSecondary, marginTop: 2 }}>{a.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons with role-based visibility */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap", alignItems: "center" }}>
              {/* Download button with format dropdown */}
              {canDownload() ? (
                <div style={{ position: "relative" }}>
                  {downloadComplete && (
                    <div style={{ position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)", background: COLORS.success, color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6, whiteSpace: "nowrap" }}>✓ Downloaded</div>
                  )}
                  {downloading ? (
                    <Button variant="secondary" icon={RefreshCw} style={{ opacity: 0.7 }}>Downloading...</Button>
                  ) : (
                    <Button variant="secondary" icon={Download} onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
                      Download ▾
                    </Button>
                  )}
                  {showDownloadMenu && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", left: 0, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                      borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", padding: 6, minWidth: 280, zIndex: 9999,
                    }}>
                      <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, padding: "6px 10px" }}>Download Format</div>
                      {[
                        { id: "pdf-meta", icon: FileText, label: "Evidence Report (HTML)", desc: "Full metadata, quality scores, control mappings, and audit trail as a printable report" },
                        { id: "json", icon: Database, label: "Structured Data (JSON)", desc: "Machine-readable export with all fields and quality dimensions for API integration" },
                        { id: "csv", icon: FileCheck, label: "Spreadsheet (CSV)", desc: "Flat file with all metadata fields for Excel or GRC platform import" },
                      ].map(fmt => (
                        <button key={fmt.id} onClick={() => handleDownload(selectedEvidence, fmt.id)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 8,
                            border: "none", background: "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <fmt.icon size={16} color={COLORS.primary} style={{ marginTop: 1, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{fmt.label}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4, marginTop: 2 }}>{fmt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Button variant="secondary" icon={Download} style={{ opacity: 0.35, cursor: "not-allowed" }}>Download</Button>
                  <span style={{ fontSize: 9, color: COLORS.textMuted }}>No permission</span>
                </div>
              )}
              {(canEditMeta(selectedEvidence) || canEditMetaOverride(selectedEvidence)) ? (
                <Button variant="secondary" icon={Edit} onClick={() => openEditMeta(selectedEvidence)}>
                  Edit Metadata {canEditMetaOverride(selectedEvidence) && !canEditMeta(selectedEvidence) ? "(Override)" : ""}
                </Button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Button variant="secondary" icon={Edit} style={{ opacity: 0.35, cursor: "not-allowed" }}>Edit Metadata</Button>
                  <span style={{ fontSize: 9, color: COLORS.textMuted }}>{selectedEvidence.status === "Approved" ? "Locked" : "No perm"}</span>
                </div>
              )}
              {canApprove(selectedEvidence) ? (
                <Button icon={Check} onClick={() => handleApprove(selectedEvidence)}>Approve</Button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Button icon={Check} style={{ opacity: 0.35, cursor: "not-allowed" }}>Approve</Button>
                  <span style={{ fontSize: 9, color: COLORS.textMuted }}>
                    {selectedEvidence.status === "Approved" ? "Already approved" : selectedEvidence.qualityScore < 70 ? "Qs < 70" : !perms.approve ? "No perm" : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ══════ Upload Evidence Modal ══════ */}
      <Modal open={showUpload} onClose={handleCloseUpload} title="Upload Evidence" width={640}>
        {uploadStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>Upload a document, report, screenshot, or other evidence artifact. The AI Quality Gate will automatically score it upon upload.</div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: COLORS.textSecondary }}>
              <strong>Who can upload:</strong> Super Admin, Compliance Officer, Security Manager, Internal Auditor.
              <strong style={{ marginLeft: 8 }}>Executive Viewers</strong> do not have upload permissions.
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setUploadDragOver(true); }}
              onDragLeave={() => setUploadDragOver(false)}
              onDrop={e => { e.preventDefault(); setUploadDragOver(false); handleUploadFile(e.dataTransfer.files[0]); }}
              onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".pdf,.docx,.xlsx,.png,.jpg,.zip"; inp.onchange = e => handleUploadFile(e.target.files[0]); inp.click(); }}
              style={{
                border: `2px dashed ${uploadDragOver ? COLORS.primary : COLORS.border}`, borderRadius: 12, padding: "40px 20px",
                textAlign: "center", cursor: "pointer", background: uploadDragOver ? COLORS.primaryLight : COLORS.surfaceAlt, transition: "all 0.15s",
              }}>
              <Upload size={28} color={uploadDragOver ? COLORS.primary : COLORS.textMuted} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>Drop file here or click to browse</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>PDF, DOCX, XLSX, PNG, JPG, ZIP (max 50MB)</div>
            </div>
          </div>
        )}

        {uploadStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 14px" }}>
              <FileCheck size={18} color={COLORS.success} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{uploadFile?.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{uploadFile ? (uploadFile.size / 1024).toFixed(1) + " KB" : ""}</div>
              </div>
              <button onClick={() => { setUploadStep(1); setUploadFile(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={COLORS.textMuted} /></button>
            </div>
            <FormField label="Artifact Name" required>
              <FormInput value={uploadForm.name} onChange={v => setUploadForm(p => ({ ...p, name: v }))} placeholder="e.g., Q1 2026 Penetration Test Report" />
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Evidence Type" required>
                <FormSelect value={uploadForm.type} onChange={v => setUploadForm(p => ({ ...p, type: v }))} options={EV_TYPES} placeholder="Select type..." />
              </FormField>
              <FormField label="Scope">
                <FormSelect value={uploadForm.scope} onChange={v => setUploadForm(p => ({ ...p, scope: v }))} options={SCOPE_OPTIONS} placeholder="Select scope..." />
              </FormField>
            </div>
            <FormField label="Link to Controls" hint="Select controls this evidence supports">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 80, overflow: "auto" }}>
                {CONTROL_OPTIONS.slice(0, 16).map(c => {
                  const active = uploadForm.controls.includes(c);
                  return <button key={c} onClick={() => setUploadForm(p => ({ ...p, controls: active ? p.controls.filter(x => x !== c) : [...p.controls, c] }))}
                    style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontFamily: "monospace", border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primaryLight : COLORS.surface, color: active ? COLORS.primary : COLORS.textMuted, cursor: "pointer", fontWeight: active ? 600 : 400 }}>
                    {active ? "✓ " : ""}{c}
                  </button>;
                })}
              </div>
            </FormField>
            <FormField label="Applicable Frameworks">
              <FrameworkCheckboxes selected={uploadForm.frameworks} onChange={v => setUploadForm(p => ({ ...p, frameworks: v }))} />
            </FormField>
            <FormField label="Expiry Date" hint="When this evidence expires and requires renewal">
              <FormInput type="date" value={uploadForm.expiry} onChange={v => setUploadForm(p => ({ ...p, expiry: v }))} />
            </FormField>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button variant="secondary" icon={ChevronLeft} onClick={() => { setUploadStep(1); setUploadFile(null); }}>Back</Button>
              <Button icon={Upload} onClick={handleUploadConfirm} style={{ background: uploadForm.name && uploadForm.type ? COLORS.primary : COLORS.border, cursor: uploadForm.name && uploadForm.type ? "pointer" : "not-allowed" }}>Upload & Score</Button>
            </div>
          </div>
        )}

        {uploadStep === 3 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.primaryLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={24} color={COLORS.primary} style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Uploading & Scoring...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Running AI Quality Gate analysis across 5 dimensions</div>
          </div>
        )}

        {uploadStep === 4 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <CheckCircle size={28} color={COLORS.success} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Upload Complete!</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>Evidence uploaded as Draft. Awaiting Compliance Officer or Super Admin approval.</div>
            <Button onClick={handleCloseUpload}>View Evidence</Button>
          </div>
        )}
      </Modal>

      {/* ══════ Edit Metadata Modal ══════ */}
      <Modal open={showEditMeta && !!selectedEvidence} onClose={() => setShowEditMeta(false)} title={`Edit Metadata — ${selectedEvidence?.id || ""}`} width={660}>
        {selectedEvidence && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selectedEvidence.status === "Approved" && (
              <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <AlertCircle size={15} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                  This evidence is <strong>Approved</strong>. Editing metadata with override authority ({CURRENT_USER.role}). Changes will be flagged in the audit trail and may trigger a re-review.
                </div>
              </div>
            )}

            {/* Editable fields */}
            <FormField label="Artifact Name">
              <FormInput value={editMetaForm.name || ""} onChange={v => setMetaField("name", v)} />
              {editMetaChanges.name && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <FormField label="Type">
                <FormSelect value={editMetaForm.type || ""} onChange={v => setMetaField("type", v)} options={EV_TYPES} />
                {editMetaChanges.type && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
              </FormField>
              <FormField label="Scope">
                <FormSelect value={editMetaForm.scope || ""} onChange={v => setMetaField("scope", v)} options={SCOPE_OPTIONS} />
                {editMetaChanges.scope && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
              </FormField>
              <FormField label="Expiry Date">
                <FormInput type="date" value={editMetaForm.expiry || ""} onChange={v => setMetaField("expiry", v)} />
                {editMetaChanges.expiry && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
              </FormField>
            </div>
            <FormField label="Owner">
              <FormInput value={editMetaForm.owner || ""} onChange={v => setMetaField("owner", v)} />
              {editMetaChanges.owner && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
            </FormField>
            <FormField label="Linked Controls">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 80, overflow: "auto" }}>
                {CONTROL_OPTIONS.slice(0, 16).map(c => {
                  const active = (editMetaForm.controls || []).includes(c);
                  return <button key={c} onClick={() => setMetaField("controls", active ? editMetaForm.controls.filter(x => x !== c) : [...editMetaForm.controls, c])}
                    style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontFamily: "monospace", border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primaryLight : COLORS.surface, color: active ? COLORS.primary : COLORS.textMuted, cursor: "pointer", fontWeight: active ? 600 : 400 }}>
                    {active ? "✓ " : ""}{c}
                  </button>;
                })}
              </div>
              {editMetaChanges.controls && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
            </FormField>
            <FormField label="Applicable Frameworks">
              <FrameworkCheckboxes selected={editMetaForm.frameworks || []} onChange={v => setMetaField("frameworks", v)} />
              {editMetaChanges.frameworks && <span style={{ fontSize: 10, color: COLORS.primary }}>✎ Modified</span>}
            </FormField>

            {/* Change summary */}
            {Object.keys(editMetaChanges).length > 0 && (
              <>
                <div style={{ border: `1px solid ${COLORS.primary}30`, borderRadius: 10, padding: "12px 14px", background: `${COLORS.primaryLight}60` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", marginBottom: 6 }}>
                    {Object.keys(editMetaChanges).length} field(s) modified
                  </div>
                  {Object.entries(editMetaChanges).map(([field, { from, to }]) => (
                    <div key={field} style={{ fontSize: 11, marginBottom: 3, display: "flex", gap: 6 }}>
                      <span style={{ fontWeight: 600, minWidth: 80, color: COLORS.text }}>{field}:</span>
                      <span style={{ color: COLORS.danger, textDecoration: "line-through" }}>{Array.isArray(from) ? from.join(", ") : String(from).slice(0, 60)}</span>
                      <span style={{ color: COLORS.textMuted }}>→</span>
                      <span style={{ color: COLORS.success }}>{Array.isArray(to) ? to.join(", ") : String(to).slice(0, 60)}</span>
                    </div>
                  ))}
                </div>
                <FormField label="Change Reason" required hint="Recorded in the immutable audit trail (7-year retention)">
                  <FormTextarea value={editMetaReason} onChange={setEditMetaReason} rows={2} placeholder="Explain why metadata is being modified..." />
                </FormField>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <Button variant="ghost" onClick={() => setShowEditMeta(false)}>Cancel</Button>
              <Button icon={Check} onClick={handleSaveMeta}
                style={{ background: Object.keys(editMetaChanges).length > 0 && editMetaReason.trim() ? COLORS.success : COLORS.border, cursor: Object.keys(editMetaChanges).length > 0 && editMetaReason.trim() ? "pointer" : "not-allowed" }}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Page: Policy Management ───
const PolicyManagement = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [domainFilter, setDomainFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [showChangeReq, setShowChangeReq] = useState(false);
  const [showException, setShowException] = useState(false);
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showPortalSettings, setShowPortalSettings] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // cards | table
  const [crForm, setCrForm] = useState({ title: "", description: "", justification: "" });
  const [exForm, setExForm] = useState({ policyId: "", justification: "", duration: "90 days", compensating: "" });
  const [exSubmitStep, setExSubmitStep] = useState(null); // null | "submitting" | "submitted"
  const [showExDetail, setShowExDetail] = useState(null); // exception object for detail/action
  const [exActionType, setExActionType] = useState(null); // "approve" | "deny"
  const [exActionComments, setExActionComments] = useState("");
  const [showAllExceptions, setShowAllExceptions] = useState(false); // centralized view
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportDone, setExportDone] = useState(null);
  const [showExportPreview, setShowExportPreview] = useState(null); // null | "csv" | "pdf"
  const [exportCopied, setExportCopied] = useState(false);
  const [editPolForm, setEditPolForm] = useState({});
  const [editPolChanges, setEditPolChanges] = useState({});
  const [editPolReason, setEditPolReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [policyAuditLog, setPolicyAuditLog] = useState([
    { time: "2026-01-10 14:30", user: "Niteen Kumar", role: "Super Admin", action: "Approved", policyId: "POL-008", detail: "Approved v3.1 of Access Control Policy" },
    { time: "2025-12-15 10:15", user: "Pieter de Groot", role: "Compliance Officer", action: "Published", policyId: "POL-001", detail: "Published Information Security Policy v3.2 after final review" },
    { time: "2025-12-05 09:00", user: "Anna Müller", role: "Policy Owner", action: "Submitted for Review", policyId: "POL-003", detail: "Data Protection & Privacy Policy v4.0 submitted for review" },
    { time: "2025-11-20 16:45", user: "CISO", role: "Approver", action: "Approved Exception", policyId: "POL-001", detail: "Approved EXC-001: Legacy system password rotation exemption for Thomas Schmidt" },
    { time: "2025-10-01 11:20", user: "Pieter de Groot", role: "Compliance Officer", action: "Created Draft", policyId: "POL-004", detail: "Created draft v3.8 of Incident Response Policy" },
  ]);

  // New Policy wizard state
  const [npStep, setNpStep] = useState(1);
  const [npForm, setNpForm] = useState({ title: "", domain: "", category: "", owner: "", author: "", approver: "", reviewCycle: "Annual", purpose: "", scope: "", statement: "", frameworks: [], controls: [] });
  const [aiDrafting, setAiDrafting] = useState(false);
  const [aiDraftField, setAiDraftField] = useState(null); // "purpose" | "scope" | "statement" | "all"
  const [aiDraftGenerated, setAiDraftGenerated] = useState({});

  // RBAC for policies
  const POL_ROLE_AUTH = {
    "Super Admin": { create: true, edit: true, approve: true, publish: true, archive: true, manageExceptions: true, viewAudit: true, managePortal: true },
    "Compliance Officer": { create: true, edit: true, approve: true, publish: true, archive: false, manageExceptions: true, viewAudit: true, managePortal: true },
    "Security Manager": { create: true, edit: true, approve: false, publish: false, archive: false, manageExceptions: false, viewAudit: true, managePortal: false },
    "Internal Auditor": { create: false, edit: false, approve: false, publish: false, archive: false, manageExceptions: false, viewAudit: true, managePortal: false },
    "Executive Viewer": { create: false, edit: false, approve: false, publish: false, archive: false, manageExceptions: false, viewAudit: false, managePortal: false },
  };
  const polPerms = POL_ROLE_AUTH[CURRENT_USER.role] || {};

  // Portal settings state
  const [portalSettings, setPortalSettings] = useState({ publicSharing: false, passcodeEnabled: true, passcode: "POL-2026-SEC", embedEnabled: false });

  // Exception data
  const [exceptions, setExceptions] = useState([
    { id: "EXC-001", policy: "POL-001", policyTitle: "Information Security Policy", user: "Thomas Schmidt", justification: "Legacy system cannot comply with password rotation requirement until migration completes in Q2 2026", compensating: "IP restriction and enhanced monitoring applied to legacy systems", duration: "180 days", status: "Approved", submitted: "2025-11-20", expiry: "2026-05-20", approver: "CISO", version: "3.2" },
    { id: "EXC-002", policy: "POL-002", policyTitle: "Acceptable Use Policy", user: "Marie Dupont", justification: "Executive device requires personal software for board communications", compensating: "Device enrolled in MDM with additional DLP controls", duration: "365 days", status: "Approved", submitted: "2025-10-01", expiry: "2026-10-01", approver: "CISO", version: "2.5" },
    { id: "EXC-003", policy: "POL-002", policyTitle: "Acceptable Use Policy", user: "Jan Kowalski", justification: "Development team needs admin access for container testing environment", compensating: "Network-segregated lab environment with no production data access", duration: "90 days", status: "Pending", submitted: "2026-02-10", expiry: null, approver: null, version: "2.5" },
    { id: "EXC-004", policy: "POL-008", policyTitle: "Access Control Policy", user: "Anna Müller", justification: "Shared service account required for automated compliance scanning tool", compensating: "Account monitored via PAM, credentials rotated weekly, no interactive login", duration: "365 days", status: "Approved", submitted: "2025-12-01", expiry: "2026-12-01", approver: "IAM Lead", version: "3.1" },
    { id: "EXC-005", policy: "POL-008", policyTitle: "Access Control Policy", user: "Pieter de Groot", justification: "Cross-BU access needed for quarterly audit review process", compensating: "Access limited to read-only, auto-revoked after 72 hours of inactivity", duration: "90 days", status: "Approved", submitted: "2026-01-15", expiry: "2026-04-15", approver: "IAM Lead", version: "3.1" },
    { id: "EXC-006", policy: "POL-008", policyTitle: "Access Control Policy", user: "Thomas Schmidt", justification: "Temporary elevated access for data migration project", compensating: "None proposed", duration: "60 days", status: "Denied", submitted: "2026-01-20", expiry: null, approver: "CISO", version: "3.0" },
  ]);

  const [changeRequests, setChangeRequests] = useState([
    { id: "CR-001", policy: "POL-003", title: "Add cross-border data transfer clause for Schrems II", submittedBy: "Anna Müller", date: "2026-01-05", status: "Approved", description: "Add explicit clause addressing EU-US data transfers following adequacy framework updates", approver: "DPO", impact: "Medium" },
    { id: "CR-002", policy: "POL-004", title: "Update NIS2 notification timelines", submittedBy: "Pieter de Groot", date: "2026-01-20", status: "Pending", description: "Revise incident notification windows to align with NIS2 24h early warning and 72h full report requirements", approver: null, impact: "High" },
    { id: "CR-003", policy: "POL-004", title: "Add supply chain incident playbook reference", submittedBy: "Anna Müller", date: "2026-02-01", status: "Pending", description: "Include reference to new supply chain compromise playbook developed by IR team", approver: null, impact: "Low" },
    { id: "CR-004", policy: "POL-006", title: "Include cloud DR failover procedures", submittedBy: "Jan Kowalski", date: "2026-02-10", status: "Pending", description: "Add section on automated cloud region failover per DORA ICT continuity requirements", approver: null, impact: "High" },
  ]);

  // Simulated per-employee attestation records (BRD 3.6)
  const attestationRecords = [
    { employee: "Thomas Schmidt", dept: "IT Operations", attested: true, date: "2026-01-22 09:14", signature: "TS-e-sig-001" },
    { employee: "Marie Dupont", dept: "Finance", attested: true, date: "2026-01-23 14:30", signature: "MD-e-sig-002" },
    { employee: "Jan Kowalski", dept: "Engineering", attested: true, date: "2026-01-25 11:05", signature: "JK-e-sig-003" },
    { employee: "Anna Müller", dept: "Compliance", attested: true, date: "2026-01-20 16:42", signature: "AM-e-sig-004" },
    { employee: "Pieter de Groot", dept: "Governance", attested: true, date: "2026-01-21 08:55", signature: "PG-e-sig-005" },
    { employee: "Elena Rossi", dept: "HR", attested: false, date: null, signature: null },
    { employee: "Carlos Martinez", dept: "Sales", attested: false, date: null, signature: null },
    { employee: "Yuki Tanaka", dept: "Engineering", attested: true, date: "2026-01-28 10:20", signature: "YT-e-sig-006" },
    { employee: "Lisa Johnson", dept: "Marketing", attested: false, date: null, signature: null },
    { employee: "Ahmed Hassan", dept: "Security", attested: true, date: "2026-01-19 13:10", signature: "AH-e-sig-007" },
  ];

  const filtered = POLICIES_DATA.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === "approved" && p.status !== "Approved") return false;
    if (tab === "review" && p.status !== "In Review") return false;
    if (tab === "draft" && p.status !== "Draft") return false;
    if (domainFilter !== "All" && p.domain !== domainFilter) return false;
    if (ownerFilter !== "All" && p.owner !== ownerFilter) return false;
    return true;
  });

  const totalAttest = POLICIES_DATA.reduce((s, p) => s + p.attestationComplete, 0);
  const totalReq = POLICIES_DATA.reduce((s, p) => s + p.attestationRequired, 0);
  const overallAttestRate = totalReq > 0 ? Math.round((totalAttest / totalReq) * 100) : 0;
  const dueForReview = POLICIES_DATA.filter(p => p.nextReview && new Date(p.nextReview) < new Date("2026-06-01")).length;
  const totalActiveExc = exceptions.filter(e => e.status === "Approved" && e.expiry && new Date(e.expiry) > new Date()).length;
  const pendingCRs = changeRequests.filter(cr => cr.status === "Pending").length;
  const domainList = [...new Set(POLICIES_DATA.map(p => p.domain))].sort();
  const ownerList = [...new Set(POLICIES_DATA.map(p => p.owner))].sort();
  const anyFilterActive = domainFilter !== "All" || ownerFilter !== "All" || search;

  // Data for charts (BRD 7.7)
  const domainChartData = domainList.map(d => ({ name: d, short: d.length > 24 ? d.slice(0, 22) + "…" : d, count: POLICIES_DATA.filter(p => p.domain === d).length, approved: POLICIES_DATA.filter(p => p.domain === d && p.status === "Approved").length, review: POLICIES_DATA.filter(p => p.domain === d && p.status === "In Review").length, draft: POLICIES_DATA.filter(p => p.domain === d && p.status === "Draft").length }));
  const statusChartData = [
    { name: "Approved", value: POLICIES_DATA.filter(p => p.status === "Approved").length, fill: COLORS.success },
    { name: "In Review", value: POLICIES_DATA.filter(p => p.status === "In Review").length, fill: COLORS.warning },
    { name: "Draft", value: POLICIES_DATA.filter(p => p.status === "Draft").length, fill: COLORS.textMuted },
  ];

  const handleApprovePublish = () => {
    if (!selectedPolicy || !approvalComments.trim()) return;
    setPolicyAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Approved & Published", policyId: selectedPolicy.id, detail: `Approved by ${CURRENT_USER.name}. Comments: ${approvalComments} — Policy v${selectedPolicy.version} approved and published.` }, ...prev]);
    setApprovalResult("approved");
  };

  const handleRejectPolicy = () => {
    if (!selectedPolicy || !approvalComments.trim()) return;
    setPolicyAuditLog(prev => [{ time: new Date().toISOString().slice(0, 16).replace("T", " "), user: CURRENT_USER.name, role: CURRENT_USER.role, action: "Rejected", policyId: selectedPolicy.id, detail: `Rejected by ${CURRENT_USER.name}. Reason: ${approvalComments}. Policy v${selectedPolicy.version} returned to Draft for revision.` }, ...prev]);
    setApprovalResult("rejected");
  };

  const closeApprovalFlow = () => {
    setShowApproval(false);
    setApprovalComments("");
    setApprovalResult(null);
    setSelectedPolicy(null);
  };

  const [approvalResult, setApprovalResult] = useState(null); // null | "approved" | "rejected"

  // ── Export Handlers (BRD 3.8.2) ──
  const handleExportPolicies = (format) => {
    setShowExportMenu(false);
    setShowExportPreview(format);
    setExportCopied(false);
  };

  const getExportCSV = () => {
    const headers = ["ID","Title","Version","Status","Owner","Author","Approver","Domain","Category","Review Cycle","Effective Date","Next Review","Attestation Rate","Attestation Complete","Attestation Required","Frameworks","Controls","Exceptions","Pending CRs"];
    const rows = filtered.map(p => [
      p.id, p.title, `v${p.version}`, p.status, p.owner, p.author, p.approver, p.domain, p.category, p.reviewCycle,
      p.effectiveDate || "", p.nextReview || "",
      p.status === "Approved" ? `${p.attestationRate}%` : "N/A", p.attestationComplete, p.attestationRequired,
      p.frameworks.join("; "), p.controls.join("; "),
      exceptions.filter(e => e.policy === p.id && e.status === "Approved").length,
      changeRequests.filter(c => c.policy === p.id && c.status !== "Completed" && c.status !== "Rejected").length,
    ]);
    return [headers.join("\t"), ...rows.map(r => r.map(c => String(c).replace(/\t/g, " ")).join("\t"))].join("\n");
  };

  const handleCopyExport = () => {
    const text = getExportCSV();
    navigator.clipboard.writeText(text).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    }).catch(() => {
      // fallback: select text in a textarea
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  };

  const openEditPolicy = () => {
    if (!selectedPolicy) return;
    setEditPolForm({
      title: selectedPolicy.title, domain: selectedPolicy.domain, category: selectedPolicy.category,
      owner: selectedPolicy.owner, author: selectedPolicy.author, approver: selectedPolicy.approver,
      reviewCycle: selectedPolicy.reviewCycle, frameworks: [...selectedPolicy.frameworks], controls: [...selectedPolicy.controls],
    });
    setEditPolChanges({});
    setEditPolReason("");
    setShowEditPolicy(true);
  };

  const trackEditChange = (field, value) => {
    setEditPolForm(p => ({ ...p, [field]: value }));
    const original = selectedPolicy[field];
    const isArr = Array.isArray(original);
    const changed = isArr ? JSON.stringify(value) !== JSON.stringify(original) : value !== original;
    setEditPolChanges(prev => {
      if (changed) return { ...prev, [field]: { from: isArr ? original.join(", ") : original, to: isArr ? value.join(", ") : value } };
      const next = { ...prev }; delete next[field]; return next;
    });
  };

  const handleSaveEditPolicy = () => {
    if (Object.keys(editPolChanges).length === 0 || !editPolReason.trim()) return;
    const changedFields = Object.keys(editPolChanges).join(", ");
    setPolicyAuditLog(prev => [{
      time: new Date().toISOString().slice(0, 16).replace("T", " "),
      user: CURRENT_USER.name, role: CURRENT_USER.role,
      action: "Policy Edited",
      policyId: selectedPolicy.id,
      detail: `Edited ${changedFields} on ${selectedPolicy.id}. Reason: ${editPolReason}`
    }, ...prev]);
    setShowEditPolicy(false);
  };

  // ── Change Request Workflow (BRD 3.4) ──
  // States: Submitted → Under Review → Approved / Rejected → (if Approved) Implementation → Completed
  const [crSubmitStep, setCrSubmitStep] = useState(null); // null | "submitting" | "submitted"
  const [showCRDetail, setShowCRDetail] = useState(null); // CR object for detail/action modal
  const [crActionComments, setCrActionComments] = useState("");
  const [crActionType, setCrActionType] = useState(null); // "approve" | "reject" | "implement"

  const CR_STATUSES = ["Submitted", "Under Review", "Approved", "Rejected", "Implementation", "Completed"];
  const CR_STATUS_COLORS = { Submitted: COLORS.info, "Under Review": COLORS.warning, Approved: COLORS.success, Rejected: COLORS.danger, Implementation: COLORS.accent, Completed: COLORS.success };

  const canManageCR = polPerms.approve; // Super Admin and Compliance Officer can approve/reject CRs

  const handleSubmitCR = () => {
    if (!crForm.title || !crForm.description || !crForm.justification || !selectedPolicy) return;
    setCrSubmitStep("submitting");
    setTimeout(() => {
      const newCR = {
        id: `CR-${String(changeRequests.length + 1).padStart(3, "0")}`,
        policy: selectedPolicy.id,
        title: crForm.title,
        description: crForm.description,
        justification: crForm.justification,
        submittedBy: CURRENT_USER.name,
        date: new Date().toISOString().slice(0, 10),
        status: "Submitted",
        approver: null,
        impact: "Medium",
        reviewComments: null,
        implementedDate: null,
      };
      setChangeRequests(prev => [newCR, ...prev]);
      setPolicyAuditLog(prev => [{
        time: new Date().toISOString().slice(0, 16).replace("T", " "),
        user: CURRENT_USER.name, role: CURRENT_USER.role,
        action: "CR Submitted",
        policyId: selectedPolicy.id,
        detail: `Change Request ${newCR.id}: "${crForm.title}" submitted for ${selectedPolicy.id} — ${crForm.justification}`
      }, ...prev]);
      setCrSubmitStep("submitted");
    }, 1000);
  };

  const handleCloseCR = () => {
    setShowChangeReq(false);
    setCrSubmitStep(null);
    setCrForm({ title: "", description: "", justification: "" });
  };

  const handleCRAction = (cr, action) => {
    if (!crActionComments.trim()) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    let newStatus, auditAction, notifyMsg;
    if (action === "review") { newStatus = "Under Review"; auditAction = "CR Under Review"; notifyMsg = `Policy owner (${POLICIES_DATA.find(p => p.id === cr.policy)?.owner || "—"}) and approver (${POLICIES_DATA.find(p => p.id === cr.policy)?.approver || "—"}) have been notified.`; }
    else if (action === "approve") { newStatus = "Approved"; auditAction = "CR Approved"; notifyMsg = "Policy author has been notified to begin implementing the approved changes."; }
    else if (action === "reject") { newStatus = "Rejected"; auditAction = "CR Rejected"; notifyMsg = `Submitter (${cr.submittedBy}) has been notified of the rejection.`; }
    else if (action === "implement") { newStatus = "Implementation"; auditAction = "CR Implementation Started"; notifyMsg = "Implementation is now in progress. Mark as completed when the new version is ready."; }
    else if (action === "complete") { newStatus = "Completed"; auditAction = "CR Completed"; notifyMsg = "The change has been implemented. The updated policy version should now go through review and approval."; }

    const updatedCR = {
      ...cr, status: newStatus,
      approver: (action === "approve" || action === "reject") ? CURRENT_USER.name : cr.approver,
      reviewComments: crActionComments,
      implementedDate: action === "complete" ? new Date().toISOString().slice(0, 10) : cr.implementedDate,
      lastNotification: notifyMsg,
    };

    setChangeRequests(prev => prev.map(c => c.id === cr.id ? updatedCR : c));
    setShowCRDetail(updatedCR); // keep modal open with updated data

    setPolicyAuditLog(prev => [{
      time: now, user: CURRENT_USER.name, role: CURRENT_USER.role,
      action: auditAction, policyId: cr.policy,
      detail: `${cr.id}: "${cr.title}" — ${newStatus}. ${crActionComments}`
    }, ...prev]);

    setCrActionComments("");
    setCrActionType(null);
  };

  // ── Exception Workflow (BRD 3.5) ──
  // States: Submitted → Under Review → Approved / Denied → (if Approved) Active → Expired
  const EX_STATUS_COLORS = { Submitted: COLORS.info, "Under Review": COLORS.warning, Approved: COLORS.success, Denied: COLORS.danger, Pending: COLORS.info, Active: COLORS.success, Expired: COLORS.textMuted };

  const handleSubmitException = () => {
    if (!exForm.justification || !exForm.policyId) return;
    setExSubmitStep("submitting");
    setTimeout(() => {
      const policyRef = exForm.policyId.split(" — ")[0] || exForm.policyId;
      const policyTitle = POLICIES_DATA.find(p => p.id === policyRef)?.title || exForm.policyId;
      const policyVersion = POLICIES_DATA.find(p => p.id === policyRef)?.version || "—";
      const newEx = {
        id: `EXC-${String(exceptions.length + 1).padStart(3, "0")}`,
        policy: policyRef, policyTitle,
        user: CURRENT_USER.name,
        justification: exForm.justification,
        compensating: exForm.compensating,
        duration: exForm.duration,
        status: "Submitted",
        submitted: new Date().toISOString().slice(0, 10),
        expiry: null,
        approver: null,
        version: policyVersion,
        reviewComments: null,
      };
      setExceptions(prev => [newEx, ...prev]);
      setPolicyAuditLog(prev => [{
        time: new Date().toISOString().slice(0, 16).replace("T", " "),
        user: CURRENT_USER.name, role: CURRENT_USER.role,
        action: "Exception Submitted",
        policyId: policyRef,
        detail: `${newEx.id}: Exception request for ${policyTitle} — ${exForm.justification.slice(0, 80)}...`
      }, ...prev]);
      setExSubmitStep("submitted");
    }, 1000);
  };

  const handleCloseException = () => {
    setShowException(false);
    setExSubmitStep(null);
    setExForm({ policyId: "", justification: "", duration: "90 days", compensating: "" });
  };

  const handleExAction = (ex, action) => {
    if (!exActionComments.trim()) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    let newStatus, auditAction;
    if (action === "review") { newStatus = "Under Review"; auditAction = "Exception Under Review"; }
    else if (action === "approve") { newStatus = "Approved"; auditAction = "Exception Approved"; }
    else if (action === "deny") { newStatus = "Denied"; auditAction = "Exception Denied"; }

    const durationDays = parseInt(ex.duration) || 90;
    const expiryDate = action === "approve" ? new Date(Date.now() + durationDays * 86400000).toISOString().slice(0, 10) : null;

    const updatedEx = {
      ...ex, status: newStatus,
      approver: (action === "approve" || action === "deny") ? CURRENT_USER.name : ex.approver,
      reviewComments: exActionComments,
      expiry: expiryDate || ex.expiry,
    };

    setExceptions(prev => prev.map(e => e.id === ex.id ? updatedEx : e));
    setShowExDetail(updatedEx);

    setPolicyAuditLog(prev => [{
      time: now, user: CURRENT_USER.name, role: CURRENT_USER.role,
      action: auditAction, policyId: ex.policy,
      detail: `${ex.id}: Exception for ${ex.policyTitle || ex.policy} by ${ex.user} — ${newStatus}. ${exActionComments}`
    }, ...prev]);

    setExActionComments("");
    setExActionType(null);
  };

  // AI-Assisted Drafting (BRD 3.10)
  const AI_DRAFT_TEMPLATES = {
    purpose: (title, domain) => `This policy establishes the organization's requirements for ${(title || "the relevant area").toLowerCase()} within the ${domain || "applicable"} domain. It defines the principles, responsibilities, and standards that all personnel must adhere to in order to protect organizational assets, maintain regulatory compliance, and ensure operational resilience.\n\nThe purpose of this policy is to ensure consistent governance over ${(title || "this area").toLowerCase().replace("policy", "").trim()} activities, reduce risk exposure, and provide a clear framework for decision-making and accountability across the organization.`,
    scope: (title, domain) => `This policy applies to all employees, contractors, consultants, temporary workers, and other third parties who access, process, manage, or handle organizational information, systems, or assets related to ${(title || "this domain").toLowerCase().replace("policy", "").trim()}.\n\nThis includes all business units, subsidiaries, and geographic locations operating under the organization's governance structure. Specific applicability within the ${domain || "relevant"} domain includes all systems, processes, and personnel under the purview of the designated policy owner.`,
    statement: (title, domain) => `The organization shall:\n\n1. Establish and maintain documented procedures and standards for ${(title || "this area").toLowerCase().replace("policy", "").trim()} that align with applicable regulatory requirements and industry best practices.\n\n2. Assign clear roles and responsibilities including a designated policy owner, operational leads, and subject matter experts responsible for implementation and ongoing compliance.\n\n3. Conduct regular risk assessments to identify, evaluate, and treat risks within the scope of this policy, with findings reported to relevant governance bodies.\n\n4. Implement appropriate technical and organizational controls proportionate to the identified risks and regulatory requirements.\n\n5. Monitor compliance through regular audits, metrics collection, and management reviews, with deviations addressed through formal exception or remediation processes.\n\n6. Ensure all personnel within scope receive appropriate training and awareness on their obligations under this policy.\n\n7. Review and update this policy in accordance with the defined review cycle, or sooner in response to significant regulatory changes, security incidents, or organizational restructuring.`,
  };

  const handleAIDraft = (field) => {
    const targetFields = field === "all" ? ["purpose", "scope", "statement"] : [field];
    setAiDrafting(true);
    setAiDraftField(field);

    setTimeout(() => {
      const updates = {};
      targetFields.forEach(f => {
        updates[f] = AI_DRAFT_TEMPLATES[f](npForm.title, npForm.domain);
      });
      setNpForm(prev => ({ ...prev, ...updates }));
      setAiDraftGenerated(prev => {
        const next = { ...prev };
        targetFields.forEach(f => { next[f] = true; });
        return next;
      });
      setAiDrafting(false);
      setAiDraftField(null);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Policy Management</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Full lifecycle management with attestation, exceptions, and change control</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {polPerms.managePortal && <Button variant="secondary" icon={Globe} onClick={() => setShowPortalSettings(true)}>Portal Settings</Button>}
          {polPerms.manageExceptions && <Button variant="secondary" icon={Eye} onClick={() => setShowAllExceptions(true)}>All Exceptions</Button>}
          <Button variant="secondary" icon={FileWarning} onClick={() => setShowException(true)}>Submit Exception</Button>
          {polPerms.create ? <Button icon={Plus} onClick={() => { setShowNewPolicy(true); setNpStep(1); setNpForm({ title: "", domain: "", category: "", owner: "", author: CURRENT_USER.name, approver: "", reviewCycle: "Annual", purpose: "", scope: "", statement: "", frameworks: [], controls: [] }); }}>New Policy</Button>
            : <Button icon={Plus} style={{ opacity: 0.4, cursor: "not-allowed" }}>New Policy</Button>}
        </div>
      </div>

      {/* Dashboard Stats — BRD 7.7 */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard icon={FileText} label="TOTAL POLICIES" value={POLICIES_DATA.length} color={COLORS.primary} />
        <StatCard icon={CheckCircle} label="ATTESTATION RATE" value={`${overallAttestRate}%`} sub={`${totalAttest}/${totalReq} complete`} color={overallAttestRate >= 95 ? COLORS.success : COLORS.warning} />
        <StatCard icon={Clock} label="DUE FOR REVIEW" value={dueForReview} sub="Within 6 months" color={dueForReview > 0 ? COLORS.warning : COLORS.success} />
        <StatCard icon={FileWarning} label="ACTIVE EXCEPTIONS" value={totalActiveExc} color={totalActiveExc > 0 ? COLORS.warning : COLORS.success} />
        <StatCard icon={RefreshCw} label="PENDING CHANGES" value={pendingCRs} sub="Change requests" color={pendingCRs > 0 ? COLORS.accent : COLORS.textMuted} />
      </div>

      {/* Charts Row — BRD 7.7: Policies by domain, status distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14 }}>
        <Card title="Policies by Domain & Status">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {domainChartData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 180, fontSize: 11, color: COLORS.textSecondary, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.name}>{d.name}</div>
                <div style={{ flex: 1, display: "flex", height: 18, borderRadius: 4, overflow: "hidden", background: COLORS.surfaceAlt }}>
                  {d.approved > 0 && <div style={{ width: `${(d.approved / POLICIES_DATA.length) * 100 * 3}%`, background: COLORS.success, minWidth: d.approved > 0 ? 18 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{d.approved}</span></div>}
                  {d.review > 0 && <div style={{ width: `${(d.review / POLICIES_DATA.length) * 100 * 3}%`, background: COLORS.warning, minWidth: d.review > 0 ? 18 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{d.review}</span></div>}
                  {d.draft > 0 && <div style={{ width: `${(d.draft / POLICIES_DATA.length) * 100 * 3}%`, background: COLORS.textMuted, minWidth: d.draft > 0 ? 18 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{d.draft}</span></div>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, width: 16, textAlign: "right" }}>{d.count}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 14, marginTop: 4, paddingTop: 6, borderTop: `1px solid ${COLORS.borderLight}` }}>
              {[["Approved", COLORS.success], ["In Review", COLORS.warning], ["Draft", COLORS.textMuted]].map(([label, color]) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: COLORS.textMuted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />{label}
                </span>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Status Overview">
          <div style={{ height: 155, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChartData} cx="50%" cy="50%" outerRadius={55} innerRadius={30} dataKey="value" paddingAngle={3}>
                  {statusChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabs + Search + Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Tabs tabs={[
          { id: "all", label: "All", count: POLICIES_DATA.length },
          { id: "approved", label: "Published", count: POLICIES_DATA.filter(p => p.status === "Approved").length },
          { id: "review", label: "In Review", count: POLICIES_DATA.filter(p => p.status === "In Review").length },
          { id: "draft", label: "Drafts", count: POLICIES_DATA.filter(p => p.status === "Draft").length },
        ]} active={tab} onChange={setTab} />
        <SearchBar placeholder="Search policies..." value={search} onChange={setSearch} style={{ width: 220 }} />
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${domainFilter !== "All" ? COLORS.primary : COLORS.border}`, fontSize: 12, color: domainFilter !== "All" ? COLORS.primary : COLORS.text, background: domainFilter !== "All" ? COLORS.primaryLight : COLORS.surface }}>
          <option value="All">All Domains</option>
          {domainList.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${ownerFilter !== "All" ? COLORS.primary : COLORS.border}`, fontSize: 12, color: ownerFilter !== "All" ? COLORS.primary : COLORS.text, background: ownerFilter !== "All" ? COLORS.primaryLight : COLORS.surface }}>
          <option value="All">All Owners</option>
          {ownerList.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {anyFilterActive && <button onClick={() => { setDomainFilter("All"); setOwnerFilter("All"); setSearch(""); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${COLORS.danger}30`, background: COLORS.dangerLight, color: COLORS.danger, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕ Clear</button>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["cards", "table"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${viewMode === m ? COLORS.primary : COLORS.border}`, background: viewMode === m ? COLORS.primaryLight : COLORS.surface, color: viewMode === m ? COLORS.primary : COLORS.textMuted, fontSize: 11, fontWeight: viewMode === m ? 600 : 400, cursor: "pointer" }}>
              {m === "cards" ? "Cards" : "Table"}
            </button>
          ))}
          <div style={{ position: "relative" }}>
            <Button variant="secondary" size="sm" icon={exportDone ? Check : Download} onClick={() => setShowExportMenu(!showExportMenu)}>
              {exportDone ? (exportDone === "xlsx" ? "✓ CSV Downloaded" : "✓ PDF Opened") : "Export"}
            </Button>
            {showExportMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: COLORS.surface, borderRadius: 10, border: `1px solid ${COLORS.borderLight}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 6, zIndex: 9999, width: 240 }}>
                <button onClick={() => handleExportPolicies("csv")} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", width: "100%", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>XLS</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Excel / CSV</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, lineHeight: 1.3 }}>Copy tab-separated data — paste into Excel or Sheets</div>
                  </div>
                </button>
                <button onClick={() => handleExportPolicies("pdf")} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", width: "100%", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#dc2626" }}>PDF</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>PDF Report</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, lineHeight: 1.3 }}>Styled audit report preview with print option</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Policy Cards View */}
      {viewMode === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
          {filtered.map(p => {
            const pExc = exceptions.filter(e => e.policy === p.id && e.status === "Approved").length;
            const pCR = changeRequests.filter(c => c.policy === p.id && c.status === "Pending").length;
            const reviewSoon = p.nextReview && new Date(p.nextReview) < new Date("2026-06-01");
            return (
              <div key={p.id} onClick={() => { setSelectedPolicy(p); setDetailTab("overview"); }} style={{
                background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.borderLight}`,
                padding: 20, cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,111,237,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={16} color={COLORS.primary} />
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.textMuted }}>{p.id}</span>
                    <span style={{ fontSize: 10, color: COLORS.textMuted }}>v{p.version}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: "0 0 6px" }}>{p.title}</h3>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                  <Badge>{p.category}</Badge>
                  {p.frameworks.slice(0, 2).map(f => <Badge key={f} variant="primary" size="xs">{f}</Badge>)}
                  {p.frameworks.length > 2 && <Badge variant="primary" size="xs">+{p.frameworks.length - 2}</Badge>}
                </div>
                {p.status === "Approved" && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: COLORS.textMuted }}>Attestation</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: p.attestationRate >= 95 ? COLORS.success : COLORS.warning }}>{p.attestationRate}%</span>
                    </div>
                    <ProgressBar value={p.attestationRate} color={p.attestationRate >= 95 ? COLORS.success : p.attestationRate >= 80 ? COLORS.warning : COLORS.danger} height={4} />
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}`, fontSize: 10, color: COLORS.textMuted }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span>Owner: {p.owner}</span>
                    {reviewSoon && <Badge variant="warning" size="xs">Review due</Badge>}
                    {pExc > 0 && <Badge variant="accent" size="xs">{pExc} exc</Badge>}
                    {pCR > 0 && <Badge variant="info" size="xs">{pCR} CR</Badge>}
                  </div>
                  <span>{p.lastUpdated}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Policy Table View */}
      {viewMode === "table" && (
        <Card>
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TableHeader>ID</TableHeader><TableHeader>Policy</TableHeader><TableHeader>Status</TableHeader><TableHeader>Owner</TableHeader><TableHeader>Domain</TableHeader><TableHeader>Attestation</TableHeader><TableHeader>Next Review</TableHeader><TableHeader>Frameworks</TableHeader>
              </tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedPolicy(p); setDetailTab("overview"); }} onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <TableCell><span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{p.id}</span></TableCell>
                    <TableCell><span style={{ fontWeight: 500 }}>{p.title}</span><div style={{ fontSize: 11, color: COLORS.textMuted }}>v{p.version} · {p.category}</div></TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell><span style={{ fontSize: 12 }}>{p.owner}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary }}>{p.domain.length > 22 ? p.domain.slice(0, 20) + "…" : p.domain}</span></TableCell>
                    <TableCell>{p.status === "Approved" ? <span style={{ fontSize: 12, fontWeight: 600, color: p.attestationRate >= 95 ? COLORS.success : COLORS.warning }}>{p.attestationRate}%</span> : <span style={{ fontSize: 11, color: COLORS.textMuted }}>—</span>}</TableCell>
                    <TableCell><span style={{ fontSize: 11, color: p.nextReview && new Date(p.nextReview) < new Date("2026-06-01") ? COLORS.warning : COLORS.textSecondary }}>{p.nextReview || "—"}</span></TableCell>
                    <TableCell><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{p.frameworks.slice(0, 2).map(f => <Badge key={f} size="xs">{f}</Badge>)}{p.frameworks.length > 2 && <Badge size="xs">+{p.frameworks.length - 2}</Badge>}</div></TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ══════ Policy Detail Modal ══════ */}
      <Modal open={!!selectedPolicy && !showApproval && !showEditPolicy} onClose={() => setSelectedPolicy(null)} title={selectedPolicy ? `${selectedPolicy.id} — ${selectedPolicy.title}` : ""} width={840}>
        {selectedPolicy && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${COLORS.borderLight}`, marginBottom: 4, overflowX: "auto" }}>
              {[
                { id: "overview", label: "Overview" },
                { id: "attestation", label: `Attestation (${selectedPolicy.attestationRate}%)` },
                { id: "versions", label: `Versions (${selectedPolicy.versions.length})` },
                { id: "changes", label: `Changes (${changeRequests.filter(c => c.policy === selectedPolicy.id).length})` },
                { id: "exceptions", label: `Exceptions (${exceptions.filter(e => e.policy === selectedPolicy.id).length})` },
                { id: "mapping", label: "GRC Mapping" },
                { id: "audit", label: "Audit Trail" },
              ].map(t => (
                <button key={t.id} onClick={() => setDetailTab(t.id)} style={{
                  padding: "8px 14px", fontSize: 12, fontWeight: detailTab === t.id ? 600 : 400, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  background: "transparent", color: detailTab === t.id ? COLORS.primary : COLORS.textMuted,
                  borderBottom: detailTab === t.id ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                }}>{t.label}</button>
              ))}
            </div>

            {/* ── Tab: Overview ── */}
            {detailTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  {[["Status", <StatusBadge status={selectedPolicy.status} />], ["Version", `v${selectedPolicy.version}`], ["Owner", selectedPolicy.owner], ["Author", selectedPolicy.author],
                    ["Approver", selectedPolicy.approver], ["Review Cycle", selectedPolicy.reviewCycle], ["Effective", selectedPolicy.effectiveDate || "—"], ["Next Review", selectedPolicy.nextReview || "—"],
                  ].map(([l, v], i) => (
                    <div key={i}><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 3 }}>{l}</div><div style={{ fontSize: 13, color: COLORS.text }}>{v}</div></div>
                  ))}
                </div>
                {/* Lifecycle Workflow */}
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Lifecycle Workflow</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {["Draft", "In Review", "Approved", "Published", "Archived"].map((stage, i) => {
                      const current = { Draft: 0, "In Review": 1, Approved: 2 }[selectedPolicy.status] ?? 0;
                      const active = i <= current; const isCurrent = i === current;
                      return (
                        <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: active ? (isCurrent ? COLORS.primary : COLORS.success) : COLORS.surfaceAlt, color: active ? "#fff" : COLORS.textMuted, fontSize: 11, fontWeight: 700, border: isCurrent ? `2px solid ${COLORS.primary}` : "none", boxShadow: isCurrent ? `0 0 0 3px ${COLORS.primary}20` : "none" }}>
                              {active && !isCurrent ? <Check size={13} /> : i + 1}
                            </div>
                            <span style={{ fontSize: 10, color: isCurrent ? COLORS.primary : active ? COLORS.success : COLORS.textMuted, fontWeight: isCurrent ? 600 : 400 }}>{stage}</span>
                          </div>
                          {i < 4 && <div style={{ flex: 1, height: 2, background: active && i < current ? COLORS.success : COLORS.borderLight, margin: "0 6px -16px 6px" }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Mapped Frameworks</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{selectedPolicy.frameworks.map(f => <Badge key={f} variant="primary">{f}</Badge>)}</div>
                </div>
                {/* Role permissions for this policy */}
                <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 14px", fontSize: 11, color: COLORS.textSecondary }}>
                  <strong>Your permissions ({CURRENT_USER.role}):</strong>
                  {" "}{polPerms.edit ? "✓ Edit" : "✗ Edit"} · {polPerms.approve ? "✓ Approve" : "✗ Approve"} · {polPerms.publish ? "✓ Publish" : "✗ Publish"} · {polPerms.manageExceptions ? "✓ Manage Exceptions" : "✗ Exceptions"} · {polPerms.viewAudit ? "✓ Audit Log" : "✗ Audit Log"}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {polPerms.edit ? <Button variant="secondary" icon={Edit} onClick={openEditPolicy}>Edit Policy</Button> : <Button variant="secondary" icon={Edit} style={{ opacity: 0.35, cursor: "not-allowed" }}>Edit Policy</Button>}
                  <Button variant="secondary" icon={RefreshCw} onClick={() => setShowChangeReq(true)}>Request Change</Button>
                  {selectedPolicy.status === "In Review" && polPerms.approve && <Button icon={Check} onClick={() => setShowApproval(true)}>Approve & Publish</Button>}
                </div>
              </div>
            )}

            {/* ── Tab: Attestation with employee table (BRD 3.6) ── */}
            {detailTab === "attestation" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {selectedPolicy.status === "Approved" ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                      {[
                        [selectedPolicy.attestationRate + "%", "Completion", selectedPolicy.attestationRate >= 95 ? COLORS.success : COLORS.warning],
                        [selectedPolicy.attestationRequired, "Required", COLORS.text],
                        [selectedPolicy.attestationComplete, "Completed", COLORS.success],
                        [selectedPolicy.attestationRequired - selectedPolicy.attestationComplete, "Missing", COLORS.danger],
                      ].map(([val, label, color], i) => (
                        <div key={i} style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <ProgressBar value={selectedPolicy.attestationRate} color={selectedPolicy.attestationRate >= 95 ? COLORS.success : COLORS.warning} height={6} />
                    <div style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.infoLight, borderRadius: 8, padding: "8px 12px" }}>
                      Attestations are version-specific (<strong>v{selectedPolicy.version}</strong>). Digital signature and timestamp captured per BRD 3.6. Employees must re-attest when new versions are published.
                    </div>
                    {/* Employee attestation records table (BRD 3.6.2) */}
                    <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Individual Attestation Records (Sample)</div>
                    <div style={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: 10, overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                          <TableHeader style={{ fontSize: 10 }}>Employee</TableHeader><TableHeader style={{ fontSize: 10 }}>Department</TableHeader><TableHeader style={{ fontSize: 10 }}>Status</TableHeader><TableHeader style={{ fontSize: 10 }}>Date & Time</TableHeader><TableHeader style={{ fontSize: 10 }}>E-Signature</TableHeader>
                        </tr></thead>
                        <tbody>
                          {attestationRecords.map((r, i) => (
                            <tr key={i}>
                              <TableCell><span style={{ fontSize: 12, fontWeight: 500 }}>{r.employee}</span></TableCell>
                              <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary }}>{r.dept}</span></TableCell>
                              <TableCell>{r.attested ? <Badge variant="success" size="xs">Attested</Badge> : <Badge variant="danger" size="xs">Pending</Badge>}</TableCell>
                              <TableCell><span style={{ fontSize: 11, color: r.date ? COLORS.textSecondary : COLORS.danger }}>{r.date || "—"}</span></TableCell>
                              <TableCell><span style={{ fontSize: 10, fontFamily: "monospace", color: r.signature ? COLORS.success : COLORS.textMuted }}>{r.signature || "—"}</span></TableCell>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="secondary" icon={Bell}>Send Reminders ({selectedPolicy.attestationRequired - selectedPolicy.attestationComplete})</Button>
                      <Button variant="secondary" icon={Download}>Export Report</Button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px 20px", color: COLORS.textMuted }}>
                    <FileWarning size={28} color={COLORS.textMuted} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Attestation not available</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Policy must be Approved and Published before attestation can begin.</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Versions ── */}
            {detailTab === "versions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedPolicy.versions.map((ver, i) => (
                  <div key={ver.v} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: i === 0 ? `${COLORS.primaryLight}60` : COLORS.surfaceAlt, border: i === 0 ? `1px solid ${COLORS.primary}30` : `1px solid ${COLORS.borderLight}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: i === 0 ? COLORS.primary : COLORS.surfaceAlt, color: i === 0 ? "#fff" : COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>v{ver.v}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{i === 0 ? "Current Version" : "Archived"}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{ver.date} · by {ver.by}</div>
                    </div>
                    {i === 0 && <Badge variant="primary">Latest</Badge>}
                    <Button variant="ghost" size="sm" icon={Download}>Export</Button>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: Change Requests ── */}
            {detailTab === "changes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{changeRequests.filter(c => c.policy === selectedPolicy.id).length} change request(s)</span>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowChangeReq(true)}>New Change Request</Button>
                </div>
                {/* CR Workflow legend */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 10, color: COLORS.textMuted }}>
                  {Object.entries(CR_STATUS_COLORS).map(([status, color]) => (
                    <span key={status} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />{status}
                    </span>
                  ))}
                </div>
                {changeRequests.filter(c => c.policy === selectedPolicy.id).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: COLORS.textMuted, fontSize: 13 }}>No change requests for this policy.</div>
                ) : changeRequests.filter(c => c.policy === selectedPolicy.id).map(cr => (
                  <div key={cr.id} onClick={() => setShowCRDetail(cr)} style={{ padding: "12px 16px", borderRadius: 10, background: COLORS.surfaceAlt, border: `1px solid ${(CR_STATUS_COLORS[cr.status] || COLORS.borderLight) + "40"}`, cursor: "pointer", transition: "all 0.12s", borderLeft: `3px solid ${CR_STATUS_COLORS[cr.status] || COLORS.borderLight}` }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{cr.id}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: CR_STATUS_COLORS[cr.status] || COLORS.textMuted, background: (CR_STATUS_COLORS[cr.status] || COLORS.textMuted) + "15", padding: "2px 8px", borderRadius: 5 }}>{cr.status}</span>
                        <Badge variant={cr.impact === "High" ? "danger" : cr.impact === "Medium" ? "warning" : "default"} size="xs">{cr.impact}</Badge>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: COLORS.textMuted }}>{cr.date}</span>
                        <ChevronRight size={14} color={COLORS.textMuted} />
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 3 }}>{cr.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 3 }}>{cr.description.slice(0, 120)}{cr.description.length > 120 ? "…" : ""}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                      By {cr.submittedBy}
                      {cr.approver && <span> · {cr.status === "Rejected" ? "Rejected" : "Approved"} by {cr.approver}</span>}
                      {!cr.approver && <span> · Click to review</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: Exceptions ── */}
            {detailTab === "exceptions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{exceptions.filter(e => e.policy === selectedPolicy.id).length} exception(s)</span>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowException(true)}>Request Exception</Button>
                </div>
                {exceptions.filter(e => e.policy === selectedPolicy.id).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: COLORS.textMuted, fontSize: 13 }}>No exceptions for this policy.</div>
                ) : exceptions.filter(e => e.policy === selectedPolicy.id).map(ex => (
                  <div key={ex.id} onClick={() => setShowExDetail(ex)} style={{ padding: "12px 16px", borderRadius: 10, background: COLORS.surfaceAlt, border: `1px solid ${ex.status === "Denied" ? COLORS.danger + "30" : COLORS.borderLight}`, cursor: "pointer", borderLeft: `3px solid ${EX_STATUS_COLORS[ex.status] || COLORS.borderLight}`, transition: "all 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.accent, fontWeight: 600 }}>{ex.id}</span>
                        <Badge variant={ex.status === "Approved" ? "warning" : ex.status === "Denied" ? "danger" : "info"}>{ex.status}</Badge>
                        <Badge size="xs">{ex.duration}</Badge>
                        <span style={{ fontSize: 10, color: COLORS.textMuted }}>v{ex.version}</span>
                      </div>
                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>{ex.submitted}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginBottom: 4 }}>{ex.justification}</div>
                    {ex.compensating && <div style={{ fontSize: 11, color: COLORS.info, borderLeft: `2px solid ${COLORS.info}`, paddingLeft: 8, marginBottom: 4 }}><strong>Compensating controls:</strong> {ex.compensating}</div>}
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                      Requested by {ex.user} {ex.approver ? `· ${ex.status} by ${ex.approver}` : "· Awaiting review"}
                      {ex.expiry && <span> · Expires {ex.expiry}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: GRC Mapping ── */}
            {detailTab === "mapping" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Mapped Controls</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedPolicy.controls.map(cid => {
                      const ctrl = CONTROLS_DATA.find(c => c.id === cid);
                      return ctrl ? (
                        <div key={cid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: COLORS.surfaceAlt }}>
                          <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{ctrl.id}</span>
                          <span style={{ fontSize: 12, color: COLORS.text, flex: 1 }}>{ctrl.title}</span>
                          <StatusBadge status={ctrl.status} />
                          <Badge variant={ctrl.rigor === "Critical" ? "danger" : "warning"} size="xs">{ctrl.rigor}</Badge>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Regulatory Frameworks</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{selectedPolicy.frameworks.map(f => <Badge key={f} variant="primary">{f}</Badge>)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Organizational Scope</div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: COLORS.surfaceAlt, fontSize: 12, color: COLORS.textSecondary }}>
                    Domain: <strong>{selectedPolicy.domain}</strong> · Category: <strong>{selectedPolicy.category}</strong> · Applies enterprise-wide within scope
                  </div>
                </div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.surfaceAlt, borderRadius: 8, padding: "8px 12px" }}>
                  <strong>Test Once, Comply Many:</strong> This policy satisfies requirements across {selectedPolicy.frameworks.length} framework{selectedPolicy.frameworks.length > 1 ? "s" : ""} via {selectedPolicy.controls.length} mapped control{selectedPolicy.controls.length > 1 ? "s" : ""}.
                </div>
              </div>
            )}

            {/* ── Tab: Audit Trail (BRD 5.1, 7.8) ── */}
            {detailTab === "audit" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {polPerms.viewAudit ? (
                  <>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Complete audit trail for {selectedPolicy.id}. All entries are immutable and retained for 7 years.</div>
                    {policyAuditLog.filter(a => a.policyId === selectedPolicy.id).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", color: COLORS.textMuted, fontSize: 13 }}>No audit entries recorded yet for this policy in the current session.</div>
                    ) : policyAuditLog.filter(a => a.policyId === selectedPolicy.id).map((a, i) => (
                      <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.borderLight}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Clock size={12} color={COLORS.textMuted} />
                          <span style={{ fontSize: 11, color: COLORS.textMuted }}>{a.time}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{a.user}</span>
                          <Badge size="xs">{a.role}</Badge>
                          <Badge variant="primary" size="xs">{a.action}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{a.detail}</div>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm" icon={Download}>Export Audit Log</Button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px", color: COLORS.textMuted }}>
                    <Lock size={24} color={COLORS.textMuted} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Audit trail access restricted</div>
                    <div style={{ fontSize: 12 }}>Your role ({CURRENT_USER.role}) does not have audit log access.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ══════ Approval Modal with Comments (BRD 3.2.2) ══════ */}
      <Modal open={showApproval && !!selectedPolicy} onClose={closeApprovalFlow} title={approvalResult ? (approvalResult === "approved" ? "Policy Published" : "Policy Rejected") : "Review Policy"} width={560}>
        {selectedPolicy && !approvalResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{selectedPolicy.id} — {selectedPolicy.title}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Version {selectedPolicy.version} · Owner: {selectedPolicy.owner} · Author: {selectedPolicy.author}</div>
            </div>
            <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
              <strong>Business Rule:</strong> No policy may be published without required approvals. Each published policy must have an assigned owner and a defined review cycle. Attestations will begin once published.
            </div>
            {/* Approver assignment (BRD 3.2.2) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Assigned Approver" hint="Confirm or change who is approving this policy">
                <FormSelect value={selectedPolicy.approver} onChange={() => {}} options={["CISO", "CRO", "DPO", "BCM Lead", "IAM Lead"]} />
              </FormField>
              <FormField label="Reviewing As">
                <div style={{ padding: "10px 14px", borderRadius: 8, background: COLORS.surfaceAlt, fontSize: 12, color: COLORS.text }}>{CURRENT_USER.name} <span style={{ color: COLORS.textMuted }}>({CURRENT_USER.role})</span></div>
              </FormField>
            </div>
            {/* Preconditions check */}
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Publication Preconditions</div>
              {[
                { label: "Assigned owner", ok: !!selectedPolicy.owner },
                { label: "Defined review cycle", ok: !!selectedPolicy.reviewCycle },
                { label: "At least one framework mapped", ok: selectedPolicy.frameworks.length > 0 },
                { label: "At least one control mapped", ok: selectedPolicy.controls.length > 0 },
                { label: "Status is In Review", ok: selectedPolicy.status === "In Review" },
              ].map((pc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, marginBottom: 3 }}>
                  {pc.ok ? <CheckCircle size={13} color={COLORS.success} /> : <XCircle size={13} color={COLORS.danger} />}
                  <span style={{ color: pc.ok ? COLORS.text : COLORS.danger }}>{pc.label}</span>
                </div>
              ))}
            </div>
            <FormField label="Review Comments" required hint="Your comments will be recorded in the audit trail">
              <FormTextarea value={approvalComments} onChange={setApprovalComments} placeholder="Reviewed all sections. Content aligns with current regulatory requirements..." rows={3} />
            </FormField>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingTop: 8 }}>
              <Button variant="ghost" onClick={closeApprovalFlow}>Cancel</Button>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" onClick={handleRejectPolicy}
                  style={{ color: approvalComments.trim() ? COLORS.danger : COLORS.textMuted, borderColor: approvalComments.trim() ? COLORS.danger + "40" : COLORS.border, cursor: approvalComments.trim() ? "pointer" : "not-allowed" }}>
                  Reject with Comments
                </Button>
                <Button icon={Check} onClick={handleApprovePublish}
                  style={{ background: approvalComments.trim() ? COLORS.success : COLORS.border, cursor: approvalComments.trim() ? "pointer" : "not-allowed" }}>
                  Approve & Publish
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* ── Approval Result: Approved ── */}
        {selectedPolicy && approvalResult === "approved" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <CheckCircle size={32} color={COLORS.success} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Policy Approved & Published</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{selectedPolicy.id} — {selectedPolicy.title} (v{selectedPolicy.version})</div>
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>What Happens Now</div>
              {[
                { icon: <CheckCircle size={13} color={COLORS.success} />, text: "Policy status changed to Published. Effective date set." },
                { icon: <Bell size={13} color={COLORS.info} />, text: `Attestation campaign initiated — ${selectedPolicy.attestationRequired} employees will be notified to review and attest.` },
                { icon: <Clock size={13} color={COLORS.warning} />, text: `Next review scheduled per ${selectedPolicy.reviewCycle} cycle.` },
                { icon: <FileText size={13} color={COLORS.primary} />, text: "Audit trail entry created with your approval comments." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 12, color: COLORS.textSecondary }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><Button onClick={closeApprovalFlow}>Done</Button></div>
          </div>
        )}
        {/* ── Approval Result: Rejected ── */}
        {selectedPolicy && approvalResult === "rejected" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: COLORS.dangerLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <XCircle size={32} color={COLORS.danger} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Policy Rejected</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{selectedPolicy.id} — {selectedPolicy.title} (v{selectedPolicy.version})</div>
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>What Happens Now</div>
              {[
                { icon: <XCircle size={13} color={COLORS.danger} />, text: "Policy status returned to Draft for revision by the author." },
                { icon: <Bell size={13} color={COLORS.info} />, text: `Author (${selectedPolicy.author}) and owner (${selectedPolicy.owner}) have been notified of the rejection with your comments.` },
                { icon: <Edit size={13} color={COLORS.accent} />, text: "The author should address the review feedback and resubmit for review." },
                { icon: <FileText size={13} color={COLORS.primary} />, text: "Audit trail entry created with rejection reason." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 12, color: COLORS.textSecondary }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><Button onClick={closeApprovalFlow}>Done</Button></div>
          </div>
        )}
      </Modal>

      {/* ══════ Edit Policy Modal (BRD 7.2, 3.1) ══════ */}
      <Modal open={showEditPolicy && !!selectedPolicy} onClose={() => setShowEditPolicy(false)} title={`Edit Policy — ${selectedPolicy?.id || ""}`} width={680}>
        {selectedPolicy && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selectedPolicy.status === "Approved" && (
              <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                <AlertCircle size={14} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                  <strong>Override Edit:</strong> This policy is Approved. Editing will create a new draft version and require re-approval before publication. Changes are tracked in the audit trail.
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Policy Title"><FormInput value={editPolForm.title || ""} onChange={v => trackEditChange("title", v)} /></FormField>
              <FormField label="Domain"><FormSelect value={editPolForm.domain || ""} onChange={v => trackEditChange("domain", v)} options={DOMAINS.map(d => d.name)} /></FormField>
              <FormField label="Category"><FormSelect value={editPolForm.category || ""} onChange={v => trackEditChange("category", v)} options={["Governance", "Security", "Privacy", "Operations", "Risk", "Resilience", "IAM"]} /></FormField>
              <FormField label="Owner"><FormSelect value={editPolForm.owner || ""} onChange={v => trackEditChange("owner", v)} options={["CISO", "CRO", "DPO", "IR Lead", "BCM Lead", "IAM Lead", "Cloud Architect", "Vendor Mgmt Lead"]} /></FormField>
              <FormField label="Author"><FormInput value={editPolForm.author || ""} onChange={v => trackEditChange("author", v)} /></FormField>
              <FormField label="Approver"><FormSelect value={editPolForm.approver || ""} onChange={v => trackEditChange("approver", v)} options={["CISO", "CRO", "DPO", "BCM Lead", "IAM Lead"]} /></FormField>
              <FormField label="Review Cycle"><FormSelect value={editPolForm.reviewCycle || ""} onChange={v => trackEditChange("reviewCycle", v)} options={["Monthly", "Quarterly", "Semi-Annual", "Annual"]} /></FormField>
            </div>

            <FormField label="Regulatory Frameworks">
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["NIS2", "DORA", "ISO 27001", "GDPR", "ABRO 2026", "PCI DSS", "ISO 20000-1", "CMMI"].map(f => {
                  const active = (editPolForm.frameworks || []).includes(f);
                  return <button key={f} onClick={() => trackEditChange("frameworks", active ? editPolForm.frameworks.filter(x => x !== f) : [...editPolForm.frameworks, f])} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primaryLight : COLORS.surface, color: active ? COLORS.primary : COLORS.textMuted, cursor: "pointer", fontWeight: active ? 600 : 400 }}>{active ? "✓ " : ""}{f}</button>;
                })}
              </div>
            </FormField>

            <FormField label="Mapped Controls">
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxHeight: 80, overflow: "auto" }}>
                {CONTROLS_DATA.slice(0, 16).map(c => {
                  const active = (editPolForm.controls || []).includes(c.id);
                  return <button key={c.id} onClick={() => trackEditChange("controls", active ? editPolForm.controls.filter(x => x !== c.id) : [...editPolForm.controls, c.id])} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontFamily: "monospace", border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primaryLight : COLORS.surface, color: active ? COLORS.primary : COLORS.textMuted, cursor: "pointer", fontWeight: active ? 600 : 400 }}>{active ? "✓ " : ""}{c.id}</button>;
                })}
              </div>
            </FormField>

            {/* Change summary */}
            {Object.keys(editPolChanges).length > 0 && (
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>Change Summary ({Object.keys(editPolChanges).length} field{Object.keys(editPolChanges).length > 1 ? "s" : ""} modified)</div>
                {Object.entries(editPolChanges).map(([field, { from, to }]) => (
                  <div key={field} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 4, alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, color: COLORS.text, minWidth: 90 }}>{field}:</span>
                    <span style={{ color: COLORS.danger, textDecoration: "line-through" }}>{String(from).slice(0, 60)}</span>
                    <span style={{ color: COLORS.textMuted }}>→</span>
                    <span style={{ color: COLORS.success }}>{String(to).slice(0, 60)}</span>
                  </div>
                ))}
              </div>
            )}

            <FormField label="Reason for Changes" required hint="Required for audit trail">
              <FormTextarea value={editPolReason} onChange={setEditPolReason} placeholder="Updating due to..." rows={2} />
            </FormField>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingTop: 8 }}>
              <Button variant="ghost" onClick={() => setShowEditPolicy(false)}>Cancel</Button>
              <Button icon={Check} onClick={handleSaveEditPolicy}
                style={{ background: Object.keys(editPolChanges).length > 0 && editPolReason.trim() ? COLORS.primary : COLORS.border, cursor: Object.keys(editPolChanges).length > 0 && editPolReason.trim() ? "pointer" : "not-allowed" }}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══════ New Policy Wizard (BRD 3.1.1) ══════ */}
      <Modal open={showNewPolicy} onClose={() => setShowNewPolicy(false)} title="Create New Policy" width={700}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
          {[{ id: 1, label: "Basic Info" }, { id: 2, label: "Content" }, { id: 3, label: "Mapping" }, { id: 4, label: "Review" }].map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: npStep > step.id ? COLORS.success : npStep === step.id ? COLORS.primary : COLORS.surfaceAlt, color: npStep >= step.id ? "#fff" : COLORS.textMuted, fontSize: 11, fontWeight: 700 }}>
                  {npStep > step.id ? <Check size={12} /> : step.id}
                </div>
                <span style={{ fontSize: 10, color: npStep === step.id ? COLORS.primary : COLORS.textMuted }}>{step.label}</span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: npStep > step.id ? COLORS.success : COLORS.borderLight, margin: "0 8px -14px 8px" }} />}
            </div>
          ))}
        </div>

        {npStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FormField label="Policy Title" required><FormInput value={npForm.title} onChange={v => setNpForm(p => ({ ...p, title: v }))} placeholder="e.g., Data Retention Policy" /></FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Domain" required><FormSelect value={npForm.domain} onChange={v => setNpForm(p => ({ ...p, domain: v }))} options={DOMAINS.map(d => d.name)} placeholder="Select..." /></FormField>
              <FormField label="Category"><FormSelect value={npForm.category} onChange={v => setNpForm(p => ({ ...p, category: v }))} options={["Governance", "Security", "Privacy", "Operations", "Risk", "Resilience", "IAM"]} placeholder="Select..." /></FormField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <FormField label="Owner" required><FormSelect value={npForm.owner} onChange={v => setNpForm(p => ({ ...p, owner: v }))} options={["CISO", "CRO", "DPO", "IR Lead", "BCM Lead", "IAM Lead", "Cloud Architect", "Vendor Mgmt Lead"]} placeholder="Select..." /></FormField>
              <FormField label="Author"><FormInput value={npForm.author} onChange={v => setNpForm(p => ({ ...p, author: v }))} /></FormField>
              <FormField label="Approver" required><FormSelect value={npForm.approver} onChange={v => setNpForm(p => ({ ...p, approver: v }))} options={["CISO", "CRO", "DPO", "BCM Lead", "IAM Lead"]} placeholder="Select..." /></FormField>
            </div>
            <FormField label="Review Cycle"><FormSelect value={npForm.reviewCycle} onChange={v => setNpForm(p => ({ ...p, reviewCycle: v }))} options={["Monthly", "Quarterly", "Semi-Annual", "Annual"]} /></FormField>
          </div>
        )}
        {npStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* AI Banner with Generate All button */}
            <div style={{ background: COLORS.accentLight, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Zap size={16} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: COLORS.accent, lineHeight: 1.5 }}>
                  <strong>AI-Assisted Drafting</strong> — Generate initial content based on your policy metadata ({npForm.title || "untitled"}, {npForm.domain || "no domain"}). All AI-generated content requires human review before finalization.
                </div>
              </div>
              <button onClick={() => handleAIDraft("all")} disabled={aiDrafting}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", cursor: aiDrafting ? "wait" : "pointer",
                  background: COLORS.accent, color: "#fff", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6, opacity: aiDrafting ? 0.7 : 1, flexShrink: 0,
                }}>
                {aiDrafting && aiDraftField === "all" ? (
                  <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating...</>
                ) : (
                  <><Zap size={13} /> Generate All Fields</>
                )}
              </button>
            </div>

            {/* Purpose field with AI button */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Purpose <span style={{ color: COLORS.danger }}>*</span></div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {aiDraftGenerated.purpose && <span style={{ fontSize: 10, color: COLORS.accent, fontWeight: 500 }}>⚡ AI Generated — Review Required</span>}
                  <button onClick={() => handleAIDraft("purpose")} disabled={aiDrafting}
                    style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLORS.accent}40`, background: COLORS.accentLight, color: COLORS.accent, fontSize: 11, fontWeight: 600, cursor: aiDrafting ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    {aiDrafting && aiDraftField === "purpose" ? <RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={11} />}
                    {aiDrafting && aiDraftField === "purpose" ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
              <FormTextarea value={npForm.purpose} onChange={v => { setNpForm(p => ({ ...p, purpose: v })); if (aiDraftGenerated.purpose) setAiDraftGenerated(p => ({ ...p, purpose: false })); }} placeholder="This policy establishes..." rows={3} />
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Why does this policy exist?</div>
            </div>

            {/* Scope field with AI button */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Scope <span style={{ color: COLORS.danger }}>*</span></div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {aiDraftGenerated.scope && <span style={{ fontSize: 10, color: COLORS.accent, fontWeight: 500 }}>⚡ AI Generated — Review Required</span>}
                  <button onClick={() => handleAIDraft("scope")} disabled={aiDrafting}
                    style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLORS.accent}40`, background: COLORS.accentLight, color: COLORS.accent, fontSize: 11, fontWeight: 600, cursor: aiDrafting ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    {aiDrafting && aiDraftField === "scope" ? <RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={11} />}
                    {aiDrafting && aiDraftField === "scope" ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
              <FormTextarea value={npForm.scope} onChange={v => { setNpForm(p => ({ ...p, scope: v })); if (aiDraftGenerated.scope) setAiDraftGenerated(p => ({ ...p, scope: false })); }} placeholder="This policy applies to all employees, contractors, and third parties who..." rows={2} />
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Who and what does this policy apply to?</div>
            </div>

            {/* Policy Statement field with AI button */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Policy Statement <span style={{ color: COLORS.danger }}>*</span></div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {aiDraftGenerated.statement && <span style={{ fontSize: 10, color: COLORS.accent, fontWeight: 500 }}>⚡ AI Generated — Review Required</span>}
                  <button onClick={() => handleAIDraft("statement")} disabled={aiDrafting}
                    style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLORS.accent}40`, background: COLORS.accentLight, color: COLORS.accent, fontSize: 11, fontWeight: 600, cursor: aiDrafting ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    {aiDrafting && aiDraftField === "statement" ? <RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={11} />}
                    {aiDrafting && aiDraftField === "statement" ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
              <FormTextarea value={npForm.statement} onChange={v => { setNpForm(p => ({ ...p, statement: v })); if (aiDraftGenerated.statement) setAiDraftGenerated(p => ({ ...p, statement: false })); }} placeholder="The organization shall..." rows={5} />
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>The core policy requirements</div>
            </div>

            {/* Human review reminder if any AI content exists */}
            {(aiDraftGenerated.purpose || aiDraftGenerated.scope || aiDraftGenerated.statement) && (
              <div style={{ background: COLORS.warningLight, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                <AlertCircle size={14} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: COLORS.warning, lineHeight: 1.5 }}>
                  <strong>Human review required.</strong> AI-generated content is marked with ⚡. Please review and edit all generated text to ensure it accurately reflects your organization's requirements. The marker clears automatically when you edit a field.
                </div>
              </div>
            )}
          </div>
        )}
        {npStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FormField label="Regulatory Frameworks" hint="Select all applicable frameworks"><FrameworkCheckboxes selected={npForm.frameworks} onChange={v => setNpForm(p => ({ ...p, frameworks: v }))} /></FormField>
            <FormField label="Mapped Controls" hint="Link to ICF controls this policy supports">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 100, overflow: "auto" }}>
                {CONTROLS_DATA.slice(0, 16).map(c => {
                  const active = npForm.controls.includes(c.id);
                  return <button key={c.id} onClick={() => setNpForm(p => ({ ...p, controls: active ? p.controls.filter(x => x !== c.id) : [...p.controls, c.id] }))} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontFamily: "monospace", border: `1px solid ${active ? COLORS.primary : COLORS.border}`, background: active ? COLORS.primaryLight : COLORS.surface, color: active ? COLORS.primary : COLORS.textMuted, cursor: "pointer", fontWeight: active ? 600 : 400 }}>{active ? "✓ " : ""}{c.id}</button>;
                })}
              </div>
            </FormField>
          </div>
        )}
        {npStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{npForm.title || "Untitled Policy"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Domain", npForm.domain], ["Category", npForm.category], ["Owner", npForm.owner], ["Author", npForm.author], ["Approver", npForm.approver], ["Review Cycle", npForm.reviewCycle]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 12, color: COLORS.text }}>{v || "—"}</div></div>
                ))}
              </div>
            </div>
            {npForm.purpose && <div style={{ fontSize: 12, color: COLORS.textSecondary, borderLeft: `3px solid ${COLORS.primary}`, paddingLeft: 10 }}><strong>Purpose:</strong> {npForm.purpose.slice(0, 150)}{npForm.purpose.length > 150 ? "…" : ""}</div>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{npForm.frameworks.map(f => <Badge key={f} variant="primary">{f}</Badge>)}{npForm.controls.map(c => <Badge key={c} variant="default" size="xs">{c}</Badge>)}</div>
            <div style={{ background: COLORS.infoLight, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: COLORS.info }}>Policy will be created as <strong>Draft</strong>. It must go through the review and approval workflow before publication.</div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${COLORS.borderLight}`, marginTop: 8 }}>
          {npStep > 1 ? <Button variant="secondary" icon={ChevronLeft} onClick={() => setNpStep(npStep - 1)}>Back</Button> : <Button variant="ghost" onClick={() => setShowNewPolicy(false)}>Cancel</Button>}
          {npStep < 4 ? <Button icon={ChevronRight} onClick={() => setNpStep(npStep + 1)}>Continue</Button> : <Button icon={Check} style={{ background: COLORS.success }}>Create Policy</Button>}
        </div>
      </Modal>

      {/* ══════ Change Request Modal — Full Workflow ══════ */}
      <Modal open={showChangeReq} onClose={handleCloseCR} title="Submit Change Request" width={600}>
        {!crSubmitStep && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>
              Changes to approved policies must follow a formal change workflow (BRD 3.4). Your request will be routed through: <strong>Submitted → Under Review → Approved/Rejected → Implementation → Completed</strong>.
            </div>
            {/* CR Workflow visual */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "4px 0" }}>
              {["Submitted", "Under Review", "Approved", "Implementation", "Completed"].map((stage, i) => (
                <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? COLORS.info : COLORS.surfaceAlt, color: i === 0 ? "#fff" : COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{i + 1}</div>
                    <span style={{ fontSize: 9, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{stage}</span>
                  </div>
                  {i < 4 && <div style={{ flex: 1, height: 1.5, background: COLORS.borderLight, margin: "0 4px -12px 4px" }} />}
                </div>
              ))}
            </div>
            {selectedPolicy && <div style={{ fontSize: 12, color: COLORS.textMuted }}>Policy: <strong>{selectedPolicy.id} — {selectedPolicy.title}</strong> (v{selectedPolicy.version})</div>}
            <FormField label="Change Title" required><FormInput value={crForm.title} onChange={v => setCrForm(p => ({ ...p, title: v }))} placeholder="Brief title for this change request" /></FormField>
            <FormField label="Detailed Description" required hint="Describe the specific changes requested"><FormTextarea value={crForm.description} onChange={v => setCrForm(p => ({ ...p, description: v }))} placeholder="Add/update/remove section on..." rows={3} /></FormField>
            <FormField label="Business Justification" required hint="Why is this change needed?"><FormTextarea value={crForm.justification} onChange={v => setCrForm(p => ({ ...p, justification: v }))} placeholder="Required due to regulatory update / audit finding / incident..." rows={2} /></FormField>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8 }}>
              <Button variant="ghost" onClick={handleCloseCR}>Cancel</Button>
              <Button icon={Check} onClick={handleSubmitCR} style={{ background: crForm.title && crForm.description && crForm.justification ? COLORS.primary : COLORS.border, cursor: crForm.title && crForm.description && crForm.justification ? "pointer" : "not-allowed" }}>Submit Request</Button>
            </div>
          </div>
        )}
        {crSubmitStep === "submitting" && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.primaryLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={24} color={COLORS.primary} style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Submitting Change Request...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Routing to policy owner and approver</div>
          </div>
        )}
        {crSubmitStep === "submitted" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <CheckCircle size={28} color={COLORS.success} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Change Request Submitted</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Your request has been recorded and routed for review.</div>
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>What Happens Next</div>
              {[
                { step: "1", label: "Submitted", desc: "Your change request is now visible in the policy's Changes tab and the audit trail.", status: "done" },
                { step: "2", label: "Under Review", desc: `The policy owner (${selectedPolicy?.owner || "—"}) and approver (${selectedPolicy?.approver || "—"}) will be notified and will review your request.`, status: "next" },
                { step: "3", label: "Approved or Rejected", desc: "The approver will either approve the change (with comments) or reject it with a documented reason.", status: "pending" },
                { step: "4", label: "Implementation", desc: "If approved, the policy author will implement the requested changes in a new draft version.", status: "pending" },
                { step: "5", label: "Completed", desc: "The updated policy version goes through the standard review → approval → publication cycle.", status: "pending" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: s.status === "done" ? COLORS.success : s.status === "next" ? COLORS.primary : COLORS.surfaceAlt, color: s.status === "done" || s.status === "next" ? "#fff" : COLORS.textMuted }}>
                    {s.status === "done" ? <Check size={11} /> : s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.status === "done" ? COLORS.success : s.status === "next" ? COLORS.primary : COLORS.textMuted }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={() => { handleCloseCR(); setDetailTab("changes"); }}>View in Changes Tab</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══════ CR Detail & Action Modal ══════ */}
      <Modal open={!!showCRDetail} onClose={() => { setShowCRDetail(null); setCrActionComments(""); setCrActionType(null); }} title={showCRDetail ? `Change Request ${showCRDetail.id}` : ""} width={620}>
        {showCRDetail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* CR Status workflow */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {CR_STATUSES.filter(s => s !== "Rejected").map((stage, i) => {
                const stageIdx = CR_STATUSES.filter(s => s !== "Rejected").indexOf(stage);
                const currentIdx = CR_STATUSES.filter(s => s !== "Rejected").indexOf(showCRDetail.status === "Rejected" ? "Submitted" : showCRDetail.status);
                const active = stageIdx <= currentIdx;
                const isCurrent = stage === showCRDetail.status;
                return (
                  <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: showCRDetail.status === "Rejected" && stage === "Submitted" ? COLORS.danger : active ? (isCurrent ? COLORS.primary : COLORS.success) : COLORS.surfaceAlt, color: active || (showCRDetail.status === "Rejected" && stage === "Submitted") ? "#fff" : COLORS.textMuted, border: isCurrent ? `2px solid ${COLORS.primary}` : "none" }}>
                        {active && !isCurrent ? <Check size={10} /> : i + 1}
                      </div>
                      <span style={{ fontSize: 9, color: isCurrent ? COLORS.primary : COLORS.textMuted }}>{stage}</span>
                    </div>
                    {i < 4 && <div style={{ flex: 1, height: 1.5, background: active && stageIdx < currentIdx ? COLORS.success : COLORS.borderLight, margin: "0 4px -12px 4px" }} />}
                  </div>
                );
              })}
            </div>
            {showCRDetail.status === "Rejected" && (
              <div style={{ background: COLORS.dangerLight, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <XCircle size={14} color={COLORS.danger} />
                <span style={{ fontSize: 12, color: COLORS.danger, fontWeight: 500 }}>This change request was rejected by {showCRDetail.approver}.</span>
              </div>
            )}

            {/* CR Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Status", <span style={{ color: CR_STATUS_COLORS[showCRDetail.status], fontWeight: 600 }}>{showCRDetail.status}</span>], ["Policy", showCRDetail.policy], ["Impact", <Badge variant={showCRDetail.impact === "High" ? "danger" : showCRDetail.impact === "Medium" ? "warning" : "default"} size="xs">{showCRDetail.impact}</Badge>],
                ["Submitted By", showCRDetail.submittedBy], ["Date", showCRDetail.date], ["Approver", showCRDetail.approver || "Pending"],
              ].map(([l, v], i) => (
                <div key={i}><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{showCRDetail.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{showCRDetail.description}</div>
              {showCRDetail.justification && <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5, marginTop: 6, borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 6 }}><strong>Justification:</strong> {showCRDetail.justification}</div>}
            </div>
            {showCRDetail.reviewComments && (
              <div style={{ borderLeft: `3px solid ${showCRDetail.status === "Rejected" ? COLORS.danger : COLORS.success}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Review Comments</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{showCRDetail.reviewComments}</div>
              </div>
            )}

            {/* Notification banner after transition */}
            {showCRDetail.lastNotification && (
              <div style={{ background: COLORS.infoLight, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Bell size={14} color={COLORS.info} style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: COLORS.info, lineHeight: 1.5 }}>{showCRDetail.lastNotification}</div>
              </div>
            )}

            {/* Action area — based on CR status and user role */}
            {canManageCR && showCRDetail.status !== "Completed" && showCRDetail.status !== "Rejected" && (
              <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 12 }}>
                {!crActionType && (
                  <div>
                    {/* Show which action is available based on current status */}
                    {showCRDetail.status === "Submitted" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Next step: move to formal review by policy owner and approver.</div>
                        <Button onClick={() => setCrActionType("review")}>Move to Under Review</Button>
                      </div>
                    )}
                    {showCRDetail.status === "Under Review" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Review complete. Approve or reject this change request.</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Button variant="secondary" style={{ color: COLORS.danger, borderColor: COLORS.danger + "40" }} onClick={() => setCrActionType("reject")}>Reject</Button>
                          <Button onClick={() => setCrActionType("approve")}>Approve Change</Button>
                        </div>
                      </div>
                    )}
                    {showCRDetail.status === "Approved" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Approved. Begin implementing the changes in a new policy draft.</div>
                        <Button onClick={() => setCrActionType("implement")}>Begin Implementation</Button>
                      </div>
                    )}
                    {showCRDetail.status === "Implementation" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Implementation in progress. Mark as completed when the new version is ready.</div>
                        <Button style={{ background: COLORS.success }} onClick={() => setCrActionType("complete")}>Mark as Completed</Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Comment form for any action type */}
                {crActionType && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, background: crActionType === "reject" ? COLORS.dangerLight : crActionType === "review" ? COLORS.infoLight : COLORS.successLight, borderRadius: 10, padding: "14px 16px", marginTop: crActionType ? 10 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: crActionType === "reject" ? COLORS.danger : crActionType === "review" ? COLORS.info : COLORS.success }}>
                      {{ review: "Move to Under Review", approve: "Approve Change Request", reject: "Reject Change Request", implement: "Begin Implementation", complete: "Mark as Completed" }[crActionType]}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.5 }}>
                      {{ review: "Add review notes. The policy owner and approver will be notified to begin their formal review.",
                        approve: "Confirm approval with comments. The policy author will be notified to implement the approved changes in a new draft version.",
                        reject: "Provide a clear reason for rejection. The submitter will be notified and may submit a revised request.",
                        implement: "Describe your implementation plan. This signals that policy editing has begun.",
                        complete: "Describe the changes implemented and reference the new policy version number. The policy must then go through the standard approval and publication workflow.",
                      }[crActionType]}
                    </div>
                    <FormField label={{ review: "Review Notes", approve: "Approval Comments", reject: "Rejection Reason", implement: "Implementation Plan", complete: "Completion Summary" }[crActionType]} required>
                      <FormTextarea value={crActionComments} onChange={setCrActionComments}
                        placeholder={{ review: "Acknowledge receipt. Assign reviewer if applicable...", approve: "Reviewed and approved. Changes align with regulatory requirements...", reject: "Request is rejected because...", implement: "Beginning edits on policy v3.3. Expected changes include...", complete: "Changes implemented in v3.3. Updated sections: ..." }[crActionType]}
                        rows={3} />
                    </FormField>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Button variant="ghost" onClick={() => { setCrActionType(null); setCrActionComments(""); }}>Cancel</Button>
                      <Button icon={Check}
                        onClick={() => handleCRAction(showCRDetail, crActionType)}
                        style={{ background: crActionComments.trim() ? ({ reject: COLORS.danger, review: COLORS.info, approve: COLORS.success, implement: COLORS.accent, complete: COLORS.success }[crActionType]) : COLORS.border, cursor: crActionComments.trim() ? "pointer" : "not-allowed" }}>
                        {{ review: "Confirm & Notify", approve: "Confirm Approval", reject: "Confirm Rejection", implement: "Start Implementation", complete: "Confirm Completion" }[crActionType]}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Terminal state info */}
            {(showCRDetail.status === "Completed" || showCRDetail.status === "Rejected") && (
              <div style={{ background: showCRDetail.status === "Completed" ? COLORS.successLight : COLORS.dangerLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: showCRDetail.status === "Completed" ? COLORS.success : COLORS.danger }}>
                This change request is <strong>{showCRDetail.status.toLowerCase()}</strong>. No further actions are available. All transitions have been recorded in the audit trail.
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ══════ Exception Request Modal — Full Workflow (BRD 3.5) ══════ */}
      <Modal open={showException} onClose={handleCloseException} title="Submit Policy Exception Request" width={600}>
        {!exSubmitStep && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: COLORS.warningLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <AlertCircle size={15} color={COLORS.warning} style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: COLORS.warning, lineHeight: 1.5 }}>
                Exceptions must be documented and approved before becoming active. They are version-specific, time-limited, and subject to audit. Workflow: <strong>Submitted → Under Review → Approved/Denied</strong>.
              </div>
            </div>
            <FormField label="Policy" required>
              <FormSelect value={exForm.policyId || (selectedPolicy ? selectedPolicy.id + " — " + selectedPolicy.title : "")} onChange={v => setExForm(p => ({ ...p, policyId: v }))} options={POLICIES_DATA.filter(p => p.status === "Approved").map(p => p.id + " — " + p.title)} placeholder="Select policy..." />
            </FormField>
            <FormField label="Exception Justification" required hint="Why can't you comply with this policy?"><FormTextarea value={exForm.justification} onChange={v => setExForm(p => ({ ...p, justification: v }))} placeholder="Unable to comply because..." rows={3} /></FormField>
            <FormField label="Compensating Controls" hint="What mitigating measures are in place to reduce the risk?"><FormTextarea value={exForm.compensating} onChange={v => setExForm(p => ({ ...p, compensating: v }))} placeholder="Alternative controls include..." rows={2} /></FormField>
            <FormField label="Requested Duration"><FormSelect value={exForm.duration} onChange={v => setExForm(p => ({ ...p, duration: v }))} options={["30 days", "60 days", "90 days", "180 days", "365 days"]} /></FormField>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8 }}>
              <Button variant="ghost" onClick={handleCloseException}>Cancel</Button>
              <Button icon={Check} onClick={handleSubmitException} style={{ background: exForm.justification && exForm.policyId ? COLORS.warning : COLORS.border, cursor: exForm.justification && exForm.policyId ? "pointer" : "not-allowed" }}>Submit Exception</Button>
            </div>
          </div>
        )}
        {exSubmitStep === "submitting" && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.warningLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={24} color={COLORS.warning} style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Submitting Exception Request...</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Routing to policy owner for review</div>
          </div>
        )}
        {exSubmitStep === "submitted" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.successLight, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <CheckCircle size={28} color={COLORS.success} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Exception Request Submitted</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Your exception has been logged and routed for approval.</div>
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>Exception Approval Workflow</div>
              {[
                { step: "1", label: "Submitted", desc: "Your request is recorded in the system and visible in the Exceptions tab and centralized view.", status: "done" },
                { step: "2", label: "Under Review", desc: "The policy owner and compliance team will evaluate your justification and compensating controls.", status: "next" },
                { step: "3", label: "Decision", desc: "The approver will approve (with expiry date set) or deny (with documented reason). You will be notified.", status: "pending" },
                { step: "4", label: "If Approved", desc: `Exception becomes active for ${exForm.duration}. Expiry is tracked and auto-flagged 30 days before deadline.`, status: "pending" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: s.status === "done" ? COLORS.success : s.status === "next" ? COLORS.warning : COLORS.surfaceAlt, color: s.status === "done" || s.status === "next" ? "#fff" : COLORS.textMuted }}>
                    {s.status === "done" ? <Check size={11} /> : s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.status === "done" ? COLORS.success : s.status === "next" ? COLORS.warning : COLORS.textMuted }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary" onClick={() => { handleCloseException(); setShowAllExceptions(true); }}>View All Exceptions</Button>
              <Button onClick={() => { handleCloseException(); if (selectedPolicy) setDetailTab("exceptions"); }}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══════ Exception Detail & Action Modal ══════ */}
      <Modal open={!!showExDetail} onClose={() => { setShowExDetail(null); setExActionComments(""); setExActionType(null); }} title={showExDetail ? `Exception ${showExDetail.id}` : ""} width={620}>
        {showExDetail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {["Submitted", "Under Review", "Decision"].map((stage, i) => {
                const stageMap = { Submitted: 0, "Under Review": 1, Approved: 2, Denied: 2 };
                const current = stageMap[showExDetail.status] ?? 0;
                const active = i <= current; const isCurrent = (i === current);
                return (
                  <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: showExDetail.status === "Denied" && i === 2 ? COLORS.danger : active ? (isCurrent ? COLORS.warning : COLORS.success) : COLORS.surfaceAlt, color: active || (showExDetail.status === "Denied" && i === 2) ? "#fff" : COLORS.textMuted }}>
                        {active && !isCurrent ? <Check size={11} /> : i + 1}
                      </div>
                      <span style={{ fontSize: 9, color: isCurrent ? COLORS.warning : COLORS.textMuted }}>{i === 2 ? (showExDetail.status === "Approved" ? "Approved" : showExDetail.status === "Denied" ? "Denied" : "Decision") : stage}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 1.5, background: active && i < current ? COLORS.success : COLORS.borderLight, margin: "0 6px -12px 6px" }} />}
                  </div>
                );
              })}
            </div>

            {showExDetail.status === "Denied" && (
              <div style={{ background: COLORS.dangerLight, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <XCircle size={14} color={COLORS.danger} /><span style={{ fontSize: 12, color: COLORS.danger, fontWeight: 500 }}>This exception was denied by {showExDetail.approver}.</span>
              </div>
            )}
            {showExDetail.status === "Approved" && (
              <div style={{ background: COLORS.successLight, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={14} color={COLORS.success} /><span style={{ fontSize: 12, color: COLORS.success, fontWeight: 500 }}>Approved — active until {showExDetail.expiry}.</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Status", <span style={{ fontWeight: 600, color: EX_STATUS_COLORS[showExDetail.status] }}>{showExDetail.status}</span>], ["Policy", showExDetail.policy], ["Version", `v${showExDetail.version}`],
                ["Requested By", showExDetail.user], ["Duration", showExDetail.duration], ["Submitted", showExDetail.submitted],
                ["Approver", showExDetail.approver || "Pending"], ["Expiry", showExDetail.expiry || "—"], ["Policy Title", showExDetail.policyTitle || "—"],
              ].map(([l, v], i) => (
                <div key={i}><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Justification</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{showExDetail.justification}</div>
            </div>
            {showExDetail.compensating && (
              <div style={{ borderLeft: `3px solid ${COLORS.info}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.info, textTransform: "uppercase" }}>Compensating Controls</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{showExDetail.compensating}</div>
              </div>
            )}
            {showExDetail.reviewComments && (
              <div style={{ borderLeft: `3px solid ${showExDetail.status === "Denied" ? COLORS.danger : COLORS.success}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase" }}>Review Comments ({showExDetail.approver})</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{showExDetail.reviewComments}</div>
              </div>
            )}

            {/* Action area */}
            {polPerms.manageExceptions && showExDetail.status !== "Approved" && showExDetail.status !== "Denied" && (
              <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 12 }}>
                {!exActionType && (
                  <div>
                    {showExDetail.status === "Submitted" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Acknowledge and begin review.</span>
                        <Button onClick={() => setExActionType("review")}>Move to Under Review</Button>
                      </div>
                    )}
                    {showExDetail.status === "Under Review" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Approve or deny this exception.</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Button variant="secondary" style={{ color: COLORS.danger, borderColor: COLORS.danger + "40" }} onClick={() => setExActionType("deny")}>Deny</Button>
                          <Button style={{ background: COLORS.success }} onClick={() => setExActionType("approve")}>Approve</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {exActionType && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, background: exActionType === "deny" ? COLORS.dangerLight : exActionType === "review" ? COLORS.infoLight : COLORS.successLight, borderRadius: 10, padding: "14px 16px", marginTop: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: exActionType === "deny" ? COLORS.danger : exActionType === "review" ? COLORS.info : COLORS.success }}>
                      {{ review: "Move to Under Review", approve: "Approve Exception", deny: "Deny Exception" }[exActionType]}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.5 }}>
                      {{ review: "Acknowledge receipt and begin formal evaluation of the justification and compensating controls.",
                        approve: `Approving will activate this exception for ${showExDetail.duration}. The expiry date will be automatically calculated and tracked.`,
                        deny: "Provide a clear reason for denial. The requestor will be notified and must achieve compliance or submit a revised request.",
                      }[exActionType]}
                    </div>
                    <FormField label={{ review: "Review Notes", approve: "Approval Comments", deny: "Denial Reason" }[exActionType]} required>
                      <FormTextarea value={exActionComments} onChange={setExActionComments}
                        placeholder={{ review: "Acknowledged. Will evaluate compensating controls...", approve: "Exception approved. Compensating controls are adequate. Will be reviewed before expiry.", deny: "Denied because compensating controls are insufficient. Specifically..." }[exActionType]} rows={3} />
                    </FormField>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Button variant="ghost" onClick={() => { setExActionType(null); setExActionComments(""); }}>Cancel</Button>
                      <Button icon={Check} onClick={() => handleExAction(showExDetail, exActionType)}
                        style={{ background: exActionComments.trim() ? ({ deny: COLORS.danger, review: COLORS.info, approve: COLORS.success }[exActionType]) : COLORS.border, cursor: exActionComments.trim() ? "pointer" : "not-allowed" }}>
                        {{ review: "Confirm & Notify", approve: "Confirm Approval", deny: "Confirm Denial" }[exActionType]}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(showExDetail.status === "Approved" || showExDetail.status === "Denied") && (
              <div style={{ background: showExDetail.status === "Approved" ? COLORS.successLight : COLORS.dangerLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: showExDetail.status === "Approved" ? COLORS.success : COLORS.danger }}>
                This exception is <strong>{showExDetail.status.toLowerCase()}</strong>. {showExDetail.status === "Approved" ? `Active until ${showExDetail.expiry}. Will be flagged for re-evaluation before expiry.` : "The requestor must achieve compliance or submit a revised request."}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ══════ Centralized Exceptions View ══════ */}
      <Modal open={showAllExceptions} onClose={() => setShowAllExceptions(false)} title="All Policy Exceptions" width={900}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              [exceptions.filter(e => e.status === "Approved" && e.expiry && new Date(e.expiry) > new Date()).length, "Active", COLORS.success],
              [exceptions.filter(e => e.status === "Submitted" || e.status === "Under Review" || e.status === "Pending").length, "Pending Review", COLORS.warning],
              [exceptions.filter(e => e.status === "Denied").length, "Denied", COLORS.danger],
              [exceptions.filter(e => e.status === "Approved" && e.expiry && new Date(e.expiry) < new Date("2026-05-18")).length, "Expiring Soon", COLORS.accent],
            ].map(([val, label, color], i) => (
              <div key={i} style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 18px", textAlign: "center", flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ overflow: "auto", border: `1px solid ${COLORS.borderLight}`, borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <TableHeader>ID</TableHeader><TableHeader>Policy</TableHeader><TableHeader>Requestor</TableHeader><TableHeader>Status</TableHeader><TableHeader>Duration</TableHeader><TableHeader>Submitted</TableHeader><TableHeader>Expiry</TableHeader><TableHeader>Approver</TableHeader><TableHeader></TableHeader>
              </tr></thead>
              <tbody>
                {exceptions.map(ex => (
                  <tr key={ex.id} style={{ cursor: "pointer" }} onClick={() => { setShowAllExceptions(false); setShowExDetail(ex); }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <TableCell><span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.accent, fontWeight: 600 }}>{ex.id}</span></TableCell>
                    <TableCell><span style={{ fontSize: 12 }}>{ex.policy}</span><div style={{ fontSize: 10, color: COLORS.textMuted }}>{ex.policyTitle}</div></TableCell>
                    <TableCell><span style={{ fontSize: 12 }}>{ex.user}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, fontWeight: 600, color: EX_STATUS_COLORS[ex.status], background: (EX_STATUS_COLORS[ex.status] || COLORS.textMuted) + "15", padding: "2px 8px", borderRadius: 5 }}>{ex.status}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11 }}>{ex.duration}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary }}>{ex.submitted}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, color: ex.expiry && new Date(ex.expiry) < new Date("2026-05-18") ? COLORS.danger : COLORS.textSecondary }}>{ex.expiry || "—"}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary }}>{ex.approver || "Pending"}</span></TableCell>
                    <TableCell><ChevronRight size={14} color={COLORS.textMuted} /></TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="secondary" icon={Download}>Export Exceptions Report</Button>
            <Button variant="secondary" icon={FileWarning} onClick={() => { setShowAllExceptions(false); setShowException(true); }}>New Exception Request</Button>
          </div>
        </div>
      </Modal>

      {/* ══════ Portal Settings Modal (BRD 3.7) ══════ */}
      <Modal open={showPortalSettings} onClose={() => setShowPortalSettings(false)} title="Employee Policy Portal Settings" width={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>
            Configure the employee-facing policy portal where staff can view published policies, complete attestations, and submit exception requests.
          </div>
          {[
            { label: "Public Sharing", desc: "Allow unauthenticated access to the policy portal", key: "publicSharing" },
            { label: "Passcode Protection", desc: "Require a passcode for portal access", key: "passcodeEnabled" },
            { label: "Intranet Embed", desc: "Allow embedding the portal in company intranet pages", key: "embedEnabled" },
          ].map(opt => (
            <div key={opt.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: COLORS.surfaceAlt }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{opt.desc}</div>
              </div>
              <button onClick={() => setPortalSettings(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                style={{ width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: portalSettings[opt.key] ? COLORS.primary : COLORS.border, position: "relative", transition: "background 0.15s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: portalSettings[opt.key] ? 21 : 3, transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          ))}
          {portalSettings.passcodeEnabled && (
            <FormField label="Portal Passcode">
              <FormInput value={portalSettings.passcode} onChange={v => setPortalSettings(prev => ({ ...prev, passcode: v }))} />
            </FormField>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8 }}>
            <Button variant="secondary" icon={Globe}>Copy Portal Link</Button>
            <Button icon={Check} onClick={() => setShowPortalSettings(false)}>Save Settings</Button>
          </div>
        </div>
      </Modal>

      {/* ══════ Export Preview Modal ══════ */}
      <Modal open={!!showExportPreview} onClose={() => setShowExportPreview(null)} title={showExportPreview === "csv" ? "Export — Excel / CSV" : "Export — Policy Register Report"} width={showExportPreview === "pdf" ? 900 : 780}>
        {showExportPreview === "csv" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary }}>
              Tab-separated data for {filtered.length} policies. Click <strong>Copy to Clipboard</strong>, then paste directly into Excel, Google Sheets, or any spreadsheet.
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px", maxHeight: 300, overflow: "auto", fontFamily: "monospace", fontSize: 10, lineHeight: 1.6, whiteSpace: "pre", color: COLORS.textSecondary, border: `1px solid ${COLORS.borderLight}` }}>
              {getExportCSV()}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{filtered.length} rows · 19 columns</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" onClick={() => setShowExportPreview(null)}>Close</Button>
                <Button icon={exportCopied ? Check : Copy} onClick={handleCopyExport} style={{ background: exportCopied ? COLORS.success : COLORS.primary }}>
                  {exportCopied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {showExportPreview === "pdf" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "24px 28px", maxHeight: 440, overflow: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px solid #3b6fed", paddingBottom: 14, marginBottom: 18 }}>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: "#3b6fed" }}>ICF Policy Register</div><div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>Full policy lifecycle report</div></div>
                <div style={{ textAlign: "right", fontSize: 9, color: "#64748b", lineHeight: 1.5 }}>Generated: {new Date().toLocaleString()}<br/>By: {CURRENT_USER.name} ({CURRENT_USER.role})<br/>ICF Control Cockpit</div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {[[POLICIES_DATA.length, "Total Policies"], [overallAttestRate + "%", "Attestation Rate"], [dueForReview, "Due for Review"], [totalActiveExc, "Active Exceptions"], [pendingCRs, "Pending Changes"]].map(([v, l], i) => (
                  <div key={i} style={{ flex: 1, background: "#f8fafc", borderRadius: 6, padding: "10px 12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 8, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Policy Register ({filtered.length} total)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead><tr>{["ID", "Policy", "Status", "Owner", "Domain", "Attestation", "Next Review", "Frameworks"].map(h => <th key={h} style={{ background: "#f1f5f9", padding: "6px 8px", textAlign: "left", fontWeight: 600, fontSize: 8, textTransform: "uppercase", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>{h}</th>)}</tr></thead>
                <tbody>{filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontFamily: "monospace", color: "#3b6fed", fontWeight: 600, fontSize: 10 }}>{p.id}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9" }}><div style={{ fontWeight: 600, fontSize: 10 }}>{p.title}</div><div style={{ fontSize: 9, color: "#94a3b8" }}>v{p.version}</div></td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9" }}><span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 8, fontWeight: 600, background: p.status === "Approved" ? "#dcfce7" : p.status === "In Review" ? "#fef3c7" : "#f1f5f9", color: p.status === "Approved" ? "#16a34a" : p.status === "In Review" ? "#d97706" : "#64748b" }}>{p.status}</span></td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontSize: 10 }}>{p.owner}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontSize: 9, color: "#64748b" }}>{p.domain}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontSize: 10, fontWeight: 600, color: p.status === "Approved" ? (p.attestationRate >= 95 ? "#16a34a" : "#d97706") : "#94a3b8" }}>{p.status === "Approved" ? p.attestationRate + "%" : "\u2014"}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontSize: 10, color: "#64748b" }}>{p.nextReview || "\u2014"}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontSize: 9, color: "#64748b" }}>{p.frameworks.join(", ")}</td>
                  </tr>
                ))}</tbody>
              </table>
              <div style={{ marginTop: 16, paddingTop: 10, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: 8, color: "#94a3b8" }}>
                <span>CONFIDENTIAL \u2014 ICF Control Cockpit</span><span>7-year retention per DORA Art. 10</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{filtered.length} policies</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" onClick={() => setShowExportPreview(null)}>Close</Button>
                <Button variant="secondary" icon={exportCopied ? Check : Copy} onClick={handleCopyExport}>{exportCopied ? "Copied!" : "Copy Data"}</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Page: User Admin ───
const UserAdmin = ({ onUserSwitch }) => {
  const ROLES = ["Super Admin", "Compliance Officer", "Security Manager", "Internal Auditor", "Executive Viewer"];
  const [users, setUsers] = useState(USERS_DATA);
  const [showInvite, setShowInvite] = useState(false);
  const [showEditUser, setShowEditUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRoleDetail, setShowRoleDetail] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "", mfa: true });
  const [inviteSent, setInviteSent] = useState(false);
  const [userFilter, setUserFilter] = useState("all");

  const ROLE_ACCESS = {
    "Super Admin": { screens: ["Dashboard", "Control Library", "Evidence", "Policies", "Gap Analysis", "Reports", "Scopes", "User Admin", "Settings"], actions: ["Full CRUD on all modules", "Manage users and roles", "Approve policies and controls", "Configure AI engine", "Run gap analysis", "Export all reports", "Access audit logs", "Change gap status", "Accept risk"], login: "SSO via corporate IdP + MFA required", color: COLORS.accent },
    "Compliance Officer": { screens: ["Dashboard", "Control Library", "Evidence", "Policies", "Gap Analysis", "Reports", "Scopes"], actions: ["Manage controls", "Upload and approve evidence", "Approve policies", "Run gap analysis", "Change gap status", "Export reports", "Access audit logs"], login: "SSO via corporate IdP + MFA required", color: COLORS.primary },
    "Security Manager": { screens: ["Dashboard", "Control Library", "Evidence", "Policies (view)", "Gap Analysis", "Reports", "Scopes"], actions: ["Manage controls", "Upload evidence", "Run gap analysis", "Manage remediation", "Export reports"], login: "SSO via corporate IdP + MFA required", color: COLORS.info },
    "Internal Auditor": { screens: ["Dashboard", "Control Library (read-only)", "Evidence (read-only)", "Policies (read-only)", "Gap Analysis", "Reports"], actions: ["View all controls and evidence", "Run gap analysis", "Change gap status", "Export reports", "Access audit logs"], login: "SSO via corporate IdP + MFA required (read-only access)", color: COLORS.warning },
    "Executive Viewer": { screens: ["Dashboard", "Reports"], actions: ["View dashboard KPIs", "View and export reports"], login: "SSO via corporate IdP (MFA optional)", color: COLORS.textMuted },
  };

  const filteredUsers = users.filter(u => {
    if (userFilter === "active") return u.status === "Active";
    if (userFilter === "inactive") return u.status === "Inactive";
    if (userFilter === "no-mfa") return !u.mfa;
    return true;
  });

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.role) return;
    const newUser = { id: users.length + 1, name: inviteForm.name, email: inviteForm.email, role: inviteForm.role, status: "Active", lastLogin: "Pending", mfa: inviteForm.mfa };
    const updated = [...users, newUser];
    setUsers(updated);
    USERS_DATA = updated;
    setInviteSent(true);
  };

  const handleDeleteUser = (user) => {
    const updated = users.filter(u => u.id !== user.id);
    setUsers(updated);
    USERS_DATA = updated;
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (user) => {
    const updated = users.map(u => u.id === user.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u);
    setUsers(updated);
    USERS_DATA = updated;
    setShowEditUser(null);
  };

  const handleSwitchUser = (user) => {
    CURRENT_USER = { name: user.name, role: user.role };
    if (onUserSwitch) onUserSwitch(user);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>User Administration</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Role-based access control with SSO & MFA enforcement</p>
        </div>
        <Button icon={Plus} onClick={() => setShowInvite(true)}>Invite User</Button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon={Users} label="TOTAL USERS" value={users.length} color={COLORS.primary} />
        <StatCard icon={UserCheck} label="ACTIVE" value={users.filter(u => u.status === "Active").length} color={COLORS.success} />
        <StatCard icon={ShieldCheck} label="MFA ENABLED" value={Math.round(users.filter(u => u.mfa).length / users.length * 100) + "%"} color={COLORS.info} />
        <StatCard icon={Key} label="RBAC ROLES" value={ROLES.length} color={COLORS.accent} />
      </div>

      {/* Current session info */}
      <div style={{ background: COLORS.primaryLight, borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: COLORS.primary }}>Logged in as: <strong>{CURRENT_USER.name}</strong> ({CURRENT_USER.role})</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>Authentication: SSO + MFA | Session: Active</div>
      </div>

      <Card title="Users" actions={
        <div style={{ display: "flex", gap: 8 }}>
          {[["all", "All"], ["active", "Active"], ["inactive", "Inactive"], ["no-mfa", "No MFA"]].map(([id, label]) => (
            <button key={id} onClick={() => setUserFilter(id)} style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid " + (userFilter === id ? COLORS.primary : COLORS.border), background: userFilter === id ? COLORS.primaryLight : "transparent", color: userFilter === id ? COLORS.primary : COLORS.textMuted, fontSize: 11, fontWeight: userFilter === id ? 600 : 400, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
      }>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <TableHeader>User</TableHeader><TableHeader>Role</TableHeader><TableHeader>Status</TableHeader><TableHeader>MFA</TableHeader><TableHeader>Last Login</TableHeader><TableHeader style={{ textAlign: "center" }}>Actions</TableHeader>
            </tr></thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ background: u.name === CURRENT_USER.name ? COLORS.primaryLight + "40" : "transparent" }}>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.primary + "12", color: COLORS.primary, fontWeight: 600, fontSize: 13 }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13, color: COLORS.text }}>{u.name}{u.name === CURRENT_USER.name && <span style={{ fontSize: 9, color: COLORS.primary, marginLeft: 6, background: COLORS.primaryLight, padding: "1px 6px", borderRadius: 4 }}>YOU</span>}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span onClick={() => setShowRoleDetail(u.role)} style={{ cursor: "pointer" }}><Badge variant={u.role === "Super Admin" ? "accent" : u.role === "Compliance Officer" ? "primary" : u.role === "Security Manager" ? "info" : "default"}>{u.role}</Badge></span></TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: u.mfa ? COLORS.success : COLORS.danger }} />
                      <span style={{ fontSize: 12, color: u.mfa ? COLORS.success : COLORS.danger }}>{u.mfa ? "Enabled" : "Disabled"}</span>
                    </div>
                  </TableCell>
                  <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{u.lastLogin}</span></TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      {u.name !== CURRENT_USER.name && u.status === "Active" && <button onClick={() => handleSwitchUser(u)} title={"Switch to " + u.name} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><LogOut size={14} color={COLORS.info} /></button>}
                      <button onClick={() => setShowEditUser(u)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Edit size={14} color={COLORS.textMuted} /></button>
                      {u.name !== CURRENT_USER.name && <button onClick={() => setShowDeleteConfirm(u)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash2 size={14} color={COLORS.textMuted} /></button>}
                    </div>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RBAC Role Matrix with expanded info */}
      <Card title="RBAC Role Matrix">
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <TableHeader>Permission</TableHeader>
              {ROLES.map(r => <TableHeader key={r} style={{ textAlign: "center" }}>{r}</TableHeader>)}
            </tr></thead>
            <tbody>
              {[
                ["Manage Users", [true, false, false, false, false]],
                ["Manage Controls", [true, true, true, false, false]],
                ["Upload Evidence", [true, true, true, true, false]],
                ["Approve Policies", [true, true, false, false, false]],
                ["Change Gap Status", [true, true, false, true, false]],
                ["Manage Remediation", [true, true, true, false, false]],
                ["Accept Risk", [true, true, false, false, false]],
                ["View Dashboard", [true, true, true, true, true]],
                ["Export Reports", [true, true, true, true, true]],
                ["Run Gap Analysis", [true, true, true, true, false]],
                ["Configure AI Engine", [true, false, false, false, false]],
                ["Audit Log Access", [true, true, false, true, false]],
                ["User Admin Access", [true, false, false, false, false]],
                ["Settings Access", [true, true, false, false, false]],
              ].map(([perm, access]) => (
                <tr key={perm}>
                  <TableCell><span style={{ fontWeight: 500, fontSize: 13 }}>{perm}</span></TableCell>
                  {access.map((a, i) => (
                    <TableCell key={i} style={{ textAlign: "center" }}>
                      {a ? <Check size={16} color={COLORS.success} /> : <X size={16} color={COLORS.borderLight} />}
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Screen Access by Role */}
      <Card title="Screen Access by Role">
        <div style={{ padding: "12px 20px" }}>
          {ROLES.map(role => {
            const ra = ROLE_ACCESS[role];
            return (
              <div key={role} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid " + COLORS.borderLight }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: ra.color }}>{role}</span>
                  {role === CURRENT_USER.role && <span style={{ fontSize: 9, background: COLORS.primaryLight, color: COLORS.primary, padding: "1px 6px", borderRadius: 4 }}>CURRENT</span>}
                </div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}><strong>Login:</strong> {ra.login}</div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}><strong>Screens:</strong> {ra.screens.join(", ")}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {ra.actions.map(a => <span key={a} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: COLORS.surfaceAlt, color: COLORS.textSecondary, border: "1px solid " + COLORS.borderLight }}>{a}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Invite User Modal */}
      <Modal open={showInvite} onClose={() => { setShowInvite(false); setInviteSent(false); setInviteForm({ name: "", email: "", role: "", mfa: true }); }} title={inviteSent ? "Invitation Sent" : "Invite New User"} width={520}>
        {inviteSent ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS.successLight, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={24} color={COLORS.success} /></div>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>Invitation Sent Successfully</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: "center", lineHeight: 1.6, maxWidth: 360 }}>
              An invitation has been sent to <strong>{inviteForm.email}</strong> for <strong>{inviteForm.name}</strong> with the role <strong>{inviteForm.role}</strong>.
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "14px 20px", width: "100%", marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>What happens next</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: COLORS.textSecondary }}>
                <div>1. User receives email invitation with SSO enrollment link</div>
                <div>2. User registers via corporate Identity Provider (IdP)</div>
                <div>{inviteForm.mfa ? "3. User enrolls MFA device (required for this role)" : "3. MFA enrollment optional for this role"}</div>
                <div>4. Admin activates account after identity verification</div>
                <div>5. User gains access to: {(ROLE_ACCESS[inviteForm.role]?.screens || []).join(", ")}</div>
              </div>
            </div>
            <Button onClick={() => { setShowInvite(false); setInviteSent(false); setInviteForm({ name: "", email: "", role: "", mfa: true }); }} style={{ marginTop: 8 }}>Done</Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Full Name" required><FormInput value={inviteForm.name} onChange={v => setInviteForm(p => ({ ...p, name: v }))} placeholder="e.g. Jan de Vries" /></FormField>
              <FormField label="Email Address" required><FormInput value={inviteForm.email} onChange={v => setInviteForm(p => ({ ...p, email: v }))} placeholder="e.g. j.devries@brightlyn.nl" /></FormField>
            </div>
            <FormField label="Role" required><FormSelect value={inviteForm.role} onChange={v => setInviteForm(p => ({ ...p, role: v }))} options={ROLES} placeholder="Select role..." /></FormField>
            
            {inviteForm.role && (
              <div style={{ background: (ROLE_ACCESS[inviteForm.role]?.color || COLORS.primary) + "10", borderRadius: 10, padding: "12px 16px", border: "1px solid " + (ROLE_ACCESS[inviteForm.role]?.color || COLORS.primary) + "25" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: ROLE_ACCESS[inviteForm.role]?.color || COLORS.primary, marginBottom: 4 }}>{inviteForm.role} - Access Summary</div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}><strong>Screens:</strong> {(ROLE_ACCESS[inviteForm.role]?.screens || []).join(", ")}</div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}><strong>Login method:</strong> {ROLE_ACCESS[inviteForm.role]?.login || "SSO"}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {(ROLE_ACCESS[inviteForm.role]?.actions || []).slice(0, 5).map(a => <span key={a} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: COLORS.surfaceAlt, color: COLORS.textSecondary }}>{a}</span>)}
                  {(ROLE_ACCESS[inviteForm.role]?.actions || []).length > 5 && <span style={{ fontSize: 9, color: COLORS.textMuted }}>+{(ROLE_ACCESS[inviteForm.role]?.actions || []).length - 5} more</span>}
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={inviteForm.mfa} onChange={e => setInviteForm(p => ({ ...p, mfa: e.target.checked }))} style={{ accentColor: COLORS.primary }} />
              <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Require MFA enrollment</span>
              <span style={{ fontSize: 10, color: COLORS.textMuted }}>(recommended for all roles)</span>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8, borderTop: "1px solid " + COLORS.borderLight, paddingTop: 12 }}>
              <Button variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button icon={Plus} onClick={handleInvite} style={{ background: inviteForm.name && inviteForm.email && inviteForm.role ? COLORS.primary : COLORS.border, cursor: inviteForm.name && inviteForm.email && inviteForm.role ? "pointer" : "not-allowed" }}>Send Invitation</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal open={!!showEditUser} onClose={() => setShowEditUser(null)} title={showEditUser ? "Edit User - " + showEditUser.name : ""} width={440}>
        {showEditUser && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.primary + "12", color: COLORS.primary, fontWeight: 600, fontSize: 16 }}>{showEditUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{showEditUser.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{showEditUser.email}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Role</div><div style={{ fontSize: 12, marginTop: 2 }}><Badge>{showEditUser.role}</Badge></div></div>
              <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Status</div><div style={{ fontSize: 12, marginTop: 2 }}><StatusBadge status={showEditUser.status} /></div></div>
              <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>MFA</div><div style={{ fontSize: 12, marginTop: 2, color: showEditUser.mfa ? COLORS.success : COLORS.danger }}>{showEditUser.mfa ? "Enabled" : "Disabled"}</div></div>
              <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Last Login</div><div style={{ fontSize: 12, marginTop: 2, color: COLORS.textSecondary }}>{showEditUser.lastLogin}</div></div>
            </div>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Access for {showEditUser.role}</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{(ROLE_ACCESS[showEditUser.role]?.screens || []).join(", ")}</div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between", borderTop: "1px solid " + COLORS.borderLight, paddingTop: 12 }}>
              <Button variant="secondary" onClick={() => handleToggleStatus(showEditUser)} style={{ color: showEditUser.status === "Active" ? COLORS.danger : COLORS.success }}>
                {showEditUser.status === "Active" ? "Deactivate User" : "Activate User"}
              </Button>
              <div style={{ display: "flex", gap: 8 }}>
                {showEditUser.name !== CURRENT_USER.name && showEditUser.status === "Active" && (
                  <Button variant="secondary" icon={LogOut} onClick={() => { handleSwitchUser(showEditUser); setShowEditUser(null); }}>Switch to User</Button>
                )}
                <Button onClick={() => setShowEditUser(null)}>Done</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirm User Removal" width={400}>
        {showDeleteConfirm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
              Are you sure you want to remove <strong>{showDeleteConfirm.name}</strong> ({showDeleteConfirm.role})? This action will revoke all access and cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
              <Button style={{ background: COLORS.danger }} onClick={() => handleDeleteUser(showDeleteConfirm)}>Remove User</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Detail Modal */}
      <Modal open={!!showRoleDetail} onClose={() => setShowRoleDetail(null)} title={showRoleDetail ? showRoleDetail + " - Role Details" : ""} width={520}>
        {showRoleDetail && (() => {
          const ra = ROLE_ACCESS[showRoleDetail];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}><strong>Authentication:</strong> {ra.login}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Accessible Screens</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ra.screens.map(s => <span key={s} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 500 }}>{s}</span>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Permitted Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ra.actions.map(a => <div key={a} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textSecondary }}><Check size={12} color={COLORS.success} />{a}</div>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Users with this role</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {users.filter(u => u.role === showRoleDetail).map(u => <span key={u.id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: COLORS.surfaceAlt, color: COLORS.textSecondary }}>{u.name} ({u.status})</span>)}
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowRoleDetail(null)}>Close</Button>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ─── Page: Gap Analysis ───
const GapAnalysis = () => {
  const [gapStates, setGapStates] = useState(() => {
    const initial = {};
    CONTROLS_DATA.filter(c => c.status === "Critical Gap" || c.status === "Partial").forEach(c => {
      initial[c.id] = { remediationStatus: "Open", gapStatus: c.status, assignedOwner: c.owner, priority: c.status === "Critical Gap" ? "P1" : "P2", notes: "", aiRec: null, statusHistory: [{ status: c.status, date: c.lastReview || "2025-12-01", by: "System", reason: "Initial assessment" }] };
    });
    return initial;
  });
  const [selectedGap, setSelectedGap] = useState(null);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiComplete, setAiComplete] = useState(false);
  const [gapActionType, setGapActionType] = useState(null);
  const [gapActionComments, setGapActionComments] = useState("");
  const [showExportGap, setShowExportGap] = useState(false);
  const [exportGapCopied, setExportGapCopied] = useState(false);
  const [gapFilter, setGapFilter] = useState("all");
  const [newGapStatus, setNewGapStatus] = useState("");

  const canChangeStatus = CURRENT_USER.role === "Super Admin" || CURRENT_USER.role === "Compliance Officer" || CURRENT_USER.role === "Internal Auditor";
  const canRemediate = CURRENT_USER.role === "Super Admin" || CURRENT_USER.role === "Compliance Officer" || CURRENT_USER.role === "Security Manager";
  const canAcceptRisk = CURRENT_USER.role === "Super Admin" || CURRENT_USER.role === "Compliance Officer";
  const canAssign = canAcceptRisk;

  const GAP_STATUSES_ALL = ["Critical Gap", "Partial", "Compliant"];
  const GAP_STATUS_COLORS = { "Critical Gap": COLORS.danger, "Partial": COLORS.warning, "Compliant": COLORS.success };
  const REM_STATUSES = ["Open", "In Progress", "Under Review", "Remediated", "Accepted"];
  const REM_COLORS = { "Open": COLORS.danger, "In Progress": COLORS.warning, "Under Review": COLORS.info, "Remediated": COLORS.success, "Accepted": COLORS.textMuted };

  const AI_RECS = {
    "ICF-RSK-002": { summary: "Deploy centralized ICT risk register with automated risk scoring", steps: ["Procure and configure a GRC platform module for ICT risk register management", "Import existing risk data from spreadsheets into the centralized register", "Define risk scoring criteria aligned with DORA Art. 6(5)", "Map each risk entry to affected assets and regulatory clauses", "Establish quarterly risk review board with documented minutes", "Configure automated alerts for overdue risk treatments", "Integrate with vulnerability scanners and threat intel feeds"], effort: "80h", deadline: "2026-04-15", evidence: "Risk register platform, quarterly review minutes, alert configs" },
    "ICF-CLD-001": { summary: "Implement cloud security posture management across all CSP environments", steps: ["Deploy CSPM tooling across AWS, Azure, and GCP with unified dashboard", "Establish cloud security baselines aligned with CIS Benchmarks and CSA CCM", "Implement continuous compliance monitoring with drift detection", "Configure cloud workload protection for containers and VMs", "Establish cloud access governance with PAM for cloud admin roles", "Document shared responsibility matrices per CSP and workload type", "Conduct cloud-specific penetration testing quarterly"], effort: "120h", deadline: "2026-05-01", evidence: "CSPM reports, baseline docs, shared responsibility matrices, pentest reports" },
    "ICF-TPR-001": { summary: "Establish formal third-party risk assessment program with continuous monitoring", steps: ["Define third-party risk tiering criteria per DORA Art. 28", "Develop standardized assessment questionnaires for each risk tier", "Conduct initial risk assessments for all critical ICT providers", "Implement continuous monitoring of third-party security posture", "Establish contractual security requirements per DORA Art. 30", "Create a third-party risk register with reassessment triggers", "Develop exit strategies for critical third-party providers"], effort: "100h", deadline: "2026-04-01", evidence: "Third-party risk register, assessment reports, exit strategies" },
    "ICF-RSK-001": { summary: "Enhance integrated risk methodology with quantitative analysis capabilities", steps: ["Extend current qualitative methodology with FAIR model", "Integrate threat intelligence feeds into risk identification", "Add cascading and systemic risk scenario modeling per DORA Art. 6", "Develop risk aggregation views across business units", "Calibrate risk appetite with board-approved thresholds", "Train all risk owners on the enhanced methodology", "Automate risk register updates with GRC platform integration"], effort: "60h", deadline: "2026-06-01", evidence: "Updated methodology, FAIR outputs, board-approved risk appetite" },
    "ICF-CYB-002": { summary: "Implement vulnerability management lifecycle with SLA enforcement", steps: ["Deploy enterprise vulnerability scanning across all environments", "Define remediation SLAs: Critical 72h, High 14d, Medium 30d, Low 90d", "Integrate vulnerability data with CMDB for risk-based prioritization", "Implement automated patching for standard configurations", "Establish exception process for unpatched vulnerabilities", "Create executive dashboard for vulnerability trends and SLA compliance", "Conduct quarterly validation scans for remediation effectiveness"], effort: "50h", deadline: "2026-05-15", evidence: "Scan reports, SLA metrics, patching records, exception docs" },
    "ICF-INC-001": { summary: "Formalize incident response with tested playbooks and automated workflows", steps: ["Update incident response plan for DORA Art. 17-19 requirements", "Develop playbooks: ransomware, data breach, DDoS, insider threat, supply chain", "Integrate playbooks with SOAR platform for automated response", "Create regulatory notification templates pre-approved by legal", "Conduct tabletop exercise with cross-functional team within 30 days", "Schedule annual full-scale simulation with documented findings", "Establish post-incident review with improvement tracking"], effort: "40h", deadline: "2026-06-15", evidence: "Updated IRP, playbook library, SOAR docs, exercise reports" },
    "ICF-BCP-001": { summary: "Complete business continuity program with tested DR capabilities", steps: ["Conduct updated Business Impact Analysis across all units", "Define and validate RTO/RPO targets for critical systems", "Develop DR runbooks for each critical system and application", "Implement automated failover for Tier-1 systems", "Address DORA requirement for third-party provider failure scenarios", "Execute DR failover test and document results", "Schedule annual BCP exercise with business stakeholders"], effort: "70h", deadline: "2026-07-01", evidence: "BIA report, DR runbooks, failover test results, BCP exercise docs" },
    "ICF-MON-001": { summary: "Deploy unified security monitoring with DORA-compliant log retention", steps: ["Implement centralized SIEM covering all critical assets and cloud", "Define correlation rules for DORA-relevant threat scenarios", "Establish 24/7 monitoring via SOC or MDR provider", "Configure 7-year log retention with tamper-proof storage", "Implement automated alerting with severity-based escalation", "Create monitoring dashboards for executive and ops teams", "Conduct quarterly detection rule tuning and gap assessments"], effort: "90h", deadline: "2026-05-01", evidence: "SIEM docs, correlation rules, SOC procedures, retention config" },
  };

  const getAIRec = (id) => AI_RECS[id] || { summary: "Address gap with targeted remediation plan for " + id, steps: ["Assess current state against control requirements", "Identify specific deficiencies and missing evidence", "Develop remediation plan with milestones", "Implement controls and collect evidence", "Validate via internal audit"], effort: "40h", deadline: "2026-06-01", evidence: "Implementation docs, test results, audit evidence" };

  const gaps = CONTROLS_DATA.filter(c => c.status === "Critical Gap" || c.status === "Partial");
  const getGS = (g) => gapStates[g.id]?.gapStatus || g.status;
  const critical = gaps.filter(c => getGS(c) === "Critical Gap");
  const partial = gaps.filter(c => getGS(c) === "Partial");
  const inProgress = gaps.filter(c => gapStates[c.id]?.remediationStatus === "In Progress");
  const remediated = gaps.filter(c => gapStates[c.id]?.remediationStatus === "Remediated");

  const filteredGaps = gaps.filter(g => {
    if (gapFilter === "critical") return getGS(g) === "Critical Gap";
    if (gapFilter === "partial") return getGS(g) === "Partial";
    if (gapFilter === "in-progress") return gapStates[g.id]?.remediationStatus === "In Progress";
    if (gapFilter === "remediated") return gapStates[g.id]?.remediationStatus === "Remediated";
    return true;
  }).sort((a, b) => (getGS(a) === "Critical Gap" ? -1 : 1));

  const totalEffort = gaps.reduce((sum, g) => sum + parseInt(getAIRec(g.id).effort) || 0, 0);

  const runAIAnalysis = () => {
    setAiRunning(true);
    setAiComplete(false);
    setTimeout(() => {
      const u = {};
      Object.keys(gapStates).forEach(k => { u[k] = { ...gapStates[k], aiRec: getAIRec(k) }; });
      setGapStates(u);
      setAiRunning(false);
      setAiComplete(true);
    }, 2200);
  };

  const getActionLabel = (action) => {
    if (action === "start") return "Begin Remediation";
    if (action === "review") return "Submit for Review";
    if (action === "remediate") return "Confirm Remediation";
    if (action === "accept") return "Accept Risk";
    return "";
  };
  const getActionTitle = (action) => {
    if (action === "start") return "Start Remediation";
    if (action === "review") return "Submit for Review";
    if (action === "remediate") return "Confirm Remediation";
    if (action === "accept") return "Accept Risk";
    return "";
  };
  const getActionDesc = (action) => {
    if (action === "start") return "Assign an owner and begin working on the remediation steps. Status changes to In Progress.";
    if (action === "review") return "Submit evidence and implementation for review by the compliance team.";
    if (action === "remediate") return "Confirm all remediation steps are complete. Gap status updates to Compliant.";
    if (action === "accept") return "Document the business justification for accepting this risk.";
    return "";
  };
  const getActionPlaceholder = (action) => {
    if (action === "start") return "Starting implementation of step 1...";
    if (action === "review") return "Evidence collected: policy document, scan reports...";
    if (action === "remediate") return "All steps completed. Evidence uploaded to GRC platform...";
    if (action === "accept") return "Accepting risk due to: low residual impact...";
    return "";
  };
  const getActionFieldLabel = (action) => {
    if (action === "start") return "Implementation Notes";
    if (action === "review") return "Evidence Summary";
    if (action === "remediate") return "Closure Comments";
    if (action === "accept") return "Risk Acceptance Justification";
    return "Comments";
  };
  const getActionColor = (action) => {
    if (action === "start") return COLORS.info;
    if (action === "review") return COLORS.warning;
    if (action === "remediate") return COLORS.success;
    if (action === "accept") return COLORS.textMuted;
    return COLORS.primary;
  };
  const getActionBg = (action) => {
    if (action === "start") return COLORS.infoLight;
    if (action === "review") return COLORS.warningLight;
    if (action === "remediate") return COLORS.successLight;
    if (action === "accept") return COLORS.surfaceAlt;
    return COLORS.surfaceAlt;
  };

  const handleGapAction = (gap, action) => {
    if (!gapActionComments.trim() && action !== "start") return;
    const now = new Date().toISOString().slice(0, 10);
    setGapStates(prev => {
      const current = prev[gap.id] || {};
      const upd = { ...current, notes: gapActionComments || current.notes };
      if (action === "start") upd.remediationStatus = "In Progress";
      else if (action === "review") upd.remediationStatus = "Under Review";
      else if (action === "remediate") upd.remediationStatus = "Remediated";
      else if (action === "accept") upd.remediationStatus = "Accepted";
      else if (action === "changeStatus" && newGapStatus) {
        upd.gapStatus = newGapStatus;
        upd.statusHistory = [...(current.statusHistory || []), { status: newGapStatus, date: now, by: CURRENT_USER.name, reason: gapActionComments }];
        if (newGapStatus === "Compliant") upd.remediationStatus = "Remediated";
      }
      return { ...prev, [gap.id]: upd };
    });
    setGapActionType(null);
    setGapActionComments("");
    setNewGapStatus("");
    setTimeout(() => setSelectedGap({ ...gap }), 50);
  };

  const impactData = DOMAINS.filter(d => d.gap > 0 || d.partial > 0).map(d => ({ name: d.name.length > 20 ? d.name.slice(0, 18) + "..." : d.name, gaps: d.gap, partial: d.partial }));

  const handleCopyGapExport = () => {
    const hdr = "Priority\tID\tControl\tDomain\tGap Status\tRemediation\tOwner\tFrameworks\tEffort\tDeadline\tAI Recommendation";
    const rows = filteredGaps.map((g, i) => { const r = getAIRec(g.id); return "P" + (i+1) + "\t" + g.id + "\t" + g.title + "\t" + g.domain + "\t" + (gapStates[g.id]?.gapStatus || g.status) + "\t" + (gapStates[g.id]?.remediationStatus || "Open") + "\t" + (gapStates[g.id]?.assignedOwner || g.owner) + "\t" + g.frameworks.join("; ") + "\t" + r.effort + "\t" + r.deadline + "\t" + r.summary; });
    const text = hdr + "\n" + rows.join("\n");
    navigator.clipboard.writeText(text).then(() => { setExportGapCopied(true); setTimeout(() => setExportGapCopied(false), 2000); });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Gap Analysis & Remediation</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>AI-driven gap identification with prioritized remediation</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" icon={Download} size="sm" onClick={() => setShowExportGap(true)}>Export Report</Button>
          <Button icon={Zap} size="sm" onClick={runAIAnalysis} disabled={aiRunning}>{aiRunning ? "Analyzing..." : aiComplete ? "Analysis Complete" : "Run AI Analysis"}</Button>
        </div>
      </div>

      {aiComplete && (
        <div style={{ background: COLORS.successLight, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={15} color={COLORS.success} />
          <span style={{ fontSize: 12, color: COLORS.success }}>AI analysis complete. {gaps.length} gaps analyzed with specific remediation plans. Total effort: <strong>{totalEffort}h</strong>. Click any gap for details.</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon={XCircle} label="CRITICAL GAPS" value={critical.length} sub="Require immediate action" color={COLORS.danger} />
        <StatCard icon={AlertCircle} label="PARTIAL GAPS" value={partial.length} sub="Enhancement needed" color={COLORS.warning} />
        <StatCard icon={Activity} label="IN PROGRESS" value={inProgress.length} sub="Remediation underway" color={COLORS.info} />
        <StatCard icon={TrendingUp} label="EST. EFFORT" value={totalEffort + "h"} sub="Total remediation hours" color={COLORS.accent} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Gap Distribution by Domain">
          <div style={{ padding: "12px 16px 16px" }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={impactData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: COLORS.textSecondary }} width={110} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid " + COLORS.border, fontSize: 12 }} />
                <Bar dataKey="gaps" fill={COLORS.danger} name="Critical Gaps" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="partial" fill={COLORS.warning} name="Partial" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Remediation Priority Queue">
          <div style={{ padding: "4px 0" }}>
            {filteredGaps.slice(0, 6).map((g, i) => {
              const remSt = gapStates[g.id]?.remediationStatus || "Open";
              return (
                <div key={g.id} onClick={() => setSelectedGap(g)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: i < 5 ? "1px solid " + COLORS.borderLight : "none", cursor: "pointer", transition: "all 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: getGS(g) === "Critical Gap" ? COLORS.dangerLight : COLORS.warningLight, color: getGS(g) === "Critical Gap" ? COLORS.danger : COLORS.warning, fontSize: 12, fontWeight: 700 }}>{"P" + (i + 1)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{g.id} - {g.domain}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: REM_COLORS[remSt] || COLORS.danger, background: (REM_COLORS[remSt] || COLORS.danger) + "15", padding: "2px 8px", borderRadius: 5 }}>{remSt}</span>
                  <ChevronRight size={14} color={COLORS.textMuted} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Detailed Gap Register">
        <div style={{ display: "flex", gap: 8, marginBottom: 12, padding: "0 16px" }}>
          {[["all", "All", gaps.length], ["critical", "Critical", critical.length], ["partial", "Partial", partial.length], ["in-progress", "In Progress", inProgress.length], ["remediated", "Remediated", remediated.length]].map((item) => {
            var id = item[0], label = item[1], count = item[2];
            return (
              <button key={id} onClick={() => { setGapFilter(id); }} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid " + (gapFilter === id ? COLORS.primary : COLORS.border), background: gapFilter === id ? COLORS.primaryLight : "transparent", color: gapFilter === id ? COLORS.primary : COLORS.textMuted, fontSize: 11, fontWeight: gapFilter === id ? 600 : 400, cursor: "pointer" }}>{label + " (" + count + ")"}</button>
            );
          })}
        </div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <TableHeader>Priority</TableHeader><TableHeader>Control</TableHeader><TableHeader>Domain</TableHeader><TableHeader>Gap Status</TableHeader><TableHeader>Remediation</TableHeader><TableHeader>Frameworks</TableHeader><TableHeader>Owner</TableHeader><TableHeader>AI Recommendation</TableHeader><TableHeader></TableHeader>
            </tr></thead>
            <tbody>
              {filteredGaps.map((g, i) => {
                var rec = getAIRec(g.id);
                var remSt = gapStates[g.id]?.remediationStatus || "Open";
                var gSt = getGS(g);
                return (
                  <tr key={g.id} onClick={() => { setSelectedGap(g); }} style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceAlt; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <TableCell><div style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: gSt === "Critical Gap" ? COLORS.dangerLight : COLORS.warningLight, color: gSt === "Critical Gap" ? COLORS.danger : COLORS.warning, fontSize: 11, fontWeight: 700 }}>{"P" + (i + 1)}</div></TableCell>
                    <TableCell><div style={{ fontWeight: 500, fontSize: 13 }}>{g.title}</div><div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.textMuted }}>{g.id}</div></TableCell>
                    <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{g.domain}</span></TableCell>
                    <TableCell><StatusBadge status={gSt} /></TableCell>
                    <TableCell><span style={{ fontSize: 10, fontWeight: 600, color: REM_COLORS[remSt], background: REM_COLORS[remSt] + "15", padding: "2px 8px", borderRadius: 5 }}>{remSt}</span></TableCell>
                    <TableCell><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{g.frameworks.map((f) => { return <Badge key={f} variant="primary" size="xs">{f}</Badge>; })}</div></TableCell>
                    <TableCell><span style={{ fontSize: 12, color: COLORS.textSecondary }}>{gapStates[g.id]?.assignedOwner || g.owner}</span></TableCell>
                    <TableCell><span style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{rec.summary}</span></TableCell>
                    <TableCell><ChevronRight size={14} color={COLORS.textMuted} /></TableCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gap Detail Modal */}
      <Modal open={!!selectedGap} onClose={() => { setSelectedGap(null); setGapActionType(null); setGapActionComments(""); setNewGapStatus(""); }} title={selectedGap ? selectedGap.id + " - " + selectedGap.title : ""} width={800}>
        {selectedGap && (() => {
          var gs = gapStates[selectedGap.id] || {};
          var rec = gs.aiRec || getAIRec(selectedGap.id);
          var remStatus = gs.remediationStatus || "Open";
          var curGapStatus = gs.gapStatus || selectedGap.status;
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {REM_STATUSES.map((stage, idx) => {
                  var currentIdx = REM_STATUSES.indexOf(remStatus);
                  var active = idx <= currentIdx;
                  var isCurrent = stage === remStatus;
                  return (
                    <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: active ? (isCurrent ? REM_COLORS[remStatus] : COLORS.success) : COLORS.surfaceAlt, color: active ? "#fff" : COLORS.textMuted }}>{active && !isCurrent ? <Check size={10} /> : idx + 1}</div>
                        <span style={{ fontSize: 9, color: isCurrent ? REM_COLORS[remStatus] : COLORS.textMuted }}>{stage}</span>
                      </div>
                      {idx < 4 && <div style={{ flex: 1, height: 1.5, background: active && idx < currentIdx ? COLORS.success : COLORS.borderLight, margin: "0 4px -12px 4px" }} />}
                    </div>
                  );
                })}
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Gap Status</div><div style={{ marginTop: 2 }}><span style={{ fontWeight: 600, color: GAP_STATUS_COLORS[curGapStatus], background: GAP_STATUS_COLORS[curGapStatus] + "15", padding: "2px 10px", borderRadius: 5, fontSize: 11 }}>{curGapStatus}</span></div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Remediation</div><div style={{ fontSize: 12, color: REM_COLORS[remStatus], fontWeight: 600, marginTop: 2 }}>{remStatus}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Priority</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{gs.priority || "P2"}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Est. Effort</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{rec.effort}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Owner</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{gs.assignedOwner || selectedGap.owner}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Deadline</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{rec.deadline}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Evidence Items</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{selectedGap.evidence + " of 4"}</div></div>
                <div><div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>Review Cycle</div><div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{selectedGap.reviewCycle}</div></div>
              </div>

              {/* Permissions */}
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 8, padding: "8px 14px", fontSize: 11, color: COLORS.textSecondary }}>
                <strong>{"Your permissions (" + CURRENT_USER.role + "):"}</strong>{" "}
                {(canChangeStatus ? "Yes" : "No") + " Change Status | " + (canRemediate ? "Yes" : "No") + " Remediate | " + (canAcceptRisk ? "Yes" : "No") + " Accept Risk | " + (canAssign ? "Yes" : "No") + " Assign Owner"}
              </div>

              {/* Status history */}
              {(gs.statusHistory || []).length > 1 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Status History</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(gs.statusHistory || []).map((h, hIdx) => {
                      return <div key={hIdx} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, background: COLORS.surfaceAlt, border: "1px solid " + COLORS.borderLight, color: COLORS.textSecondary }}><span style={{ fontWeight: 600, color: GAP_STATUS_COLORS[h.status] || COLORS.text }}>{h.status}</span>{" - " + h.date + " - " + h.by}</div>;
                    })}
                  </div>
                </div>
              )}

              {/* Gap description */}
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Gap Description</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{selectedGap.description}</div>
              </div>

              {/* Frameworks and clauses */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Affected Frameworks</div><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{selectedGap.frameworks.map((f) => { return <Badge key={f} variant="primary" size="xs">{f}</Badge>; })}</div></div>
                <div><div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Regulatory Clauses</div><div style={{ fontSize: 11, color: COLORS.textSecondary, fontFamily: "monospace", lineHeight: 1.5 }}>{selectedGap.clauses}</div></div>
              </div>

              {/* AI Recommendation */}
              <div style={{ background: COLORS.primaryLight, borderRadius: 10, padding: "14px 16px", border: "1px solid " + COLORS.primary + "25" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Zap size={13} color={COLORS.primary} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 0.3 }}>AI Remediation Plan</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{rec.summary}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {rec.steps.map((step, sIdx) => {
                    return <div key={sIdx} style={{ display: "flex", gap: 8, fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}><span style={{ color: COLORS.primary, fontWeight: 600, flexShrink: 0 }}>{sIdx + 1 + "."}</span>{step}</div>;
                  })}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 8, paddingTop: 8, borderTop: "1px solid " + COLORS.primary + "15", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}><strong>Effort:</strong> {rec.effort}</span>
                  <span style={{ color: COLORS.textMuted }}><strong>Deadline:</strong> {rec.deadline}</span>
                  <span style={{ color: COLORS.textMuted }}><strong>Evidence:</strong> {rec.evidence}</span>
                </div>
              </div>

              {/* Implementation guidance */}
              <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Implementation Guidance</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>{selectedGap.implementation}</div>
              </div>

              {/* Actions */}
              {!gapActionType && (
                <div style={{ borderTop: "1px solid " + COLORS.borderLight, paddingTop: 12 }}>
                  {remStatus === "Open" && canRemediate && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Begin remediation for this gap.</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        {canAcceptRisk && <Button variant="secondary" onClick={() => { setGapActionType("accept"); }}>Accept Risk</Button>}
                        <Button onClick={() => { setGapActionType("start"); }}>Start Remediation</Button>
                      </div>
                    </div>
                  )}
                  {remStatus === "In Progress" && canRemediate && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Remediation in progress. Submit for review when ready.</span>
                      <Button onClick={() => { setGapActionType("review"); }}>Submit for Review</Button>
                    </div>
                  )}
                  {remStatus === "Under Review" && canChangeStatus && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Under review. Update gap status or mark as remediated.</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={() => { setGapActionType("changeStatus"); }}>Update Gap Status</Button>
                        <Button style={{ background: COLORS.success }} onClick={() => { setGapActionType("remediate"); }}>Mark Remediated</Button>
                      </div>
                    </div>
                  )}
                  {canChangeStatus && remStatus !== "Under Review" && curGapStatus !== "Compliant" && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                      <Button variant="secondary" size="sm" onClick={() => { setGapActionType("changeStatus"); }}>Update Gap Status</Button>
                    </div>
                  )}
                  {(remStatus === "Remediated" || remStatus === "Accepted") && (
                    <div style={{ background: remStatus === "Remediated" ? COLORS.successLight : COLORS.surfaceAlt, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: remStatus === "Remediated" ? COLORS.success : COLORS.textSecondary }}>
                      {"This gap has been " + remStatus.toLowerCase() + ". "}{gs.notes && <span style={{ display: "block", marginTop: 4, fontStyle: "italic" }}>{gs.notes}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Remediation action form */}
              {gapActionType && gapActionType !== "changeStatus" && (
                <div style={{ background: getActionBg(gapActionType), borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: getActionColor(gapActionType), marginBottom: 8 }}>{getActionTitle(gapActionType)}</div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 8 }}>{getActionDesc(gapActionType)}</div>
                  {gapActionType === "start" && canAssign && (
                    <FormField label="Assigned Owner"><FormSelect value={gs.assignedOwner || selectedGap.owner} onChange={(v) => { setGapStates((prev) => { return { ...prev, [selectedGap.id]: { ...prev[selectedGap.id], assignedOwner: v } }; }); }} options={["CISO", "CRO", "DPO", "Security Manager", "IR Lead", "BCM Lead", "IAM Lead", "Cloud Architect", "Vendor Mgmt Lead"]} /></FormField>
                  )}
                  <FormField label={getActionFieldLabel(gapActionType)} required>
                    <FormTextarea value={gapActionComments} onChange={setGapActionComments} placeholder={getActionPlaceholder(gapActionType)} rows={3} />
                  </FormField>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <Button variant="ghost" onClick={() => { setGapActionType(null); setGapActionComments(""); }}>Cancel</Button>
                    <Button icon={Check} onClick={() => { handleGapAction(selectedGap, gapActionType); }} style={{ background: gapActionComments.trim() ? getActionColor(gapActionType) : COLORS.border, cursor: gapActionComments.trim() ? "pointer" : "not-allowed" }}>{getActionLabel(gapActionType)}</Button>
                  </div>
                </div>
              )}

              {/* Gap status change form */}
              {gapActionType === "changeStatus" && (
                <div style={{ background: COLORS.primaryLight, borderRadius: 10, padding: "14px 16px", border: "1px solid " + COLORS.primary + "25" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 6 }}>Update Gap Status</div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 10, lineHeight: 1.5 }}>
                    Change the gap status based on assessment findings. Restricted to Super Admin, Compliance Officer, and Internal Auditor. All changes are tracked.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <FormField label="Current Status">
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: COLORS.surfaceAlt, fontSize: 12, fontWeight: 600, color: GAP_STATUS_COLORS[curGapStatus] }}>{curGapStatus}</div>
                    </FormField>
                    <FormField label="New Status">
                      <FormSelect value={newGapStatus} onChange={setNewGapStatus} options={GAP_STATUSES_ALL.filter((s) => { return s !== curGapStatus; })} placeholder="Select new status..." />
                    </FormField>
                  </div>
                  {newGapStatus === "Compliant" && <div style={{ background: COLORS.successLight, borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: COLORS.success }}>Changing to Compliant indicates all controls are implemented. Remediation status auto-updates to Remediated.</div>}
                  {newGapStatus === "Critical Gap" && <div style={{ background: COLORS.dangerLight, borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: COLORS.danger }}>Escalating to Critical Gap indicates significant deficiencies requiring immediate action.</div>}
                  <FormField label="Justification for Status Change" required hint="Documented reason will be recorded in status history">
                    <FormTextarea value={gapActionComments} onChange={setGapActionComments} placeholder="Based on reassessment findings: evidence reviewed, controls validated..." rows={3} />
                  </FormField>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <Button variant="ghost" onClick={() => { setGapActionType(null); setGapActionComments(""); setNewGapStatus(""); }}>Cancel</Button>
                    <Button icon={Check} onClick={() => { handleGapAction(selectedGap, "changeStatus"); }} style={{ background: gapActionComments.trim() && newGapStatus ? COLORS.primary : COLORS.border, cursor: gapActionComments.trim() && newGapStatus ? "pointer" : "not-allowed" }}>Update Gap Status</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Export Modal */}
      <Modal open={showExportGap} onClose={() => { setShowExportGap(false); }} title="Export Gap Analysis Report" width={780}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Tab-separated gap register data. Click <strong>Copy to Clipboard</strong> and paste into Excel.</div>
          <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 16px", maxHeight: 300, overflow: "auto", fontFamily: "monospace", fontSize: 10, lineHeight: 1.6, whiteSpace: "pre", color: COLORS.textSecondary, border: "1px solid " + COLORS.borderLight }}>
            {"Priority\tID\tControl\tDomain\tGap Status\tRemediation\tOwner\tFrameworks\tEffort\tAI Recommendation\n" + filteredGaps.map((g, i) => { var r = getAIRec(g.id); return "P" + (i+1) + "\t" + g.id + "\t" + g.title + "\t" + g.domain + "\t" + getGS(g) + "\t" + (gapStates[g.id]?.remediationStatus || "Open") + "\t" + (gapStates[g.id]?.assignedOwner || g.owner) + "\t" + g.frameworks.join("; ") + "\t" + r.effort + "\t" + r.summary; }).join("\n")}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>{filteredGaps.length + " gaps"}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => { setShowExportGap(false); }}>Close</Button>
              <Button icon={exportGapCopied ? Check : Copy} onClick={handleCopyGapExport} style={{ background: exportGapCopied ? COLORS.success : COLORS.primary }}>{exportGapCopied ? "Copied!" : "Copy to Clipboard"}</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── Page: Reports ───
const Reports = () => {
  const frameworkRadar = FRAMEWORK_COMPLIANCE.map(f => ({ framework: f.framework.length > 10 ? f.framework.slice(0, 8) + "…" : f.framework, compliance: f.compliance }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Compliance Reports</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Generate and export audit-ready compliance reports</p>
        </div>
        <Button icon={Download}>Generate Full Report</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Framework Coverage Comparison">
          <div style={{ padding: "12px 16px 16px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FRAMEWORK_COMPLIANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} />
                <XAxis dataKey="framework" tick={{ fontSize: 10, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                <Bar dataKey="compliance" radius={[6, 6, 0, 0]} barSize={32}>
                  {FRAMEWORK_COMPLIANCE.map((entry, i) => (
                    <Cell key={i} fill={entry.compliance >= 85 ? COLORS.success : entry.compliance >= 70 ? COLORS.warning : COLORS.danger} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Compliance Maturity by Domain">
          <div style={{ padding: "4px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={COLORS.borderLight} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 9, fill: COLORS.textMuted }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: COLORS.textMuted }} domain={[0, 100]} />
                <Radar name="Maturity" dataKey="score" stroke={COLORS.info} fill={COLORS.info} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Available Reports">
        <div style={{ padding: "4px 0" }}>
          {[
            { name: "Enterprise Compliance Summary", desc: "Full overview across all frameworks and domains", date: "Auto-generated", type: "PDF" },
            { name: "NIS2 Readiness Assessment", desc: "Detailed gap analysis for NIS2 Directive compliance", date: "2026-02-15", type: "PDF" },
            { name: "DORA ICT Risk Report", desc: "Digital operational resilience readiness evaluation", date: "2026-02-10", type: "PDF" },
            { name: "ISO 27001 Statement of Applicability", desc: "SoA with mapped controls and evidence status", date: "2026-02-01", type: "XLSX" },
            { name: "Evidence Completeness Report", desc: "Artifact quality scores and expiration tracking", date: "2026-01-28", type: "PDF" },
            { name: "Audit Preparation Pack", desc: "Pre-audit documentation bundle with all evidence", date: "2026-01-20", type: "ZIP" },
            { name: "Cross-Framework Mapping Matrix", desc: "Complete control-to-clause mapping across all standards", date: "2026-01-15", type: "XLSX" },
            { name: "Board Executive Summary", desc: "High-level compliance posture for board reporting", date: "2026-02-18", type: "PPTX" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px",
              borderBottom: i < 7 ? `1px solid ${COLORS.borderLight}` : "none",
              cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={16} color={COLORS.primary} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{r.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Badge>{r.type}</Badge>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>{r.date}</span>
                <Button variant="ghost" size="sm" icon={Download} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Page: Scope Management ───
const ScopeManagement = () => {
  const [expanded, setExpanded] = useState(new Set(["tenant"]));
  const toggle = id => setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const scopeTree = {
    id: "tenant", name: "AcmeCorp B.V.", type: "Tenant", frameworks: ["NIS2", "DORA", "ISO 27001", "GDPR", "ABRO 2026"],
    children: [
      {
        id: "bu-fin", name: "Financial Services", type: "Business Unit", frameworks: ["DORA", "PCI DSS", "ISO 27001"],
        children: [
          { id: "prj-pay", name: "Payments Platform", type: "Project", frameworks: ["PCI DSS", "DORA"] },
          { id: "prj-trading", name: "Trading System", type: "Project", frameworks: ["DORA", "ISO 27001"] },
        ]
      },
      {
        id: "bu-tech", name: "Technology & Cloud", type: "Business Unit", frameworks: ["ISO 27001", "NIS2", "ABRO 2026"],
        children: [
          { id: "prj-saas", name: "SaaS Platform", type: "Project", frameworks: ["ISO 27001", "NIS2"] },
          { id: "prj-infra", name: "Infrastructure Ops", type: "Project", frameworks: ["NIS2", "ABRO 2026"] },
        ]
      },
      {
        id: "bu-gov", name: "Government Contracts", type: "Business Unit", frameworks: ["ABRO 2026", "ISO 27001", "NIS2"],
        children: [
          { id: "prj-gov1", name: "Rijksoverheid Project Alpha", type: "Project", frameworks: ["ABRO 2026"] },
        ]
      },
    ]
  };

  const ScopeNode = ({ node, level = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const typeColor = node.type === "Tenant" ? COLORS.accent : node.type === "Business Unit" ? COLORS.primary : COLORS.success;

    return (
      <div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", paddingLeft: 20 + level * 28,
          borderBottom: `1px solid ${COLORS.borderLight}`, cursor: hasChildren ? "pointer" : "default",
        }}
          onClick={() => hasChildren && toggle(node.id)}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          {hasChildren ? (isExpanded ? <ChevronDown size={14} color={COLORS.textMuted} /> : <ChevronRight size={14} color={COLORS.textMuted} />) : <div style={{ width: 14 }} />}
          <div style={{ width: 8, height: 8, borderRadius: 3, background: typeColor, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{node.name}</span>
            <Badge variant={node.type === "Tenant" ? "accent" : node.type === "Business Unit" ? "primary" : "success"} size="xs" style={{ marginLeft: 8 }}>{node.type}</Badge>
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {node.frameworks.map(f => <Badge key={f} size="xs">{f}</Badge>)}
          </div>
        </div>
        {isExpanded && hasChildren && node.children.map(c => <ScopeNode key={c.id} node={c} level={level + 1} />)}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Scope & Tenant Management</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Federated compliance architecture with hierarchical scoping</p>
        </div>
        <Button icon={Plus}>Add Scope</Button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon={Globe} label="TENANTS" value={1} color={COLORS.accent} />
        <StatCard icon={Briefcase} label="BUSINESS UNITS" value={3} color={COLORS.primary} />
        <StatCard icon={Layers} label="PROJECTS" value={5} color={COLORS.success} />
        <StatCard icon={Shield} label="INHERITANCE" value="Active" sub="Parent → child enforcement" color={COLORS.info} />
      </div>

      <Card title="Scope Hierarchy" actions={<Button variant="ghost" size="sm" icon={Filter}>Filter</Button>}>
        <ScopeNode node={scopeTree} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Scope Inheritance Rules">
          <div style={{ padding: 20 }}>
            {[
              { rule: "Parent controls apply to child scopes by default", icon: ChevronDown, status: "Enforced" },
              { rule: "Child scopes may increase rigor level", icon: ChevronUp, status: "Allowed" },
              { rule: "Child scopes cannot reduce mandated rigor", icon: Lock, status: "Enforced" },
              { rule: "Evidence reuse is scope-aware", icon: RefreshCw, status: "Enabled" },
              { rule: "Exemptions require justification & approval", icon: FileWarning, status: "Controlled" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${COLORS.borderLight}` : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <r.icon size={14} color={COLORS.primary} />
                </div>
                <span style={{ flex: 1, fontSize: 13, color: COLORS.text }}>{r.rule}</span>
                <Badge variant="success">{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Framework Applicability per Scope">
          <div style={{ padding: 20 }}>
            <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: 16, fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.8 }}>
              <div><strong>Tenant Level:</strong> NIS2, DORA, ISO 27001, GDPR, ABRO 2026 — applies to all child scopes</div>
              <div style={{ marginTop: 8 }}><strong>BU Overrides:</strong></div>
              <div style={{ paddingLeft: 12 }}>• Financial Services adds PCI DSS, DORA enforcement</div>
              <div style={{ paddingLeft: 12 }}>• Technology & Cloud focuses on cloud security controls</div>
              <div style={{ paddingLeft: 12 }}>• Government Contracts enforces ABRO 2026 as primary</div>
              <div style={{ marginTop: 8 }}><strong>Project Specificity:</strong> Each project selects applicable subset of parent BU frameworks with optional additional rigor</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Page: Settings ───
const SettingsPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Platform Settings</h1>
      <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Configure ICF platform preferences and integrations</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Security Configuration">
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["Encryption at Rest", "AES-256", true],
            ["Encryption in Transit", "TLS 1.3", true],
            ["Key Management", "AWS KMS", true],
            ["MFA Enforcement", "All roles", true],
            ["SSO Provider", "Auth0 (SAML 2.0 + OIDC)", true],
            ["Session Timeout", "30 minutes", true],
            ["Audit Log Retention", "7 years", true],
          ].map(([label, value, active]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{value}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? COLORS.success : COLORS.danger }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Data Residency & Compliance">
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["Data Hosting Region", "EU (Netherlands)", true],
            ["GDPR Compliance", "Active", true],
            ["NIS2 Alignment", "Active", true],
            ["DORA Requirements", "Active", true],
            ["Infrastructure as Code", "Terraform", true],
            ["RTO", "< 4 hours", true],
            ["RPO", "< 1 hour", true],
          ].map(([label, value, active]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{value}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? COLORS.success : COLORS.danger }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Integration Status">
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Auth0 SSO", "Connected", true],
            ["REST API", "Active", true],
            ["Webhooks", "Configured", true],
            ["ServiceNow", "Planned", false],
            ["Jira", "Planned", false],
            ["Microsoft Purview", "Planned", false],
            ["SIEM Integration", "Planned", false],
          ].map(([name, status, active]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? COLORS.successLight : COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Server size={16} color={active ? COLORS.success : COLORS.textMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{name}</div>
              </div>
              <Badge variant={active ? "success" : "default"}>{status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="AI Engine Configuration">
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["AI Engine", "LangChain + GPT-4o"],
            ["Vector Database", "Pinecone"],
            ["Semantic Analysis", "Enabled"],
            ["Translation Layer", "Multi-language AI"],
            ["Quality Gate Threshold", "Qs ≥ 70"],
            ["Mapping Confidence", "≥ 85% auto-approve"],
            ["Translation Confidence", "≥ 90% auto-accept"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
              <span style={{ fontSize: 12, color: COLORS.primary, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ─── Page: AI Compliance Assistant ───
const ComplianceAI = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hello! I'm the ICF Compliance Assistant, trained on your regulatory frameworks (NIS2, DORA, ISO 27001, GDPR, ABRO 2026, PCI DSS) and internal policies. I can help with:\n\n- Regulatory questions and clause interpretation\n- RFP compliance responses\n- Policy gap analysis queries\n- Control mapping across frameworks\n- Audit preparation guidance\n\nHow can I help you today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState("general");
  const [chatHistory, setChatHistory] = useState([
    { id: "h1", title: "DORA Art. 6 ICT Risk Requirements", date: "2026-03-07", msgs: 8 },
    { id: "h2", title: "RFP: Cloud Security Compliance", date: "2026-03-06", msgs: 14 },
    { id: "h3", title: "NIS2 vs DORA incident reporting", date: "2026-03-05", msgs: 6 },
    { id: "h4", title: "ISO 27001 A.8 Access Control", date: "2026-03-04", msgs: 11 },
    { id: "h5", title: "GDPR Art. 30 ROPA requirements", date: "2026-03-03", msgs: 5 },
  ]);
  const [showSources, setShowSources] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [processingDoc, setProcessingDoc] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [answeringAll, setAnsweringAll] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const MODES = [
    { id: "general", label: "General", icon: MessageSquare, desc: "Regulatory & compliance questions" },
    { id: "rfp", label: "RFP Response", icon: FileText, desc: "Generate RFP compliance answers" },
    { id: "audit", label: "Audit Prep", icon: ShieldCheck, desc: "Audit readiness guidance" },
    { id: "policy", label: "Policy Query", icon: BookOpen, desc: "Internal policy lookup" },
  ];

  const SUGGESTED = {
    general: ["What are the key differences between NIS2 and DORA?", "Which controls map to DORA Article 6?", "Explain ISO 27001 Annex A.8 privileged access requirements"],
    rfp: ["Generate a response for: How do you manage third-party ICT risk?", "Draft RFP answer: Describe your incident response capabilities", "RFP response: What data protection measures are in place?"],
    audit: ["What evidence do we need for DORA Article 11 audit?", "Summarize our gaps for the upcoming ISO 27001 audit", "What are our open findings from the last NIS2 assessment?"],
    policy: ["What is our data classification policy?", "Summarize our incident response plan", "What are the privileged access management requirements?"],
  };

  const AI_RESPONSES = {
    "nis2.*dora": {
      text: "**NIS2 vs DORA - Key Differences:**\n\nNIS2 (Network and Information Systems Directive 2) and DORA (Digital Operational Resilience Act) both strengthen cybersecurity in the EU but differ in scope and focus:\n\n**Scope:** NIS2 applies broadly to essential and important entities across 18 sectors. DORA specifically targets the financial sector including banks, insurers, and ICT service providers.\n\n**Incident Reporting:** NIS2 requires a 24-hour early warning and 72-hour full notification to the CSIRT. DORA requires classification of ICT incidents and reporting to the competent authority within strict timelines with initial, intermediate, and final reports.\n\n**Third-Party Risk:** DORA has significantly more prescriptive requirements for ICT third-party risk management (Articles 28-44) including an EU-level oversight framework for critical ICT providers. NIS2 addresses supply chain security more broadly.\n\n**Testing:** DORA mandates Threat-Led Penetration Testing (TLPT) every 3 years for significant entities. NIS2 requires appropriate security measures but is less prescriptive on testing methodology.\n\n**Your ICF Status:** 3 controls currently map to both NIS2 and DORA with 1 Critical Gap in third-party risk assessment (ICF-TPR-001).",
      sources: [{ title: "NIS2 Directive (EU) 2022/2555", type: "Regulation", clauses: "Art. 21, Art. 23" }, { title: "DORA Regulation (EU) 2022/2554", type: "Regulation", clauses: "Art. 5-6, Art. 17-19, Art. 28-44" }, { title: "ICF Control Library", type: "Internal", clauses: "ICF-TPR-001, ICF-INC-001" }]
    },
    "dora.*article.*6|article.*6.*dora|dora.*art.*6": {
      text: "**DORA Article 6 - ICT Risk Management Framework:**\n\nArticle 6 requires financial entities to establish a comprehensive ICT risk management framework. Here are the key requirements:\n\n**Art. 6(1)-(4): Framework Establishment** - Entities must have a sound, comprehensive, and well-documented ICT risk management framework as part of their overall risk management system. This must include strategies, policies, and tools necessary to protect all information and ICT assets.\n\n**Art. 6(5): Risk Register** - Maintain a centralized ICT risk register documenting all identified risks, assessment outcomes, treatment plans, and residual risk levels. **Your status: ICF-RSK-002 is a Critical Gap** - no centralized risk register currently exists.\n\n**Art. 6(8): Continuous Improvement** - The framework must be reviewed at least annually and upon significant ICT incidents.\n\n**Your ICF Mapping:** 4 controls map to DORA Art. 6:\n- ICF-RSK-001 (Integrated Risk Methodology) - **Partial**\n- ICF-RSK-002 (ICT Risk Register) - **Critical Gap**\n- ICF-GOV-001 (Governance Framework) - Compliant\n- ICF-GOV-002 (Board Reporting) - Compliant\n\n**Recommended Action:** Prioritize ICF-RSK-002 remediation - estimated 80h effort with deadline 2026-04-15.",
      sources: [{ title: "DORA Regulation (EU) 2022/2554", type: "Regulation", clauses: "Art. 6(1)-(8)" }, { title: "ICF Risk Register", type: "Internal", clauses: "ICF-RSK-001, ICF-RSK-002" }, { title: "EBA Guidelines on ICT Risk", type: "Guidance", clauses: "Section 4.1-4.3" }]
    },
    "third.party.*risk|vendor.*risk|rfp.*third": {
      text: "**RFP Response - Third-Party ICT Risk Management:**\n\n*Suggested Response:*\n\nOur organization maintains a comprehensive third-party ICT risk management program aligned with DORA Articles 28-30, NIS2 Article 21(2)(d), and ISO 27001 Annex A.5.19-5.22.\n\n**Risk Assessment Process:**\nAll third-party ICT providers undergo tiered risk assessment based on criticality classification (Critical, Important, Standard). Critical providers are subject to enhanced due diligence including on-site assessments, SOC 2 Type II review, and continuous security monitoring.\n\n**Contractual Framework:**\nAll ICT service agreements include standardized security clauses covering: data protection obligations, incident notification requirements (24h for critical incidents), right-to-audit provisions, exit strategy and data portability, and sub-contracting restrictions per DORA Art. 30.\n\n**Continuous Monitoring:**\nWe employ external security ratings platforms for continuous monitoring of critical provider security posture, with quarterly reassessments and automated alerts for rating changes.\n\n**Current Status Note:** *This area is flagged as a Critical Gap (ICF-TPR-001) - remediation in progress with target completion 2026-04-01.*",
      sources: [{ title: "DORA Art. 28-30", type: "Regulation", clauses: "Third-party provisions" }, { title: "ICF-TPR-001 Control", type: "Internal", clauses: "Third-Party Risk Assessment Program" }, { title: "ISO 27001 A.5.19-5.22", type: "Standard", clauses: "Supplier relationships" }]
    },
    "incident.*response|rfp.*incident": {
      text: "**RFP Response - Incident Response Capabilities:**\n\n*Suggested Response:*\n\nOur Incident Response (IR) program is structured around a comprehensive IR Plan endorsed by executive leadership, with detailed playbooks for common incident types.\n\n**IR Framework:**\n- Incident classification using 4-tier severity model (P1-Critical through P4-Low)\n- 24/7 monitoring via integrated SIEM/SOC with automated alerting\n- Defined RACI matrix with escalation procedures and communication chains\n\n**Playbooks Maintained:**\nRansomware, Data Breach, DDoS, Insider Threat, Supply Chain Compromise, Cloud Security Incidents\n\n**Regulatory Compliance:**\n- NIS2: 24-hour early warning, 72-hour full notification capability\n- DORA: ICT incident classification and reporting per Art. 17-19\n- GDPR: 72-hour DPA notification for personal data breaches\n\n**Testing Cadence:**\n- Tabletop exercises: Semi-annually\n- Full simulation exercises: Annually\n- TLPT (Threat-Led Penetration Testing): Every 3 years per DORA\n\n**Current Status Note:** *ICF-INC-001 is rated as Partial - playbook formalization and SOAR integration are in progress (est. 40h, deadline 2026-06-15).*",
      sources: [{ title: "ICF-INC-001", type: "Internal", clauses: "Incident Response Plan & Playbooks" }, { title: "NIS2 Art. 23", type: "Regulation", clauses: "Incident reporting obligations" }, { title: "DORA Art. 17-19", type: "Regulation", clauses: "ICT incident management" }]
    },
    "data.*classif|data.*protect|rfp.*data": {
      text: "**Data Classification & Protection Policy Summary:**\n\nPer ICF-DPP-001 (Status: **Compliant**), our data classification scheme covers:\n\n**Classification Levels:**\n- **Strictly Confidential** - Board papers, M&A data, cryptographic keys\n- **Confidential** - Customer PII, financial records, audit reports\n- **Internal** - Policies, procedures, internal communications\n- **Public** - Published reports, marketing materials\n\n**Handling Requirements per Level:**\nEach level has defined controls for storage (encryption at rest AES-256), transmission (TLS 1.3 minimum), processing (role-based access), sharing (approval workflows), retention (per regulatory schedule), and destruction (cryptographic erasure).\n\n**Regulatory Mapping:**\n- GDPR Art. 5, 25, 30, 32: Data protection principles and security measures\n- ISO 27001 A.5.12-5.14: Classification, labeling, and transfer controls\n- NIS2 Art. 21(2)(d): Supply chain information handling\n\n**ROPA:** Record of Processing Activities maintained with quarterly reviews, covering all processing operations across 47 identified processing activities.\n\n**Evidence:** 4 of 4 evidence items current - DLP policy, classification matrix, ROPA register, training completion records.",
      sources: [{ title: "ICF-DPP-001", type: "Internal", clauses: "Data Classification & Handling" }, { title: "GDPR Art. 5, 25, 30, 32", type: "Regulation", clauses: "Data protection" }, { title: "Data Classification Policy v2.3", type: "Policy", clauses: "POL-003" }]
    },
    "iso.*27001.*a.*8|privileged.*access|pam": {
      text: "**ISO 27001 Annex A.8 - Access Control Requirements:**\n\nAnnex A.8.2 and A.8.3 cover privileged access rights and access restriction. Here is how our controls map:\n\n**ICF-IAM-001: Privileged Access Management (Status: Compliant)**\n\nOur PAM program implements:\n- Just-in-Time (JIT) privilege elevation for all admin access\n- Session recording for all privileged actions with tamper-proof audit trail\n- Credential vaulting with automated rotation (90-day cycle, 24h for incidents)\n- MFA enforced on all privileged sessions without exception\n- Quarterly privileged access certification campaigns\n\n**Mapped Standards:**\n- ISO 27001 A.8.2 & A.8.3: Privileged access rights and restriction\n- NIS2 Art. 21(2)(i): Human resources security and access control\n- PCI DSS Req. 7 & 8: Restrict and identify access\n- ABRO 2026 S8.1-8.3: Access management requirements\n\n**Evidence:** 3 of 4 evidence items - PAM tool configuration docs, quarterly review reports, MFA enrollment records. Missing: annual penetration test of PAM controls (scheduled Q2 2026).\n\n**Key Metric:** Mean time to provision privileged access: 4.2 minutes (JIT), mean time to revoke: immediate upon session end.",
      sources: [{ title: "ICF-IAM-001", type: "Internal", clauses: "Privileged Access Management" }, { title: "ISO 27001 A.8.2-8.3", type: "Standard", clauses: "Privileged access" }, { title: "PAM Policy v1.8", type: "Policy", clauses: "POL-008" }]
    },
    "audit.*dora.*11|dora.*11.*audit|evidence.*dora": {
      text: "**DORA Article 11 - ICT Business Continuity Audit Preparation:**\n\nFor an audit of DORA Art. 11 compliance, you need the following evidence:\n\n**Required Documentation:**\n1. ICT Business Continuity Policy (board-endorsed)\n2. Business Impact Analysis (BIA) with defined MTD, RTO, RPO per critical system\n3. ICT Continuity Plans for all critical business functions\n4. DR Plans with documented RTO < 4h and RPO < 1h targets\n5. Crisis communication procedures and escalation matrices\n6. Third-party provider continuity arrangements per Art. 11(7)\n\n**Testing Evidence Required:**\n7. Annual BCP exercise reports with participant lists and findings\n8. DR failover test results for all critical systems\n9. Lessons learned and corrective action tracking\n10. Third-party ICT provider failure scenario testing results\n\n**Your ICF Status:** ICF-BCP-001 is rated **Partial** with 2 of 4 evidence items:\n- Missing: Updated BIA (last conducted 2024) and DR failover test documentation\n- Present: BCP policy document and crisis communication plan\n\n**Audit Risk:** Medium-High. Recommend completing BIA refresh and DR testing before audit (est. 70h, deadline 2026-07-01).",
      sources: [{ title: "DORA Art. 11-12", type: "Regulation", clauses: "ICT business continuity" }, { title: "ICF-BCP-001", type: "Internal", clauses: "Business Continuity Planning" }, { title: "EBA Guidelines on ICT Continuity", type: "Guidance", clauses: "Section 5" }]
    },
    "gap.*iso.*27001|iso.*27001.*audit|gap.*audit": {
      text: "**ISO 27001 Audit Gap Summary:**\n\nBased on current ICF control assessments, here is your gap posture for ISO 27001:\n\n**Compliant Controls (mapped to ISO 27001): 18**\nAll core clauses covered: Governance (5.1-5.2), Risk Assessment (6.1.2), Access Control (A.8), Incident Management (A.5.24-5.28), Data Classification (A.5.12-5.14)\n\n**Partial Controls: 4**\n- ICF-RSK-001: Risk methodology needs quantitative extension\n- ICF-INC-001: Playbooks need formalization\n- ICF-BCP-001: BIA and DR testing outdated\n- ICF-CYB-002: Vulnerability management SLAs not enforced\n\n**Critical Gaps: 2**\n- ICF-RSK-002: No centralized risk register (Clause 6.1.2, 8.2)\n- ICF-CLD-001: Cloud security posture not managed (Annex A)\n\n**Audit Readiness Score: 72%**\n\n**Priority Actions Before Audit:**\n1. Deploy ICT risk register (80h) - addresses highest-risk finding\n2. Implement CSPM tooling (120h) - closes cloud security gap\n3. Formalize vulnerability SLAs (50h) - demonstrates operational maturity\n\nTotal estimated remediation: 250h across 3 workstreams.",
      sources: [{ title: "ICF Control Library", type: "Internal", clauses: "18 ISO 27001 mapped controls" }, { title: "ISO 27001:2022", type: "Standard", clauses: "Cl. 5-10, Annex A" }, { title: "Last Audit Report", type: "Internal", clauses: "Ref: AUD-2025-003" }]
    },
  };

  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    for (const [pattern, response] of Object.entries(AI_RESPONSES)) {
      if (new RegExp(pattern, "i").test(q)) return response;
    }
    return {
      text: "I've searched our regulatory knowledge base and internal policies for information related to your query.\n\nBased on the ICF Control Library and mapped frameworks (NIS2, DORA, ISO 27001, GDPR, ABRO 2026, PCI DSS), I can provide guidance on:\n\n- **Control requirements** for any of the " + CONTROLS_DATA.length + " controls in the library\n- **Framework clause interpretation** across all mapped regulations\n- **Gap status** and remediation recommendations\n- **RFP-ready responses** for common compliance questions\n- **Policy summaries** from your internal policy register\n\nCould you rephrase your question or try one of the suggested prompts? For example, ask about a specific regulation, control ID, or compliance topic.",
      sources: [{ title: "ICF Knowledge Base", type: "Internal", clauses: CONTROLS_DATA.length + " controls indexed" }]
    };
  };

  const handleSend = () => {
    if (!input.trim() && uploadedDocs.length === 0) return;
    var msgText = input;
    var userMsg = { id: messages.length + 1, role: "user", text: msgText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mode: activeMode };
    setMessages(prev => [...prev, userMsg]);
    var savedInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      var response = getAIResponse(savedInput);
      var aiMsg = { id: messages.length + 2, role: "assistant", text: response.text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), sources: response.sources, mode: activeMode };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSuggestion = (q) => { setInput(q); };

  // ── RFP Document Upload & Processing ──
  const RFP_SIMULATED_QUESTIONS = {
    "security-questionnaire": [
      { id: "rq1", question: "Describe your organization's information security governance framework and how it aligns with recognized standards.", category: "Governance", answered: false },
      { id: "rq2", question: "How does your organization manage ICT third-party and supply chain risks?", category: "Third-Party Risk", answered: false },
      { id: "rq3", question: "Describe your incident response capabilities including detection, containment, and notification timelines.", category: "Incident Response", answered: false },
      { id: "rq4", question: "What data classification and handling procedures are in place for sensitive information?", category: "Data Protection", answered: false },
      { id: "rq5", question: "How do you manage privileged access across your IT environment?", category: "Access Control", answered: false },
      { id: "rq6", question: "Describe your business continuity and disaster recovery capabilities including RTO/RPO targets.", category: "Business Continuity", answered: false },
      { id: "rq7", question: "What vulnerability management processes are in place and what are your remediation SLAs?", category: "Vulnerability Management", answered: false },
      { id: "rq8", question: "How do you ensure compliance with GDPR and other applicable data protection regulations?", category: "Privacy", answered: false },
    ],
    "compliance-rfp": [
      { id: "rq1", question: "Please provide evidence of ISO 27001 certification or equivalent security framework compliance.", category: "Certification", answered: false },
      { id: "rq2", question: "How does your organization comply with DORA requirements for digital operational resilience?", category: "DORA", answered: false },
      { id: "rq3", question: "Describe your cloud security posture management approach across multi-cloud environments.", category: "Cloud Security", answered: false },
      { id: "rq4", question: "What security monitoring and logging capabilities are in place? What is your log retention period?", category: "Monitoring", answered: false },
      { id: "rq5", question: "How do you manage and test your business continuity plans in line with DORA Article 11?", category: "Continuity", answered: false },
      { id: "rq6", question: "Describe your risk assessment methodology and how often are risk assessments conducted?", category: "Risk Management", answered: false },
    ],
    "vendor-assessment": [
      { id: "rq1", question: "What frameworks and standards does your security program align with?", category: "Frameworks", answered: false },
      { id: "rq2", question: "Do you have a SOC 2 Type II report available? If so, were there any exceptions noted?", category: "Audit", answered: false },
      { id: "rq3", question: "How are encryption keys managed throughout their lifecycle?", category: "Cryptography", answered: false },
      { id: "rq4", question: "What is your approach to secure software development and application security testing?", category: "AppSec", answered: false },
      { id: "rq5", question: "Describe your employee security awareness training program.", category: "Training", answered: false },
    ],
  };

  const RFP_ANSWERS = {
    governance: "Our organization has established a formal Information Security Governance Framework (ICF-GOV-001, Status: Compliant) endorsed by the board, aligned with NIS2 Art. 20, DORA Art. 5, ISO 27001 Cl. 5.1, and ABRO 2026 Domain 1. The framework defines strategic direction, RACI matrices for security roles, and an Information Security Steering Committee with quarterly review cadence. Board-level cybersecurity reporting (ICF-GOV-002, Compliant) ensures quarterly executive updates covering threat landscape, compliance posture, and incident metrics.",
    "third-party": "We maintain a third-party ICT risk management program aligned with DORA Art. 28-30, NIS2 Art. 21(2)(d), and ISO 27001 A.5.19-5.22. All providers undergo tiered risk assessment (Critical, Important, Standard). Critical providers are subject to enhanced due diligence, SOC 2 review, and continuous security posture monitoring. Contractual clauses cover incident notification (24h), right-to-audit, exit strategies, and sub-contracting restrictions. Note: This area is undergoing enhancement per ICF-TPR-001 remediation plan (target: 2026-04-01).",
    "incident": "Our IR program (ICF-INC-001) includes a comprehensive IR Plan with playbooks for ransomware, data breach, DDoS, insider threat, supply chain compromise, and cloud incidents. We maintain 24/7 SIEM/SOC monitoring with automated alerting. Regulatory notification capabilities: NIS2 24h early warning / 72h full notification, DORA incident classification per Art. 17-19, GDPR 72h DPA notification. Testing: semi-annual tabletop exercises and annual full simulations. TLPT conducted every 3 years per DORA. Current status: Partial - playbook formalization in progress (est. completion: 2026-06-15).",
    "data": "Per ICF-DPP-001 (Compliant), we implement a 4-tier classification scheme: Strictly Confidential, Confidential, Internal, Public. Each level has defined handling requirements for storage (AES-256 at rest), transmission (TLS 1.3 minimum), processing (RBAC), retention (per regulatory schedule), and destruction (cryptographic erasure). ROPA maintained with quarterly reviews covering 47 processing activities. Mapped to GDPR Art. 5/25/30/32, ISO 27001 A.5.12-5.14, NIS2 Art. 21(2)(d). All 4 evidence items current.",
    access: "Our PAM program (ICF-IAM-001, Compliant) implements: Just-in-Time privilege elevation, session recording with tamper-proof audit trail, credential vaulting with automated 90-day rotation, MFA on all privileged sessions, and quarterly access certification campaigns. Mapped to ISO 27001 A.8.2-8.3, NIS2 Art. 21(2)(i), PCI DSS Req. 7-8, ABRO 2026 S8.1-8.3. Mean time to provision: 4.2 min (JIT), revocation: immediate upon session end.",
    continuity: "Our BCP program (ICF-BCP-001) includes Business Impact Analysis, continuity plans for critical functions, DR plans targeting RTO < 4h and RPO < 1h for critical systems, and crisis management procedures. Mapped to DORA Art. 11-12, ISO 27001 A.5.29-5.30, ABRO 2026 S11.1-11.3. Current status: Partial - BIA refresh and DR failover testing in progress (est. 70h, deadline 2026-07-01).",
    vulnerability: "Our vulnerability management program (ICF-CYB-002) includes enterprise scanning across all environments, risk-based prioritization via CMDB integration, and defined remediation SLAs: Critical 72h, High 14d, Medium 30d, Low 90d. Automated patching for standard configurations. Exception/waiver process for unresolvable vulnerabilities. Executive dashboard tracks trends and SLA compliance. Current status: Partial - SLA enforcement being formalized (est. 50h, deadline 2026-05-15).",
    privacy: "We maintain comprehensive GDPR compliance through ICF-DPP-001 (Compliant): Data Classification & Handling policy with ROPA covering all processing activities, DPO appointed, DPIA process for high-risk processing, cross-border transfer mechanisms (SCCs), data subject rights procedures (response within 30 days), and breach notification capability (72h to DPA). Annual data protection training for all personnel. Mapped to GDPR Art. 5, 25, 30, 32, ISO 27001 A.5.12-5.14.",
    certification: "Our security program aligns with ISO 27001:2022, with 18 controls directly mapped. Current audit readiness score: 72%. Core certifications maintained: ISO 27001 (Cl. 5-10, Annex A), with compliance mappings to NIS2, DORA, GDPR, ABRO 2026, and PCI DSS. 2 critical gaps under remediation (ICT Risk Register and Cloud Security Posture). Annual surveillance audit scheduled Q3 2026.",
    dora: "Our DORA compliance program covers: ICT Risk Management Framework (Art. 5-6) with board-level governance, ICT Incident Management (Art. 17-19) with classification and reporting capabilities, Digital Operational Resilience Testing (Art. 24-27) including TLPT, and Third-Party Risk Management (Art. 28-30). Key areas: ICF-GOV-001/002 Compliant, ICF-RSK-001 Partial (quantitative methodology enhancement in progress), ICF-RSK-002 Critical Gap (risk register deployment priority). ICT Business Continuity per Art. 11 under enhancement.",
    cloud: "Our CSPM approach (ICF-CLD-001) targets unified management across AWS, Azure, and GCP environments with CIS Benchmark alignment, continuous compliance monitoring with drift detection, cloud workload protection, and shared responsibility documentation per CSP. Current status: Critical Gap - CSPM deployment and baseline configuration in progress (est. 120h, deadline 2026-05-01).",
    monitoring: "Security monitoring is managed through centralized SIEM covering all critical assets, network segments, and cloud environments. Correlation rules tuned for DORA-relevant threat scenarios. 24/7 SOC capability with severity-based escalation. Log retention: 7 years per DORA requirements with tamper-proof storage. Executive and operational dashboards maintained. Quarterly detection rule tuning and coverage assessments.",
    risk: "We employ an integrated risk assessment methodology (ICF-RSK-001) based on ISO 31000 principles, integrated into our GRC platform. Risk assessments conducted annually for all critical assets with trigger-based reassessments. Methodology covers qualitative and quantitative analysis, incorporating threat intelligence feeds and cascading/systemic risk scenarios per DORA Art. 6. Current status: Partial - extending with FAIR quantitative model and enhanced aggregation views.",
    framework: "Our security program aligns with: NIS2 (essential entity compliance), DORA (digital operational resilience for financial sector), ISO 27001:2022 (ISMS), GDPR (data protection), ABRO 2026 (government supplier requirements), ISO 20000-1 (IT service management), PCI DSS (payment card security), and CMMI (maturity framework). Total: " + CONTROLS_DATA.length + " controls mapped across " + FRAMEWORKS.length + " frameworks.",
    audit: "Our most recent audit (AUD-2025-003) covered ISO 27001 surveillance with no major non-conformities. We maintain: Internal audit program with quarterly cycles, external certification audits annually, DORA-specific TLPT testing every 3 years, and continuous compliance monitoring via GRC platform. Audit evidence centrally managed in ICF Evidence module with automated expiry tracking.",
    crypto: "Encryption key management follows ISO 27001 A.8.24 and industry best practices: HSM-based key storage for critical keys, automated key rotation schedules (90 days standard, 24h for compromised keys), segregation of duties for key management operations, and full lifecycle tracking from generation through destruction. AES-256 for data at rest, TLS 1.3 for data in transit.",
    appsec: "Our secure development program follows OWASP SDLC practices: threat modeling during design, SAST/DAST scanning in CI/CD pipelines, dependency vulnerability scanning, code review requirements, and annual penetration testing. Developer security training conducted quarterly. Security gates at each phase of the development lifecycle.",
    training: "Our security awareness program (aligned with NIS2 Art. 20(2) and ISO 27001 A.6.3) includes: Mandatory annual security awareness training for all employees (98% completion rate), role-specific training for developers, admins, and executives, monthly phishing simulations (current click rate: 3.2%), and specialized training for GDPR, incident response, and data handling. New hire onboarding includes security module completion within first week.",
  };

  const matchAnswer = (question) => {
    const q = question.toLowerCase();
    if (q.includes("governance") || q.includes("security framework") || q.includes("information security")) return RFP_ANSWERS.governance;
    if (q.includes("third-party") || q.includes("supply chain") || q.includes("vendor risk")) return RFP_ANSWERS["third-party"];
    if (q.includes("incident response") || q.includes("detection") || q.includes("containment")) return RFP_ANSWERS.incident;
    if (q.includes("data classif") || q.includes("data handling") || q.includes("sensitive information")) return RFP_ANSWERS.data;
    if (q.includes("privileged access") || q.includes("access manage") || q.includes("pam")) return RFP_ANSWERS.access;
    if (q.includes("business continuity") || q.includes("disaster recovery") || q.includes("rto") || q.includes("rpo")) return RFP_ANSWERS.continuity;
    if (q.includes("vulnerability") || q.includes("patch") || q.includes("remediation sla")) return RFP_ANSWERS.vulnerability;
    if (q.includes("gdpr") || q.includes("data protection regulation") || q.includes("privacy")) return RFP_ANSWERS.privacy;
    if (q.includes("iso 27001") || q.includes("certification") || q.includes("evidence of")) return RFP_ANSWERS.certification;
    if (q.includes("dora") || q.includes("digital operational resilience")) return RFP_ANSWERS.dora;
    if (q.includes("cloud") || q.includes("multi-cloud") || q.includes("cspm")) return RFP_ANSWERS.cloud;
    if (q.includes("monitoring") || q.includes("logging") || q.includes("log retention") || q.includes("siem")) return RFP_ANSWERS.monitoring;
    if (q.includes("risk assessment") || q.includes("risk methodology")) return RFP_ANSWERS.risk;
    if (q.includes("framework") || q.includes("standard")) return RFP_ANSWERS.framework;
    if (q.includes("soc 2") || q.includes("audit")) return RFP_ANSWERS.audit;
    if (q.includes("encryption") || q.includes("key manage") || q.includes("cryptogra")) return RFP_ANSWERS.crypto;
    if (q.includes("secure development") || q.includes("application security") || q.includes("appsec") || q.includes("sdlc")) return RFP_ANSWERS.appsec;
    if (q.includes("training") || q.includes("awareness") || q.includes("phishing")) return RFP_ANSWERS.training;
    return "Based on our ICF control library and mapped regulatory frameworks, our organization maintains comprehensive controls in this area. Please refer to our detailed control documentation or contact the compliance team for a specific response aligned with the relevant regulatory clauses.";
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const isValid = ["pdf", "xlsx", "xls", "csv", "docx", "doc"].includes(ext);
    if (!isValid) return;

    const doc = { id: "doc-" + Date.now(), name: file.name, size: (file.size / 1024).toFixed(1) + " KB", type: ext, uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setUploadedDocs(prev => [...prev, doc]);
    setProcessingDoc(true);
    setShowDocPanel(true);

    // Simulate document processing
    const userMsg = { id: messages.length + 1, role: "user", text: "Uploaded document for RFP analysis: **" + file.name + "** (" + doc.size + ")", time: doc.uploadedAt, mode: "rfp", isUpload: true, fileName: file.name };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      // Pick question set based on filename keywords
      var qSet = "security-questionnaire";
      var fn = file.name.toLowerCase();
      if (fn.includes("vendor") || fn.includes("assessment")) qSet = "vendor-assessment";
      else if (fn.includes("compliance") || fn.includes("rfp")) qSet = "compliance-rfp";

      var questions = RFP_SIMULATED_QUESTIONS[qSet].map(q => ({ ...q, answered: false }));
      setExtractedQuestions(questions);
      setProcessingDoc(false);

      var aiMsg = { id: messages.length + 2, role: "assistant", text: "I've analyzed **" + file.name + "** and extracted **" + questions.length + " compliance questions**. The questions cover: " + [...new Set(questions.map(q => q.category))].join(", ") + ".\n\nYou can:\n- **Answer All** to auto-generate responses for every question using our policy controls and SOPs\n- Click individual questions to review and answer them one at a time\n- Edit any generated answer before exporting\n\nThe responses will be mapped to your ICF controls, regulatory frameworks, and current compliance status.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), sources: [{ title: "ICF Knowledge Base", type: "Internal", clauses: CONTROLS_DATA.length + " controls" }, { title: "Policy Register", type: "Internal", clauses: POLICIES_DATA.length + " policies" }], isDocResponse: true };
      setMessages(prev => [...prev, aiMsg]);
    }, 2000);

    e.target.value = "";
  };

  const handleAnswerAll = () => {
    setAnsweringAll(true);
    setAnsweredCount(0);
    var qs = [...extractedQuestions];
    var idx = 0;
    var interval = setInterval(() => {
      if (idx >= qs.length) {
        clearInterval(interval);
        setAnsweringAll(false);
        var summaryMsg = { id: messages.length + 100, role: "assistant", text: "All **" + qs.length + " questions** have been answered using your ICF controls, policies, and SOPs.\n\n**Coverage Summary:**\n- Questions answered: " + qs.length + "/" + qs.length + "\n- Controls referenced: " + CONTROLS_DATA.length + "\n- Frameworks cited: NIS2, DORA, ISO 27001, GDPR, ABRO 2026, PCI DSS\n- Current gaps flagged: ICF-TPR-001, ICF-RSK-002, ICF-CLD-001\n\nYou can review and edit each answer in the document panel on the left. Click **Copy All Answers** to export them for pasting into your RFP response document.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), sources: [{ title: "ICF Control Library", type: "Internal", clauses: "All mapped controls" }] };
        setMessages(prev => [...prev, summaryMsg]);
        return;
      }
      qs[idx] = { ...qs[idx], answered: true, answer: matchAnswer(qs[idx].question) };
      setExtractedQuestions([...qs]);
      setAnsweredCount(idx + 1);
      idx++;
    }, 400);
  };

  const handleAnswerSingle = (qId) => {
    setExtractedQuestions(prev => prev.map(q => q.id === qId ? { ...q, answered: true, answer: matchAnswer(q.question) } : q));
  };

  const handleCopyAllAnswers = () => {
    var text = extractedQuestions.filter(q => q.answered).map((q, i) => "Q" + (i + 1) + ": " + q.question + "\n\nA: " + (q.answer || "")).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight: 700, color: COLORS.text, marginTop: i > 0 ? 8 : 0, marginBottom: 2 }}>{line.replace(/\*\*/g, "")}</div>;
      if (line.startsWith("- **")) {
        const parts = line.replace(/^- /, "").split("**");
        return <div key={i} style={{ display: "flex", gap: 6, marginLeft: 8, fontSize: 12, lineHeight: 1.6 }}><span style={{ color: COLORS.primary }}>-</span><span><strong>{parts[1]}</strong>{parts[2] || ""}</span></div>;
      }
      if (line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 6, marginLeft: 8, fontSize: 12, lineHeight: 1.6 }}><span style={{ color: COLORS.primary }}>-</span><span>{line.slice(2)}</span></div>;
      if (line.match(/^\d+\./)) return <div key={i} style={{ display: "flex", gap: 6, marginLeft: 8, fontSize: 12, lineHeight: 1.6 }}><span style={{ color: COLORS.primary, fontWeight: 600, flexShrink: 0 }}>{line.match(/^\d+\./)[0]}</span><span>{line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").split("<b>").map((p, j) => j % 2 === 0 ? p.replace(/<\/b>/g, "") : <strong key={j}>{p.replace(/<\/b>/g, "")}</strong>)}</span></div>;
      if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) return <div key={i} style={{ fontStyle: "italic", color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{line.replace(/\*/g, "")}</div>;
      if (line === "") return <div key={i} style={{ height: 6 }} />;
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      return <div key={i} style={{ fontSize: 12, lineHeight: 1.6, color: COLORS.textSecondary }}>{boldParts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: COLORS.text }}>{p}</strong> : p)}</div>;
    });
  };

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 110px)" }}>
      {/* Sidebar - History & Modes */}
      <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Assistant Mode">
          <div style={{ padding: "4px 0" }}>
            {MODES.map(m => (
              <div key={m.id} onClick={() => setActiveMode(m.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", background: activeMode === m.id ? COLORS.primaryLight : "transparent", borderLeft: activeMode === m.id ? "3px solid " + COLORS.primary : "3px solid transparent", transition: "all 0.15s" }}
                onMouseEnter={e => { if (activeMode !== m.id) e.currentTarget.style.background = COLORS.surfaceAlt; }}
                onMouseLeave={e => { if (activeMode !== m.id) e.currentTarget.style.background = "transparent"; }}>
                <m.icon size={15} color={activeMode === m.id ? COLORS.primary : COLORS.textMuted} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: activeMode === m.id ? 600 : 400, color: activeMode === m.id ? COLORS.primary : COLORS.text }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Chats">
          <div style={{ padding: "4px 0" }}>
            {chatHistory.map(ch => (
              <div key={ch.id} style={{ padding: "8px 16px", cursor: "pointer", borderBottom: "1px solid " + COLORS.borderLight }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text, marginBottom: 2 }}>{ch.title}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>{ch.date} - {ch.msgs} messages</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Knowledge Base</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: COLORS.textSecondary }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Frameworks indexed</span><strong>{FRAMEWORKS.length}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Controls mapped</span><strong>{CONTROLS_DATA.length}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Policies loaded</span><strong>{POLICIES_DATA.length}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Regulatory clauses</span><strong>340+</strong></div>
          </div>
        </div>

        {/* RFP Document Upload */}
        <div style={{ background: COLORS.surface, borderRadius: 10, border: "1px dashed " + (activeMode === "rfp" ? COLORS.primary : COLORS.border), padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.background = COLORS.primaryLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = activeMode === "rfp" ? COLORS.primary : COLORS.border; e.currentTarget.style.background = COLORS.surface; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Upload size={14} color={COLORS.primary} />
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.primary }}>Upload RFP Document</span>
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted }}>PDF, Excel, Word - AI will extract questions and auto-generate answers</div>
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.xlsx,.xls,.csv,.docx,.doc" onChange={handleFileUpload} style={{ display: "none" }} />

        {/* Uploaded Documents & Extracted Questions */}
        {uploadedDocs.length > 0 && (
          <div style={{ background: COLORS.surface, borderRadius: 10, border: "1px solid " + COLORS.border, overflow: "hidden" }}>
            <div style={{ padding: "8px 14px", borderBottom: "1px solid " + COLORS.borderLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text }}>Uploaded Documents</span>
              <span style={{ fontSize: 10, color: COLORS.textMuted }}>{uploadedDocs.length} file{uploadedDocs.length > 1 ? "s" : ""}</span>
            </div>
            {uploadedDocs.map(doc => (
              <div key={doc.id} style={{ padding: "8px 14px", borderBottom: "1px solid " + COLORS.borderLight, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: doc.type === "pdf" ? "#ef444420" : doc.type === "xlsx" || doc.type === "xls" ? "#22c55e20" : "#3b82f620", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: doc.type === "pdf" ? "#ef4444" : doc.type === "xlsx" || doc.type === "xls" ? "#22c55e" : "#3b82f6", textTransform: "uppercase" }}>{doc.type}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                  <div style={{ fontSize: 9, color: COLORS.textMuted }}>{doc.size}</div>
                </div>
              </div>
            ))}
            {processingDoc && (
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 14, height: 14, border: "2px solid " + COLORS.primary, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 11, color: COLORS.primary }}>Analyzing document...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {extractedQuestions.length > 0 && !processingDoc && (
              <div style={{ padding: "8px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase" }}>{extractedQuestions.filter(q => q.answered).length}/{extractedQuestions.length} Answered</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {extractedQuestions.some(q => q.answered) && (
                      <button onClick={handleCopyAllAnswers} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, border: "1px solid " + COLORS.border, background: COLORS.surface, color: COLORS.textSecondary, cursor: "pointer" }}>Copy All</button>
                    )}
                    {!answeringAll && extractedQuestions.some(q => !q.answered) && (
                      <button onClick={handleAnswerAll} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, border: "none", background: COLORS.primary, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Answer All</button>
                    )}
                  </div>
                </div>
                {answeringAll && (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ height: 3, borderRadius: 2, background: COLORS.borderLight, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: COLORS.primary, borderRadius: 2, transition: "width 0.3s", width: (answeredCount / extractedQuestions.length * 100) + "%" }} />
                    </div>
                    <div style={{ fontSize: 9, color: COLORS.primary, marginTop: 2 }}>{"Answering " + answeredCount + "/" + extractedQuestions.length + "..."}</div>
                  </div>
                )}
                <div style={{ maxHeight: 200, overflow: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                  {extractedQuestions.map((q, qi) => (
                    <div key={q.id} onClick={() => { if (!q.answered) handleAnswerSingle(q.id); setShowDocPanel(q.id); }}
                      style={{ padding: "6px 8px", borderRadius: 6, background: showDocPanel === q.id ? COLORS.primaryLight : q.answered ? COLORS.successLight : COLORS.surfaceAlt, border: "1px solid " + (showDocPanel === q.id ? COLORS.primary + "40" : q.answered ? COLORS.success + "30" : COLORS.borderLight), cursor: "pointer", transition: "all 0.1s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: q.answered ? COLORS.success : COLORS.border, flexShrink: 0 }}>
                          {q.answered ? <Check size={9} color="#fff" /> : <span style={{ fontSize: 8, color: "#fff" }}>{"Q" + (qi + 1)}</span>}
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.text, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{q.question}</div>
                      </div>
                      <div style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 2, marginLeft: 22 }}>{q.category}{q.answered ? " - Answered" : " - Click to answer"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.surface, borderRadius: 14, border: "1px solid " + COLORS.border, overflow: "hidden" }}>
        {/* Chat header */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid " + COLORS.borderLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, " + COLORS.primary + ", " + COLORS.accent + ")", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={16} color="#fff" /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>ICF Compliance Assistant</div>
              <div style={{ fontSize: 11, color: COLORS.success, display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.success }} />Online - {MODES.find(m => m.id === activeMode)?.label} Mode</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setMessages([messages[0]]); }} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid " + COLORS.border, background: "transparent", color: COLORS.textMuted, fontSize: 11, cursor: "pointer" }}>New Chat</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "user" ? COLORS.primary + "15" : "linear-gradient(135deg, " + COLORS.primary + "20, " + COLORS.accent + "20)", color: msg.role === "user" ? COLORS.primary : COLORS.accent, fontSize: 11, fontWeight: 700 }}>
                {msg.role === "user" ? CURRENT_USER.name.split(" ").map(n => n[0]).join("").slice(0, 2) : <Zap size={14} />}
              </div>
              <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 4 }}>
                {msg.mode && msg.role === "user" && <span style={{ fontSize: 9, color: COLORS.textMuted, alignSelf: "flex-end" }}>{MODES.find(m => m.id === msg.mode)?.label} mode</span>}
                <div style={{ background: msg.role === "user" ? COLORS.primary : COLORS.surfaceAlt, borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", color: msg.role === "user" ? "#fff" : COLORS.text }}>
                  {msg.role === "user" ? <div style={{ fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div> : <div>{formatMessage(msg.text)}</div>}
                </div>
                {msg.sources && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
                    <button onClick={() => setShowSources(showSources === msg.id ? null : msg.id)} style={{ fontSize: 10, color: COLORS.primary, background: COLORS.primaryLight, border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontWeight: 500 }}>
                      {showSources === msg.id ? "Hide sources" : msg.sources.length + " sources"}
                    </button>
                    {showSources === msg.id && msg.sources.map((s, si) => (
                      <span key={si} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: COLORS.surfaceAlt, color: COLORS.textSecondary, border: "1px solid " + COLORS.borderLight }}>
                        {s.title} ({s.clauses})
                      </span>
                    ))}
                  </div>
                )}
                <span style={{ fontSize: 10, color: COLORS.textMuted, alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, " + COLORS.primary + "20, " + COLORS.accent + "20)", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={14} color={COLORS.accent} /></div>
              <div style={{ background: COLORS.surfaceAlt, borderRadius: "14px 14px 14px 4px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textMuted, animation: "pulse 1s infinite" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textMuted, animation: "pulse 1s infinite 0.2s" }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textMuted, animation: "pulse 1s infinite 0.4s" }} />
                <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ padding: "0 20px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(SUGGESTED[activeMode] || SUGGESTED.general).map((q, i) => (
              <button key={i} onClick={() => handleSuggestion(q)} style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: "1px solid " + COLORS.border, background: COLORS.surface, color: COLORS.textSecondary, cursor: "pointer", textAlign: "left", lineHeight: 1.4, maxWidth: 280, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.background = COLORS.primaryLight; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.surface; }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid " + COLORS.borderLight }}>
          {/* Selected question detail */}
          {showDocPanel && typeof showDocPanel === "string" && extractedQuestions.find(q => q.id === showDocPanel) && (() => {
            var sq = extractedQuestions.find(q => q.id === showDocPanel);
            return (
              <div style={{ marginBottom: 10, background: COLORS.surfaceAlt, borderRadius: 10, padding: "12px 14px", border: "1px solid " + COLORS.borderLight }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase" }}>{sq.category}</div>
                  <button onClick={() => setShowDocPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: 0 }}><X size={12} /></button>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 8, lineHeight: 1.5 }}>{sq.question}</div>
                {sq.answered ? (
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: COLORS.success, textTransform: "uppercase", marginBottom: 4 }}>Generated Answer</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.6, maxHeight: 120, overflow: "auto" }}>{sq.answer}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <button onClick={() => { navigator.clipboard.writeText("Q: " + sq.question + "\n\nA: " + sq.answer); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, border: "1px solid " + COLORS.border, background: COLORS.surface, color: COLORS.textSecondary, cursor: "pointer" }}>Copy Answer</button>
                      <button onClick={() => { setInput(sq.question); setShowDocPanel(false); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, border: "1px solid " + COLORS.primary, background: COLORS.primaryLight, color: COLORS.primary, cursor: "pointer" }}>Regenerate</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => handleAnswerSingle(sq.id)} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, border: "none", background: COLORS.primary, color: "#fff", cursor: "pointer" }}>Generate Answer</button>
                )}
              </div>
            );
          })()}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <button onClick={() => fileInputRef.current?.click()} title="Upload RFP document" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.surfaceAlt, color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}>
              <Upload size={16} />
            </button>
            <div style={{ flex: 1 }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={activeMode === "rfp" ? "Ask about RFP questions, or upload a document for batch processing..." : "Ask about regulations, policies, controls, or RFP questions..."}
                rows={1}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.surfaceAlt, color: COLORS.text, fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
            </div>
            <button onClick={handleSend} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: input.trim() ? COLORS.primary : COLORS.border, color: "#fff", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "controls", label: "Control Library", icon: Library },
  { id: "evidence", label: "Evidence", icon: FileCheck },
  { id: "policies", label: "Policies", icon: FileText },
  { id: "gaps", label: "Gap Analysis", icon: AlertTriangle },
  { id: "ai", label: "AI Assistant", icon: MessageSquare },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "scopes", label: "Scopes", icon: Layers },
  { id: "users", label: "User Admin", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUserState, setCurrentUserState] = useState({ name: CURRENT_USER.name, role: CURRENT_USER.role });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserSwitch = (user) => {
    CURRENT_USER = { name: user.name, role: user.role };
    setCurrentUserState({ name: user.name, role: user.role });
    setShowUserMenu(false);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "controls": return <ControlLibrary />;
      case "evidence": return <EvidenceManagement />;
      case "policies": return <PolicyManagement />;
      case "users": return <UserAdmin onUserSwitch={handleUserSwitch} />;
      case "gaps": return <GapAnalysis />;
      case "ai": return <ComplianceAI />;
      case "reports": return <Reports />;
      case "scopes": return <ScopeManagement />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Outfit', -apple-system, sans-serif", background: COLORS.bg, color: COLORS.text }}>
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }
        input, select, button { font-family: inherit; }
        table { font-family: inherit; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? 68 : 240, background: COLORS.navy, color: "#fff",
        display: "flex", flexDirection: "column", transition: "width 0.2s ease",
        flexShrink: 0, overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? "20px 14px" : "20px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #3B6FED, #6366F1)", flexShrink: 0,
          }}>
            <Shield size={20} color="#fff" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>ICF</div>
              <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 0.5 }}>CONTROL FRAMEWORK</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: sidebarCollapsed ? "10px 14px" : "10px 14px",
                borderRadius: 10, border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                background: active ? "rgba(59,111,237,0.15)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "all 0.15s", fontSize: 13, fontWeight: active ? 600 : 400,
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", width: "100%",
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: 12,
          }}>
            {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          background: COLORS.surface, borderBottom: `1px solid ${COLORS.borderLight}`,
          padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>
              {NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Globe size={14} color={COLORS.textMuted} />
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>EN</span>
              <span style={{ fontSize: 10, color: COLORS.textMuted }}>|</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>NL</span>
            </div>
            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Bell size={18} color={COLORS.textMuted} />
              <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: COLORS.danger, border: `2px solid ${COLORS.surface}` }} />
            </button>
            <div style={{ width: 1, height: 24, background: COLORS.borderLight }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", position: "relative" }} onClick={() => setShowUserMenu(!showUserMenu)}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: `${COLORS.primary}15`, color: COLORS.primary, fontWeight: 600, fontSize: 12,
              }}>{currentUserState.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{currentUserState.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{currentUserState.role}</div>
              </div>
              <ChevronDown size={12} color={COLORS.textMuted} />
              {showUserMenu && (
                <div style={{ position: "absolute", top: 42, right: 0, background: COLORS.surface, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid " + COLORS.border, width: 260, zIndex: 100 }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid " + COLORS.borderLight }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase" }}>Switch User (Demo)</div>
                  </div>
                  {USERS_DATA.filter(u => u.status === "Active").map(u => (
                    <div key={u.id} onClick={() => handleUserSwitch(u)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer", background: u.name === currentUserState.name ? COLORS.primaryLight : "transparent" }}
                      onMouseEnter={e => { if (u.name !== currentUserState.name) e.currentTarget.style.background = COLORS.surfaceAlt; }}
                      onMouseLeave={e => { if (u.name !== currentUserState.name) e.currentTarget.style.background = "transparent"; }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.primary + "12", color: COLORS.primary, fontWeight: 600, fontSize: 10 }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{u.name}</div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted }}>{u.role}</div>
                      </div>
                      {u.name === currentUserState.name && <Check size={12} color={COLORS.primary} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 28 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
