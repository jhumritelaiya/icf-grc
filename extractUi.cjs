const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'Brightlyn ICF.jsx');
const destPath = path.join(__dirname, 'packages/ui/src/index.jsx');

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split('\n');

// 1-4: Imports
// 5-38: Design Tokens
// 217-401: Shared Components
// 566-621: Form Field Components

const imports = `import React from "react";\nimport { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";\nimport { Shield, LayoutDashboard, Library, FileCheck, FileText, Users, BarChart3, AlertTriangle, ChevronRight, ChevronDown, Search, Bell, Settings, LogOut, Plus, Filter, Download, Upload, Eye, Edit, Trash2, Check, X, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowRight, Layers, Globe, Lock, Activity, Zap, ChevronLeft, MoreVertical, RefreshCw, Star, BookOpen, ShieldCheck, Target, Briefcase, Database, Server, Cloud, Key, FileWarning, UserCheck, Menu, ChevronUp, Copy, MessageSquare, Send } from "lucide-react";\n\n`;

const extractLines = (start, end) => {
    // Line numbers are 1-based
    return lines.slice(start - 1, end).join('\n');
};

const designTokens = extractLines(5, 38);
const sharedComponents = extractLines(217, 401);
const formComponents = extractLines(566, 621);

// Add export keywords
const exportTokens = designTokens.replace(/const COLORS =/, 'export const COLORS =').replace(/const STATUS_MAP =/, 'export const STATUS_MAP =');

const exportSharedComponents = sharedComponents
    .replace(/const Badge =/g, 'export const Badge =')
    .replace(/const StatusBadge =/g, 'export const StatusBadge =')
    .replace(/const StatCard =/g, 'export const StatCard =')
    .replace(/const SearchBar =/g, 'export const SearchBar =')
    .replace(/const Button =/g, 'export const Button =')
    .replace(/const Tabs =/g, 'export const Tabs =')
    .replace(/const ProgressBar =/g, 'export const ProgressBar =')
    .replace(/const QualityScore =/g, 'export const QualityScore =')
    .replace(/const TableHeader =/g, 'export const TableHeader =')
    .replace(/const TableCell =/g, 'export const TableCell =')
    .replace(/const EmptyState =/g, 'export const EmptyState =')
    .replace(/const Card =/g, 'export const Card =')
    .replace(/const Modal =/g, 'export const Modal =');

const exportFormComponents = formComponents
    .replace(/const FormField =/g, 'export const FormField =')
    .replace(/const FormInput =/g, 'export const FormInput =')
    .replace(/const FormTextarea =/g, 'export const FormTextarea =')
    .replace(/const FormSelect =/g, 'export const FormSelect =')
    .replace(/const FrameworkCheckboxes =/g, 'export const FrameworkCheckboxes =');

const finalContent = `${imports}\n${exportTokens}\n\n${exportSharedComponents}\n\n${exportFormComponents}`;

fs.writeFileSync(destPath, finalContent);
console.log('UI Components extracted to packages/ui/src/index.jsx');
