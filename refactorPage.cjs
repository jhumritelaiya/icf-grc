const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'Brightlyn ICF.jsx');
const destPath = path.join(__dirname, 'apps/web/src/app/page.jsx');

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split('\n');

// We want to skip:
// 1-4: Old imports
// 5-38: Design Tokens
// 217-401: Shared Components
// 566-621: Form Field Components

const imports = `"use client";\nimport { useState, useEffect, useCallback, useMemo, useRef } from "react";\nimport { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";\nimport { Shield, LayoutDashboard, Library, FileCheck, FileText, Users, BarChart3, AlertTriangle, ChevronRight, ChevronDown, Search, Bell, Settings, LogOut, Plus, Filter, Download, Upload, Eye, Edit, Trash2, Check, X, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowRight, Layers, Globe, Lock, Activity, Zap, ChevronLeft, MoreVertical, RefreshCw, Star, BookOpen, ShieldCheck, Target, Briefcase, Database, Server, Cloud, Key, FileWarning, UserCheck, Menu, ChevronUp, Copy, MessageSquare, Send } from "lucide-react";\nimport { COLORS, STATUS_MAP, Badge, StatusBadge, StatCard, SearchBar, Button, Tabs, ProgressBar, QualityScore, TableHeader, TableCell, EmptyState, Card, Modal, FormField, FormInput, FormTextarea, FormSelect, FrameworkCheckboxes } from "@brightlyn/ui";\n\n`;

const mockData1 = lines.slice(38, 216).join('\n'); // Lines 39-216
const dashboard = lines.slice(401, 565).join('\n'); // Lines 402-565
const libraryAndRest = lines.slice(621).join('\n'); // Line 622 to EOF

const defaultExport = `\nexport default function Page() {\n  return <Dashboard />;\n}\n`;

const finalContent = `${imports}${mockData1}\n${dashboard}\n${libraryAndRest}\n/* FIXME: App Router structure requires exporting default page */\n// Export ControlLibrary as the default page temporarily for the demo\nexport default function Main() {\n  return <ControlLibrary />;\n}\n`;

fs.writeFileSync(destPath, finalContent);
console.log('apps/web/src/app/page.jsx generated successfully.');
