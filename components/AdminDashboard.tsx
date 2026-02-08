import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, PenTool, Settings, 
  Search, Bell, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Check, X, Image as ImageIcon, FileText, Send, DollarSign,
  ChevronRight, ChevronLeft, ChevronDown, Calendar, Trash2, Edit3, Filter, Download,
  GripVertical, Tag, Clock, Mail, Phone, Menu, LogOut, Layers, AlertCircle,
  ExternalLink, Eye, Upload, Save, ArrowLeft,
  Code as CodeIcon, Quote as QuoteIcon, Type as TypeIcon, ArrowUp, ArrowDown, AlignLeft,
  Briefcase, TrendingUp, TrendingDown, Minus, PieChart, Receipt,
  MoreVertical, FileCheck, Target, Inbox, Smartphone, Globe, Cloud, FolderOpen, Link as LinkIcon, Monitor, Github, Printer,
  RefreshCw, CheckCircle2, RotateCcw, Sun, Moon,
  Activity as ActivityIcon,
  Palette,
  Flag,
  BarChart3,
  Wallet,
  Archive
} from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  useDraggable, 
  useDroppable,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';

// ... (Interfaces and Mock Data remain unchanged) ...

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  type: string;
  subject?: string;
  budget?: string;
  services?: string[];
  message: string;
  date: string;
  status: string;
}

interface Lead {
  id: string;
  company: string;
  person: string;
  role: string;
  avatar: string;
  techStack: string[];
  tags: string[];
  value: string;
  timeAgo: string;
  status: string;
}

interface Activity {
  id: string;
  type: 'invoice' | 'lead' | 'project' | 'inquiry' | 'system';
  message: string;
  timestamp: Date;
  read: boolean;
}

// --- Mock Data ---

const MOCK_INVOICES = [
  { id: 'INV-2024-001', client: 'Stark Industries', date: 'Oct 24, 2024', amount: '$12,500.00', status: 'Paid', description: 'Arc Reactor Interface Design & Prototyping' },
  { id: 'INV-2024-002', client: 'Wayne Enterprises', date: 'Oct 22, 2024', amount: '$8,400.00', status: 'Pending', description: 'Batcomputer Security Audit & System Hardening' },
  { id: 'INV-2024-003', client: 'Acme Corp', date: 'Oct 15, 2024', amount: '$3,200.00', status: 'Overdue', description: 'Roadrunner Tracking Algorithm' },
  { id: 'INV-2024-004', client: 'Cyberdyne Systems', date: 'Oct 10, 2024', amount: '$45,000.00', status: 'Paid', description: 'Neural Net Processor Development (Phase 1)' },
  { id: 'INV-2024-005', client: 'Massive Dynamic', date: 'Oct 05, 2024', amount: '$1,500.00', status: 'Paid', description: 'Consultation: Pattern Recognition' },
  { id: 'INV-2024-006', client: 'Oscorp', date: 'Sep 28, 2024', amount: '$6,750.00', status: 'Paid', description: 'Web Crawler Bot Implementation' },
  { id: 'INV-2024-007', client: 'LexCorp', date: 'Sep 25, 2024', amount: '$18,200.00', status: 'Pending', description: 'Kryptonite Detection System UI' },
  { id: 'INV-2024-008', client: 'Umbrella Corp', date: 'Sep 20, 2024', amount: '$5,400.00', status: 'Paid', description: 'T-Virus Containment Dashboard' },
];

const KANBAN_COLUMNS = ["New", "Contacted", "Proposal", "Won", "Lost"];

const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    company: 'Stark Ind',
    person: 'Tony Stark',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    techStack: ['React', 'Node.js'],
    tags: ['Referral'],
    value: '$120,000',
    timeAgo: '4h ago',
    status: 'New'
  },
  {
    id: 'l2',
    company: 'Daily Planet',
    person: 'Clark Kent',
    role: 'Journalist',
    avatar: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=100&auto=format&fit=crop',
    techStack: ['Wordpress', 'PHP'],
    tags: ['Media'],
    value: '$15,000',
    timeAgo: '5d ago',
    status: 'New'
  },
  {
    id: 'l3',
    company: 'Wayne Ent',
    person: 'Bruce Wayne',
    role: 'Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    techStack: ['AWS', 'Docker'],
    tags: ['SaaS', 'Urgent'],
    value: '$85,000',
    timeAgo: '1d ago',
    status: 'Contacted'
  },
  {
    id: 'l4',
    company: 'Acme Corp',
    person: 'John Doe',
    role: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    techStack: ['Python', 'TensorFlow'],
    tags: ['Enterprise', 'High Priority'],
    value: '$45,000',
    timeAgo: '2d ago',
    status: 'Proposal'
  },
  {
    id: 'l5',
    company: 'Themyscira Inc',
    person: 'Diana Prince',
    role: 'Head of Ops',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    techStack: ['Java', 'Angular'],
    tags: ['Gov', 'Enterprise'],
    value: '$250,000',
    timeAgo: '1w ago',
    status: 'Won'
  },
  {
    id: 'l6',
    company: 'LexCorp',
    person: 'Lex Luthor',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    techStack: ['Legacy', 'On-Prem'],
    tags: ['Budget Constraints'],
    value: '$10,000',
    timeAgo: '3d ago',
    status: 'Lost'
  }
];

// --- Navigation Configuration ---
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'Workspace' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, group: 'Workspace' },
  { id: 'crm', label: 'CRM & Leads', icon: Users, group: 'Workspace' },
  { id: 'finance', label: 'Finance', icon: CreditCard, group: 'Workspace' },
  { id: 'cms', label: 'CMS', icon: PenTool, group: 'Content' },
  { id: 'settings', label: 'Site Visuals', icon: Settings, group: 'System' },
];

// --- Components ---

const SidebarItem: React.FC<{ icon: any, label: string, active: boolean, collapsed: boolean, onClick: () => void }> = ({ icon: Icon, label, active, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`
        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden
        ${active 
            ? 'bg-primary text-background shadow-md' 
            : 'text-secondary hover:text-primary hover:bg-surface/80'
        }
        ${collapsed ? 'justify-center' : ''}
    `}
    title={collapsed ? label : undefined}
  >
    <Icon size={20} className={`shrink-0 z-10 transition-colors duration-300 ${active ? 'text-background' : 'group-hover:text-primary'}`} />
    <span className={`text-sm font-medium whitespace-nowrap z-10 transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
        {label}
    </span>
  </button>
);

const StatCard: React.FC<{ label: string, value: string, trend?: string, positive?: boolean, icon?: any }> = ({ label, value, trend, positive, icon: Icon }) => (
  <div className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="flex justify-between items-start mb-2 relative z-10">
      <span className="text-secondary text-xs font-bold uppercase tracking-wider">{label}</span>
      {trend && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-display font-bold text-primary relative z-10">{value}</div>
    {Icon && (
        <div className="absolute -bottom-4 -right-4 text-border opacity-50 group-hover:text-accent/20 group-hover:scale-110 transition-all duration-500">
            <Icon size={80} strokeWidth={1} />
        </div>
    )}
  </div>
);

// ... (Other components: ImageUploadControl, KanbanCardInner, DraggableKanbanCard, DroppableColumn remain unchanged) ...
// (Re-using ImageUploadControl, KanbanCardInner, DraggableKanbanCard, DroppableColumn from previous context)
// [Code for ImageUploadControl]
const ImageUploadControl: React.FC<{ 
    value: string, 
    onChange: (val: string) => void, 
    label: string, 
    className?: string 
}> = ({ value, onChange, label, className = '' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'selecting' | 'url-input'>('idle');
    const [urlInput, setUrlInput] = useState('');

    useEffect(() => {
        if (!value) setStatus('idle');
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onChange(reader.result);
                    setStatus('idle');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput) {
            onChange(urlInput);
            setStatus('idle');
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">{label}</label>
            
            {value ? (
                <div className="relative group w-full h-56 bg-[#09090B] border border-border rounded-xl overflow-hidden shadow-sm">
                    <img src={value} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => { onChange(''); setStatus('idle'); }} 
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-sm"
                        >
                            <Trash2 size={16} /> Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`
                    border border-dashed border-border rounded-xl bg-[#09090B] hover:bg-surface/50 transition-all duration-300 relative overflow-hidden
                    ${status === 'idle' ? 'h-32 cursor-pointer group' : 'p-6'}
                `}>
                    
                    {/* Idle State */}
                    {status === 'idle' && (
                        <div 
                            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                            onClick={() => setStatus('selecting')}
                        >
                            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary group-hover:scale-110 group-hover:border-accent group-hover:text-accent transition-all">
                                <ImageIcon size={20} />
                            </div>
                            <span className="text-xs font-medium text-secondary group-hover:text-primary transition-colors">Click to upload image</span>
                        </div>
                    )}

                    {/* Selection State */}
                    {status === 'selecting' && (
                        <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-primary">Select Source</span>
                                <button onClick={(e) => { e.stopPropagation(); setStatus('idle'); }} className="text-secondary hover:text-primary"><X size={16} /></button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface/30 hover:bg-surface hover:border-accent/50 hover:text-accent transition-all"
                                >
                                    <FolderOpen size={24} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Computer</span>
                                </button>
                                <button 
                                    onClick={() => alert("Google Drive integration requires API configuration. Using file picker instead for demo.")}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface/30 hover:bg-surface hover:border-blue-400/50 hover:text-blue-400 transition-all"
                                >
                                    <Cloud size={24} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Drive</span>
                                </button>
                                <button 
                                    onClick={() => setStatus('url-input')}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface/30 hover:bg-surface hover:border-green-400/50 hover:text-green-400 transition-all"
                                >
                                    <LinkIcon size={24} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">URL</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* URL Input State */}
                    {status === 'url-input' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-primary">Paste Image URL</span>
                                <button onClick={() => setStatus('selecting')} className="text-xs text-secondary hover:text-primary">Back</button>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-background border border-border rounded-lg p-3 text-sm focus:border-accent outline-none"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                />
                                <button 
                                    onClick={handleUrlSubmit}
                                    className="px-4 py-2 bg-accent text-black rounded-lg font-bold text-xs hover:bg-white transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </div>
            )}
        </div>
    );
};

// [Code for KanbanCardInner]
const KanbanCardInner: React.FC<{ lead: Lead, isOverlay?: boolean, onClick?: () => void, onEdit?: (lead: Lead) => void, onDelete?: (id: string) => void }> = ({ lead, isOverlay, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
        onClick={onClick}
        className={`
            bg-[#121212] border border-[#27272A] rounded-xl p-4 shadow-sm transition-all group relative
            ${isOverlay ? 'cursor-grabbing border-accent shadow-xl rotate-3 scale-105 z-50' : 'cursor-grab hover:border-accent/30 hover:bg-[#1a1a1c]'}
        `}
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 min-w-0 pr-2">
                <img src={lead.avatar} alt={lead.person} className="w-10 h-10 rounded-full object-cover border border-border/20 shrink-0" />
                <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{lead.company}</h4>
                    <p className="text-xs text-[#A1A1AA] truncate">{lead.person}</p>
                    <p className="text-[10px] text-[#71717A] truncate uppercase tracking-tight">{lead.role}</p>
                </div>
            </div>

            {/* Menu Action */}
            {!isOverlay && (
                <div className="relative shrink-0">
                    <button 
                        onPointerDown={(e) => e.stopPropagation()} 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="p-1 text-[#71717A] hover:text-white rounded hover:bg-[#27272A] transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-[#18181B] border border-[#27272A] rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button 
                                    onPointerDown={(e) => e.stopPropagation()} 
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(lead); }}
                                    className="w-full text-left px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-[#27272A] flex items-center gap-2"
                                >
                                    <Edit3 size={12} /> Edit
                                </button>
                                <button 
                                    onPointerDown={(e) => e.stopPropagation()} 
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(lead.id); }}
                                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#27272A] flex items-center gap-2"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
        {lead.techStack?.map(tech => (
            <span key={tech} className="px-2 py-0.5 bg-[#1D283A] text-[#60A5FA] text-[10px] font-bold rounded">
            {tech}
            </span>
        ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
        {lead.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-[#27272A] text-[#D4D4D8] text-[10px] font-medium rounded">
            {tag}
            </span>
        ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#27272A] pt-3 mt-1">
        <span className="text-sm font-bold text-white">{lead.value}</span>
        <div className="flex items-center gap-1 text-[10px] text-[#71717A]">
            <Clock size={10} />
            {lead.timeAgo}
        </div>
        </div>
    </div>
  );
};

const DraggableKanbanCard: React.FC<{ lead: Lead, onEdit?: (lead: Lead) => void, onDelete?: (id: string) => void, onClick?: (lead: Lead) => void }> = ({ lead, onEdit, onDelete, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={isDragging ? 'opacity-30' : ''}>
      <KanbanCardInner lead={lead} onEdit={onEdit} onDelete={onDelete} onClick={() => onClick?.(lead)} />
    </div>
  );
};

const DroppableColumn: React.FC<{ 
    id: string, 
    children: React.ReactNode, 
    title: string, 
    count: number, 
    totalVal: number,
    onAddLead: () => void 
}> = ({ 
    id, children, title, count, totalVal, onAddLead 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
        ref={setNodeRef} 
        className={`w-[300px] shrink-0 flex flex-col rounded-xl transition-colors h-full ${isOver ? 'bg-white/5' : 'bg-transparent'}`}
    >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 px-1">
            <span className="font-bold text-sm text-primary">{title}</span>
            <span className="text-xs text-[#71717A] px-1.5 py-0.5 bg-surface border border-border/40 rounded-md font-medium">{count}</span>
            <div className="ml-auto text-xs font-mono text-[#71717A]">
                ${totalVal.toLocaleString()}
            </div>
        </div>
        
        {/* Drop Area */}
        <div className="flex-1 space-y-3 rounded-xl min-h-[500px]">
            {children}
            {count === 0 && (
                <div className="h-24 border border-dashed border-[#27272A] rounded-xl flex items-center justify-center text-[#3f3f46] text-xs">
                    Drop items here
                </div>
            )}
             <button onClick={onAddLead} className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-[#71717A] hover:text-accent border border-dashed border-[#27272A] rounded-xl hover:border-accent/40 transition-all group">
                <Plus size={12} className="group-hover:scale-125 transition-transform" /> Add Lead
            </button>
        </div>
    </div>
  );
};

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  // ... (State and Effects remain unchanged) ...
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // --- Dashboard State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'crm' | 'finance' | 'inbox' | 'settings'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // isMobileMenuOpen is no longer used for navigation drawer, but kept for compatibility or unused
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // --- Data State ---
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pipelineItems, setPipelineItems] = useState<Lead[]>(MOCK_LEADS);
  const [invoiceList, setInvoiceList] = useState(MOCK_INVOICES);
  const [adminProjects, setAdminProjects] = useState<any[]>([]);
  
  // --- Activity State ---
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // --- Settings State ---
  const [siteConfig, setSiteConfig] = useState({
      heroAvatar: '',
      homeAboutImage: '',
      aboutHero: ''
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // --- Selection & Modals ---
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Lead Modal
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLeadFormData, setNewLeadFormData] = useState({
    company: '', person: '', role: '', value: '', techStack: '', tags: ''
  });

  // Invoice State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [invoiceFormData, setInvoiceFormData] = useState({
      client: '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      description: ''
  });

  // CMS State
  const [cmsEditorOpen, setCmsEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [cmsFilter, setCmsFilter] = useState('All');
  const [cmsForm, setCmsForm] = useState({
    title: '', 
    subtitle: '', 
    shortDescription: '', // For Card View
    role: '', 
    client: '', 
    year: '2025', 
    duration: '',
    category: 'Select Category', 
    techStack: [] as string[], 
    heroImage: '', 
    liveLink: '',
    sourceLink: '',
    challenge: '', 
    solution: '',
    results: [] as { id: string, value: string, label: string, trend: string, trendDirection: 'up' | 'down' | 'neutral' }[], 
    contentBlocks: [] as { id: string, type: 'text' | 'image', title: string, body?: string, image?: string }[], 
    tagInput: ''
  });
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);
  const [activeMetric, setActiveMetric] = useState<{id?: string, value: string, label: string, trend: string, trendDirection: 'up' | 'down' | 'neutral'} | null>(null);
  const [activeBlock, setActiveBlock] = useState<{id?: string, type: 'text' | 'image', title: string, body: string, image: string} | null>(null);

  // Filters
  const [filterType, setFilterType] = useState('All');
  const [inboxFilter, setInboxFilter] = useState('All');

  // Deletion States
  const [inquiryDeleteId, setInquiryDeleteId] = useState<string | null>(null);

  // DnD Sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // --- Effects ---

  useEffect(() => {
    // Check session
    if (sessionStorage.getItem('sam_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }

    // Load Inquiries
    const storedInquiries = localStorage.getItem('sam_portfolio_inquiries');
    if (storedInquiries) setInquiries(JSON.parse(storedInquiries));

    // Load Projects (Summary List)
    const storedProjects = localStorage.getItem('site_projects');
    if (storedProjects) setAdminProjects(JSON.parse(storedProjects));
    
    // Load Site Config
    const storedConfig = localStorage.getItem('site_config');
    if (storedConfig) {
        try {
            setSiteConfig(JSON.parse(storedConfig));
        } catch (e) { console.error("Config load error", e); }
    }

    // Check Theme
    if (document.documentElement.classList.contains('dark')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Initialize Activity Feed with Seed Data
    const initialActivities: Activity[] = [];
    
    // Seed from Invoices
    MOCK_INVOICES.forEach(inv => {
        initialActivities.push({
            id: `act-inv-${inv.id}`,
            type: 'invoice',
            message: `Invoice ${inv.id} for ${inv.client} was marked as ${inv.status}`,
            timestamp: new Date(inv.date),
            read: true
        });
    });

    // Seed from Leads
    MOCK_LEADS.forEach((lead, index) => {
        // Stagger dates slightly for realism
        const date = new Date();
        date.setHours(date.getHours() - (index * 5)); 
        
        initialActivities.push({
            id: `act-lead-${lead.id}`,
            type: 'lead',
            message: `New opportunity: ${lead.company} (${lead.value})`,
            timestamp: date,
            read: true
        });
    });

    // Sort descending
    initialActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivities(initialActivities);

  }, []);

  // Close notifications on click outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
              setIsNotificationsOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers --- (All handlers remain unchanged)
  // ... (formatTimeAgo, addActivity, handleLogin, handleSaveConfig, handleResetConfig, toggleTheme, getGreeting, formattedTotalRevenue, lead/invoice/cms handlers) ...
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const addActivity = (type: Activity['type'], message: string) => {
      const newActivity: Activity = {
          id: `act-${Date.now()}`,
          type,
          message,
          timestamp: new Date(),
          read: false
      };
      setActivities(prev => [newActivity, ...prev]);
      setHasUnread(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { 
        sessionStorage.setItem('sam_admin_auth', 'true');
        setIsAuthenticated(true);
    } else {
        alert("Invalid Access Key");
    }
  };

  const handleSaveConfig = () => {
      setIsSavingConfig(true);
      setTimeout(() => {
          localStorage.setItem('site_config', JSON.stringify(siteConfig));
          window.dispatchEvent(new CustomEvent('site-config-update', { detail: siteConfig }));
          setIsSavingConfig(false);
          setConfigSaveSuccess(true);
          addActivity('system', 'Site visual configuration updated via admin panel');
          setTimeout(() => setConfigSaveSuccess(false), 3000);
      }, 800);
  };

  const handleResetConfig = () => {
      if(confirm("Are you sure you want to reset all site visuals to their default state?")) {
          const defaults = { heroAvatar: '', homeAboutImage: '', aboutHero: '' };
          setSiteConfig(defaults);
          localStorage.setItem('site_config', JSON.stringify(defaults));
          window.dispatchEvent(new CustomEvent('site-config-update', { detail: defaults }));
          addActivity('system', 'System visuals reset to default');
      }
  };

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedTotalRevenue = useMemo(() => {
    const total = invoiceList.reduce((acc, curr) => {
        if (curr.status === 'Paid') {
            return acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g,""));
        }
        return acc;
    }, 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  }, [invoiceList]);

  // Lead handlers
  const handleAddLead = () => {
    if (editingId) {
        setPipelineItems(prev => prev.map(item => item.id === editingId ? {
            ...item,
            company: newLeadFormData.company,
            person: newLeadFormData.person,
            role: newLeadFormData.role,
            value: newLeadFormData.value,
            techStack: newLeadFormData.techStack.split(',').map(s => s.trim()).filter(Boolean),
            tags: newLeadFormData.tags.split(',').map(s => s.trim()).filter(Boolean),
        } : item));
        addActivity('lead', `Updated lead details for ${newLeadFormData.company}`);
    } else {
        const newLead: Lead = {
            id: `l-${Date.now()}`,
            company: newLeadFormData.company,
            person: newLeadFormData.person,
            role: newLeadFormData.role,
            value: newLeadFormData.value,
            techStack: newLeadFormData.techStack.split(',').map(s => s.trim()).filter(Boolean),
            tags: newLeadFormData.tags.split(',').map(s => s.trim()).filter(Boolean),
            avatar: `https://ui-avatars.com/api/?name=${newLeadFormData.person}&background=random`,
            status: 'New',
            timeAgo: 'Just now'
        };
        setPipelineItems([...pipelineItems, newLead]);
        addActivity('lead', `New lead captured: ${newLeadFormData.company} (${newLeadFormData.value})`);
    }
    setIsAddLeadModalOpen(false);
    setEditingId(null);
  };

  const handleEditLead = (lead: Lead) => {
      setEditingId(lead.id);
      setNewLeadFormData({
          company: lead.company,
          person: lead.person,
          role: lead.role,
          value: lead.value,
          techStack: lead.techStack.join(', '),
          tags: lead.tags.join(', ')
      });
      setIsAddLeadModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
      if(confirm("Are you sure?")) {
          setPipelineItems(prev => prev.filter(p => p.id !== id));
          addActivity('lead', `Deleted lead ID: ${id}`);
          if (selectedLead?.id === id) setSelectedLead(null);
      }
  };

  const updateLeadStatus = (id: string, newStatus: string) => {
      const updated = pipelineItems.map(l => l.id === id ? { ...l, status: newStatus } : l);
      setPipelineItems(updated);
      if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
      }
      addActivity('lead', `Moved lead to ${newStatus}`);
  };

  // Invoice Handlers
  const handleOpenCreateInvoice = () => {
      setEditingInvoiceId(null);
      setInvoiceFormData({ client: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0], description: '' });
      setIsInvoiceModalOpen(true);
  };

  const handleOpenEditInvoice = (inv: any) => {
      setEditingInvoiceId(inv.id);
      const dateObj = new Date(inv.date);
      const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      setInvoiceFormData({
          client: inv.client,
          amount: inv.amount.replace(/[^0-9.]/g, ''),
          status: inv.status,
          date: dateStr,
          description: inv.description || ''
      });
      setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = () => {
      const displayDate = new Date(invoiceFormData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const displayAmount = invoiceFormData.amount.startsWith('$') ? invoiceFormData.amount : `$${invoiceFormData.amount}`;

      if (editingInvoiceId) {
          setInvoiceList(prev => prev.map(inv => inv.id === editingInvoiceId ? {
              ...inv,
              client: invoiceFormData.client,
              date: displayDate,
              amount: displayAmount,
              status: invoiceFormData.status,
              description: invoiceFormData.description
          } : inv));
          addActivity('invoice', `Updated invoice ${editingInvoiceId} for ${invoiceFormData.client}`);
      } else {
          const newInvoice = {
              id: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              client: invoiceFormData.client,
              date: displayDate,
              amount: displayAmount,
              status: invoiceFormData.status,
              description: invoiceFormData.description
          };
          setInvoiceList([newInvoice, ...invoiceList]);
          addActivity('invoice', `Created new invoice ${newInvoice.id} for ${invoiceFormData.client} (${displayAmount})`);
      }
      setIsInvoiceModalOpen(false);
  };

  const handleToggleInvoiceStatus = (e: React.MouseEvent, id: string, currentStatus: string) => {
      e.stopPropagation();
      const statuses = ['Pending', 'Paid', 'Overdue'];
      const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
      setInvoiceList(prev => prev.map(inv => inv.id === id ? { ...inv, status: nextStatus } : inv));
      addActivity('invoice', `Invoice ${id} marked as ${nextStatus}`);
  };

  const handleDeleteInvoice = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm("Are you sure you want to permanently delete this invoice? This action cannot be undone.")) {
          setInvoiceList(prev => prev.filter(i => i.id !== id));
          addActivity('invoice', `Deleted invoice ${id}`);
      }
  };

  // CMS Handlers
  const handleCmsChange = (field: keyof typeof cmsForm, value: any) => {
      setCmsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && cmsForm.tagInput.trim()) {
          e.preventDefault();
          if (!cmsForm.techStack.includes(cmsForm.tagInput.trim())) {
              setCmsForm(prev => ({ ...prev, techStack: [...prev.techStack, prev.tagInput.trim()], tagInput: '' }));
          }
      }
  };

  const handleRemoveTag = (tag: string) => {
      setCmsForm(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tag) }));
  };

  const loadProjectForEdit = (projectId: number | string) => {
    setEditingProjectId(projectId);
    const storedCaseStudies = JSON.parse(localStorage.getItem('site_case_studies') || '{}');
    const fullStudy = storedCaseStudies[projectId];

    if (fullStudy) {
        setCmsForm({
            title: fullStudy.title || '',
            subtitle: fullStudy.subtitle || '',
            shortDescription: fullStudy.description || '',
            role: Array.isArray(fullStudy.role) ? fullStudy.role.join(', ') : fullStudy.role || '',
            client: fullStudy.client || '',
            year: fullStudy.year || '',
            duration: fullStudy.duration || '',
            category: fullStudy.category || 'Select Category',
            techStack: fullStudy.techStack || [],
            heroImage: fullStudy.heroImage || '',
            liveLink: fullStudy.links?.live || '',
            sourceLink: fullStudy.links?.github || '',
            challenge: fullStudy.challenge || '',
            solution: fullStudy.solution || '',
            results: fullStudy.results || [],
            contentBlocks: fullStudy.content || [],
            tagInput: ''
        });
    } else {
        const projectSummary = adminProjects.find(p => p.id === projectId);
        if (projectSummary) {
             setCmsForm({
                title: projectSummary.title,
                subtitle: '',
                shortDescription: projectSummary.description,
                role: '',
                client: '',
                year: '',
                duration: '',
                category: projectSummary.category,
                techStack: projectSummary.tags || [],
                heroImage: projectSummary.image,
                liveLink: projectSummary.links?.live || '',
                sourceLink: projectSummary.links?.github || '',
                challenge: '',
                solution: '',
                results: [],
                contentBlocks: [],
                tagInput: ''
             });
        }
    }
    setCmsEditorOpen(true);
  };

  const handleSaveProject = () => {
    if (!cmsForm.title) { alert("Title is required"); return; }
    const newId = editingProjectId || Date.now();
    const projectSummary = {
        id: newId,
        title: cmsForm.title,
        category: cmsForm.category,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        description: cmsForm.shortDescription,
        image: cmsForm.heroImage,
        tags: cmsForm.techStack,
        links: { live: cmsForm.liveLink, github: cmsForm.sourceLink },
        status: 'Published'
    };
    const caseStudyDetail = {
        id: newId,
        title: cmsForm.title,
        subtitle: cmsForm.subtitle,
        category: cmsForm.category,
        client: cmsForm.client,
        year: cmsForm.year,
        duration: cmsForm.duration,
        role: cmsForm.role.split(',').map(s => s.trim()),
        techStack: cmsForm.techStack,
        heroImage: cmsForm.heroImage,
        links: { live: cmsForm.liveLink, github: cmsForm.sourceLink },
        challenge: cmsForm.challenge,
        solution: cmsForm.solution,
        results: cmsForm.results,
        content: cmsForm.contentBlocks,
        description: cmsForm.shortDescription,
        nextId: adminProjects[0]?.id || 1
    };

    let updatedProjects;
    if (editingProjectId) {
        updatedProjects = adminProjects.map(p => p.id === editingProjectId ? projectSummary : p);
    } else {
        updatedProjects = [projectSummary, ...adminProjects];
    }
    setAdminProjects(updatedProjects);
    localStorage.setItem('site_projects', JSON.stringify(updatedProjects));

    const storedStudies = JSON.parse(localStorage.getItem('site_case_studies') || '{}');
    storedStudies[newId] = caseStudyDetail;
    localStorage.setItem('site_case_studies', JSON.stringify(storedStudies));

    setCmsEditorOpen(false);
    setEditingProjectId(null);
    addActivity('project', `Project "${cmsForm.title}" saved successfully`);
  };

  const saveMetric = () => {
      if (!activeMetric) return;
      setCmsForm(prev => ({
          ...prev,
          results: activeMetric.id 
            ? prev.results.map(r => r.id === activeMetric.id ? activeMetric : r) as any
            : [...prev.results, { ...activeMetric, id: `res-${Date.now()}` }] as any
      }));
      setActiveMetric(null);
  };

  const deleteMetric = (id: string) => {
      setCmsForm(prev => ({
          ...prev,
          results: prev.results.filter(r => r.id !== id)
      }));
  };

  const saveBlock = () => {
      if (!activeBlock) return;
      setCmsForm(prev => ({
          ...prev,
          contentBlocks: activeBlock.id
            ? prev.contentBlocks.map(b => b.id === activeBlock.id ? activeBlock : b) as any
            : [...prev.contentBlocks, { ...activeBlock, id: `blk-${Date.now()}` }] as any
      }));
      setActiveBlock(null);
  };

  const deleteBlock = (id: string) => {
      setCmsForm(prev => ({
          ...prev,
          contentBlocks: prev.contentBlocks.filter(b => b.id !== id)
      }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (over && active.id !== over.id) {
        if (KANBAN_COLUMNS.includes(over.id as string)) {
            setPipelineItems((items) => 
                items.map(item => 
                    item.id === active.id ? { ...item, status: over.id as string } : item
                )
            );
            const movedLead = pipelineItems.find(l => l.id === active.id);
            if (movedLead) addActivity('lead', `Lead ${movedLead.company} moved to ${over.id}`);
        }
    }
  };

  const activeLead = activeDragId ? pipelineItems.find(p => p.id === activeDragId) : null;

  // --- Inbox Handlers ---
  const handleDeleteInquiryConfirm = () => {
      if (inquiryDeleteId) {
          const updated = inquiries.filter(i => i.id !== inquiryDeleteId);
          setInquiries(updated);
          localStorage.setItem('sam_portfolio_inquiries', JSON.stringify(updated));
          setInquiryDeleteId(null);
          addActivity('inquiry', 'Deleted message');
          if (selectedInquiry?.id === inquiryDeleteId) setSelectedInquiry(null);
      }
  };

  const updateInquiryStatus = (id: string, newStatus: string) => {
      const updated = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
      setInquiries(updated);
      localStorage.setItem('sam_portfolio_inquiries', JSON.stringify(updated));
      if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
  };

  const getFilteredInquiries = () => {
      if (inboxFilter === 'Unread') return inquiries.filter(i => i.status === 'New');
      if (inboxFilter === 'Project') return inquiries.filter(i => i.type === 'Project Request');
      return inquiries;
  };

  const getFilteredProjects = () => {
      if (cmsFilter === 'Published') return adminProjects.filter(p => p.status === 'Published');
      if (cmsFilter === 'Draft') return adminProjects.filter(p => p.status !== 'Published');
      return adminProjects;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <Settings size={24} />
              </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-2 text-center">Portfolio OS</h2>
          <p className="text-secondary text-sm text-center mb-8">Enter your secure key to access the control center.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Key"
                className="w-full bg-background border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-primary text-background py-3 rounded-lg font-bold hover:bg-accent hover:text-black transition-colors">
              Initialize Session
            </button>
            <button type="button" onClick={onExit} className="w-full text-sm text-secondary hover:text-primary mt-4">
              Return to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0C0E] text-primary font-body flex flex-col lg:flex-row overflow-hidden transition-colors duration-300 relative">
      
      {/* --- Mobile/Tablet Header & Navigation --- */}
      <div className="lg:hidden flex flex-col w-full z-50 bg-background/95 backdrop-blur-md border-b border-border sticky top-0">
          <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-background rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0">SA</div>
                  <span className="font-display font-bold text-sm tracking-tight">Portfolio OS</span>
              </div>
              <div className="flex items-center gap-2">
                  <button 
                      onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-2 text-secondary hover:text-primary rounded-full transition-colors"
                  >
                      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </button>
                  <button 
                      onClick={() => {
                          sessionStorage.removeItem('sam_admin_auth');
                          onExit();
                      }}
                      className="p-2 text-red-400 hover:text-red-500 rounded-full transition-colors"
                  >
                      <LogOut size={18} />
                  </button>
              </div>
          </div>
          
          {/* Horizontal Scroll Menu */}
          <nav className="flex overflow-x-auto items-center gap-2 px-4 pb-3 scrollbar-hide">
              {NAV_ITEMS.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`
                          flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                          ${activeTab === item.id 
                              ? 'bg-accent text-black border-accent shadow-sm' 
                              : 'bg-surface text-secondary border-transparent hover:text-primary hover:bg-surface/80'
                          }
                      `}
                  >
                      <item.icon size={14} />
                      {item.label}
                  </button>
              ))}
          </nav>
      </div>

      {/* --- Desktop Sidebar --- */}
      <aside 
        className={`
            hidden lg:flex
            flex-col h-screen z-50 bg-surface/30 backdrop-blur-xl border-r border-border transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]'}
        `}
      >
        <div className={`flex items-center justify-between h-20 px-6 border-b border-border/40 ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary text-background rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-lg">SA</div>
                <div className={`overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <span className="font-display font-bold text-base tracking-tight whitespace-nowrap">Portfolio OS</span>
                </div>
            </div>
        </div>

        <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-[4.5rem] w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-secondary hover:text-primary z-50 shadow-sm transition-transform hover:scale-110"
        >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
            {['Workspace', 'Content', 'System'].map((group) => {
                const groupItems = NAV_ITEMS.filter(item => item.group === group);
                if (groupItems.length === 0) return null;
                
                return (
                    <div key={group} className="space-y-2">
                        {!isSidebarCollapsed && (
                            <p className="px-3 text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 opacity-60">{group}</p>
                        )}
                        <nav className="space-y-1">
                            {groupItems.map(item => (
                                <SidebarItem 
                                    key={item.id} 
                                    icon={item.icon} 
                                    label={item.label} 
                                    active={activeTab === item.id} 
                                    collapsed={isSidebarCollapsed} 
                                    onClick={() => setActiveTab(item.id as any)} 
                                />
                            ))}
                        </nav>
                    </div>
                );
            })}
        </div>

        <div className="mt-auto border-t border-border/40 bg-surface/50 p-4">
            <div className={`flex items-center gap-3 transition-all ${isSidebarCollapsed ? 'justify-center flex-col' : 'justify-between'}`}>
                <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-background font-bold text-xs shrink-0 shadow-lg shadow-accent/20">
                        SA
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-primary truncate">Sam Ayebanate</p>
                            <p className="text-[10px] text-secondary truncate">Administrator</p>
                        </div>
                    )}
                </div>

                <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
                     <button 
                        onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-1.5 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors"
                        title="Toggle Theme"
                     >
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                     </button>
                     <button 
                        onClick={() => {
                            sessionStorage.removeItem('sam_admin_auth');
                            onExit();
                        }}
                        className="p-1.5 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Log Out"
                     >
                        <LogOut size={16} />
                     </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 h-[calc(100vh-110px)] lg:h-screen overflow-y-auto transition-all duration-300 ease-in-out bg-[#F9FAFB] dark:bg-[#0B0C0E]"
      >
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto h-full flex flex-col">
            {/* Header for Desktop only (since mobile has its own) */}
            {!cmsEditorOpen && activeTab !== 'inbox' && (
                <header className="hidden lg:flex flex-row items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                     <div>
                        <h1 className="text-2xl font-bold text-primary capitalize flex items-center gap-2">
                            {activeTab === 'crm' ? 'Pipeline' : activeTab === 'cms' ? 'Content Management' : activeTab === 'settings' ? 'Site Visuals' : activeTab}
                        </h1>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative group w-64">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={14} />
                      <input type="text" placeholder="Search..." className="bg-surface border border-border rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-full transition-all" />
                    </div>
                    <div className="h-6 w-px bg-border mx-1 shrink-0"></div>
                    
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                if (!isNotificationsOpen) setHasUnread(false);
                            }}
                            className="w-9 h-9 rounded-lg hover:bg-surface border border-transparent hover:border-border flex items-center justify-center text-secondary transition-colors relative"
                        >
                          <Bell size={18} />
                          {hasUnread && (
                              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background"></span>
                          )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-background/50">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Notifications</h4>
                                    <span className="text-[10px] text-secondary">{activities.length} Events</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {activities.length === 0 ? (
                                        <div className="p-8 text-center text-secondary text-xs">No recent activity.</div>
                                    ) : (
                                        activities.slice(0, 10).map(act => (
                                            <div key={act.id} className="p-3 border-b border-border/50 hover:bg-background/50 transition-colors flex gap-3">
                                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                    act.type === 'invoice' ? 'bg-green-500/10 text-green-500' :
                                                    act.type === 'lead' ? 'bg-blue-500/10 text-blue-500' :
                                                    act.type === 'project' ? 'bg-purple-500/10 text-purple-500' :
                                                    'bg-secondary/10 text-secondary'
                                                }`}>
                                                    {act.type === 'invoice' ? <CreditCard size={12} /> : 
                                                     act.type === 'lead' ? <Users size={12} /> : 
                                                     act.type === 'project' ? <PenTool size={12} /> : 
                                                     <ActivityIcon size={12} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-primary leading-snug">{act.message}</p>
                                                    <p className="text-[10px] text-secondary mt-1">{formatTimeAgo(act.timestamp)}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                </header>
            )}

            {/* TAB: OVERVIEW - content unchanged */}
            {/* ... */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500 pb-10">
                {/* ... (Overview contents) ... */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">{getGreeting()}, Sam.</h2>
                        <p className="text-secondary mt-1 text-sm md:text-base">Here is what's happening in your workspace today.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs font-mono bg-surface border border-border px-3 py-1 rounded text-secondary">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Revenue" value={formattedTotalRevenue} trend="+12.5%" positive />
                  <StatCard label="Active Leads" value={(inquiries?.length || 0 + pipelineItems?.length || 0).toString()} trend="+3" positive />
                  <StatCard label="Projects" value={adminProjects.length.toString()} />
                  <StatCard label="Avg. Deal Size" value="$5.2k" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-primary">Revenue Trend</h3>
                                <select className="bg-background border border-border text-xs rounded px-2 py-1 outline-none">
                                    <option>Last 6 Months</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {[
                                    { label: 'Jan', value: '$12k', height: '30%' },
                                    { label: 'Feb', value: '$18k', height: '45%' },
                                    { label: 'Mar', value: '$15k', height: '35%' },
                                    { label: 'Apr', value: '$25k', height: '60%' },
                                    { label: 'May', value: '$32k', height: '75%' },
                                    { label: 'Jun', value: '$28k', height: '65%' },
                                ].map((bar, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                        <div 
                                            className="w-full bg-accent/20 border-t-2 border-accent rounded-t-sm transition-all duration-500 relative group-hover:bg-accent/40"
                                            style={{ height: bar.height }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {bar.value}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-secondary font-mono uppercase">{bar.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-primary mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button onClick={handleOpenCreateInvoice} className="p-4 bg-surface border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <span className="text-xs font-bold">New Invoice</span>
                                </button>
                                <button onClick={() => { setIsAddLeadModalOpen(true); setEditingId(null); setNewLeadFormData({ company: '', person: '', role: '', value: '', techStack: '', tags: '' }); }} className="p-4 bg-surface border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-xs font-bold">Add Lead</span>
                                </button>
                                <button onClick={() => { setEditingProjectId(null); loadProjectForEdit(0); }} className="p-4 bg-surface border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                                        <PenTool size={20} />
                                    </div>
                                    <span className="text-xs font-bold">New Project</span>
                                </button>
                                <button onClick={() => setActiveTab('settings')} className="p-4 bg-surface border border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                                        <Settings size={20} />
                                    </div>
                                    <span className="text-xs font-bold">Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-surface border border-border rounded-xl p-6 h-full min-h-[400px]">
                            <h3 className="font-bold text-primary mb-6">Recent Activity</h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border/50"></div>
                                {activities.slice(0, 7).map((item, i) => (
                                    <div key={item.id} className="flex gap-4 relative animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className={`w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shrink-0 z-10 ${
                                            item.type === 'invoice' ? 'text-green-500' :
                                            item.type === 'lead' ? 'text-blue-500' :
                                            item.type === 'project' ? 'text-purple-500' :
                                            'text-secondary'
                                        }`}>
                                            {item.type === 'invoice' ? <CheckCircle2 size={14} /> : 
                                             item.type === 'lead' ? <Users size={14} /> : 
                                             item.type === 'project' ? <PenTool size={14} /> : 
                                             <ActivityIcon size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary leading-tight">{item.message}</p>
                                            <p className="text-xs text-secondary mt-1">{formatTimeAgo(item.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS - content unchanged */}
            {/* ... */}

            {/* TAB: CRM - content unchanged */}
            {/* ... */}
            {activeTab === 'crm' && (
              <div className="h-full flex flex-col animate-in fade-in duration-500">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                   <div className="flex gap-2">
                     <button className="px-3 py-1.5 bg-surface border border-border rounded-md text-xs font-medium flex items-center gap-1.5 text-primary"><Layers size={14}/> Kanban</button>
                     <div className="relative group">
                        <button className={`px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${filterType !== 'All' ? 'text-accent border-accent' : 'text-secondary hover:text-primary'}`}>
                            <Filter size={14}/> 
                            {filterType === 'All' ? 'Filter' : filterType}
                            <ChevronDown size={12} className="opacity-50" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <button onClick={() => setFilterType('All')} className="w-full text-left px-4 py-2 text-xs hover:bg-background/50 flex items-center justify-between">
                                All Leads {filterType === 'All' && <Check size={12} className="text-accent" />}
                            </button>
                            <button onClick={() => setFilterType('High Value')} className="w-full text-left px-4 py-2 text-xs hover:bg-background/50 flex items-center justify-between">
                                High Value (&gt;$50k) {filterType === 'High Value' && <Check size={12} className="text-accent" />}
                            </button>
                            <button onClick={() => setFilterType('Urgent')} className="w-full text-left px-4 py-2 text-xs hover:bg-background/50 flex items-center justify-between">
                                Urgent / Priority {filterType === 'Urgent' && <Check size={12} className="text-accent" />}
                            </button>
                             <button onClick={() => setFilterType('Enterprise')} className="w-full text-left px-4 py-2 text-xs hover:bg-background/50 flex items-center justify-between">
                                Enterprise {filterType === 'Enterprise' && <Check size={12} className="text-accent" />}
                            </button>
                        </div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 w-full sm:w-auto">
                     <button 
                        onClick={() => { setIsAddLeadModalOpen(true); setEditingId(null); setNewLeadFormData({ company: '', person: '', role: '', value: '', techStack: '', tags: '' }); }}
                        className="px-4 py-1.5 bg-primary text-background rounded-md text-xs font-bold flex items-center gap-2 hover:bg-accent hover:text-black transition-colors"
                     >
                        <Plus size={14} /> Add Lead
                     </button>
                     <button className="p-1.5 bg-surface border border-border rounded-md text-secondary hover:text-primary">
                        <Download size={16} />
                     </button>
                   </div>
                 </div>

                 <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="flex-1 overflow-x-auto pb-8">
                        <div className="flex gap-4 min-w-[1200px] h-full">
                            {KANBAN_COLUMNS.map(col => {
                                let leads = pipelineItems?.filter(l => l.status === col) || [];
                                if (filterType === 'High Value') {
                                    leads = leads.filter(l => {
                                        const val = parseInt(l.value.replace(/[^0-9]/g, '')) || 0;
                                        return val >= 50000;
                                    });
                                } else if (filterType === 'Urgent') {
                                    leads = leads.filter(l => l.tags?.some(t => ['Urgent', 'High Priority', 'Immediate'].includes(t)));
                                } else if (filterType === 'Enterprise') {
                                    leads = leads.filter(l => l.tags?.some(t => ['Enterprise', 'Gov'].includes(t)) || (parseInt(l.value.replace(/[^0-9]/g, '')) || 0) > 100000);
                                }
                                const totalVal = leads.reduce((acc, l) => acc + (parseInt(l.value.replace(/[^0-9]/g, '')) || 0), 0);

                                return (
                                    <DroppableColumn 
                                        key={col} 
                                        id={col} 
                                        title={col} 
                                        count={leads.length}
                                        totalVal={totalVal}
                                        onAddLead={() => { setIsAddLeadModalOpen(true); setEditingId(null); setNewLeadFormData({ company: '', person: '', role: '', value: '', techStack: '', tags: '' }); }}
                                    >
                                        {leads.map(lead => (
                                          <DraggableKanbanCard key={lead.id} lead={lead} onEdit={handleEditLead} onDelete={handleDeleteLead} onClick={setSelectedLead} />
                                        ))}
                                    </DroppableColumn>
                                );
                            })}
                        </div>
                    </div>
                    <DragOverlay>
                        {activeLead ? <KanbanCardInner lead={activeLead} isOverlay /> : null}
                    </DragOverlay>
                 </DndContext>
              </div>
            )}
            
            {/* TAB: CMS */}
            {activeTab === 'cms' && (
                <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col pb-8">
                    {!cmsEditorOpen ? (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-primary">Content Management</h2>
                                    <p className="text-xs text-secondary mt-1">Manage portfolio projects and case studies</p>
                                </div>
                                <button 
                                    onClick={() => { setEditingProjectId(null); loadProjectForEdit(0); }}
                                    className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-black transition-colors"
                                >
                                    <Plus size={16} /> New Project
                                </button>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2 border-b border-border">
                                {['All', 'Published', 'Draft'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setCmsFilter(filter)}
                                        className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                                            cmsFilter === filter 
                                            ? 'border-accent text-accent' 
                                            : 'border-transparent text-secondary hover:text-primary'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {getFilteredProjects().length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-surface/30">
                                        <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-secondary mb-3">
                                            <PenTool size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-primary">No projects found</p>
                                        <p className="text-xs text-secondary mt-1">Try changing the filter or create a new project</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {getFilteredProjects().map((project) => (
                                            <div key={project.id} className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all flex flex-col">
                                                <div className="h-40 overflow-hidden relative">
                                                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                            project.status === 'Published' 
                                                            ? 'bg-green-500/90 text-white backdrop-blur-sm' 
                                                            : 'bg-zinc-500/90 text-white backdrop-blur-sm'
                                                        }`}>
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                    <img 
                                                        src={project.image} 
                                                        alt={project.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                                </div>
                                                
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-primary line-clamp-1">{project.title}</h3>
                                                    </div>
                                                    <p className="text-xs text-secondary line-clamp-2 mb-4 flex-1">
                                                        {project.description}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {project.tags?.slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="px-2 py-0.5 bg-background border border-border rounded text-[10px] text-secondary">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {project.tags?.length > 3 && (
                                                            <span className="px-2 py-0.5 bg-background border border-border rounded text-[10px] text-secondary">+{project.tags.length - 3}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                                                        <button 
                                                            onClick={() => loadProjectForEdit(project.id)}
                                                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs font-bold hover:bg-surface hover:text-accent transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <Edit3 size={12} /> Edit
                                                        </button>
                                                        <button className="px-3 py-2 bg-background border border-border rounded-lg text-xs font-bold hover:bg-surface hover:text-primary transition-colors">
                                                            <Eye size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* CMS Editor UI (Existing Code) */
                        <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
                            {/* ... Editor Header ... */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setCmsEditorOpen(false)} className="p-2 hover:bg-surface rounded-lg text-secondary hover:text-primary transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-bold text-primary">{editingProjectId ? 'Edit Project' : 'New Project'}</h2>
                                        <p className="text-xs text-secondary">Fill in the details below to update your portfolio.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setCmsEditorOpen(false)} className="px-4 py-2 rounded-lg hover:bg-surface text-sm font-medium transition-colors">Cancel</button>
                                    <button onClick={handleSaveProject} className="px-6 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:bg-accent hover:text-black transition-colors flex items-center gap-2">
                                        <Save size={16} /> Save Project
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {/* Main Info */}
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Basic Information</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Project Title</label>
                                                <input value={cmsForm.title} onChange={e => handleCmsChange('title', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" placeholder="e.g. Neon Finance App" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Subtitle</label>
                                                <input value={cmsForm.subtitle} onChange={e => handleCmsChange('subtitle', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" placeholder="e.g. Next-Gen Trading Platform" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs font-medium text-secondary">Short Description (Card View)</label>
                                                <textarea value={cmsForm.shortDescription} onChange={e => handleCmsChange('shortDescription', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none resize-none h-20" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Hero Image */}
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Visuals</h3>
                                        <ImageUploadControl label="Hero Image" value={cmsForm.heroImage} onChange={(val) => handleCmsChange('heroImage', val)} />
                                    </section>

                                    {/* Details */}
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Project Details</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Client</label>
                                                <input value={cmsForm.client} onChange={e => handleCmsChange('client', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Role (comma sep)</label>
                                                <input value={cmsForm.role} onChange={e => handleCmsChange('role', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Year</label>
                                                <input value={cmsForm.year} onChange={e => handleCmsChange('year', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Category</label>
                                                <select value={cmsForm.category} onChange={e => handleCmsChange('category', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none">
                                                    <option>Select Category</option>
                                                    <option>AI Agent</option>
                                                    <option>Web App</option>
                                                    <option>Mobile App</option>
                                                    <option>Branding</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-secondary">Duration</label>
                                                <input value={cmsForm.duration} onChange={e => handleCmsChange('duration', e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Tech Stack */}
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {cmsForm.techStack.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-surface border border-border rounded-full text-xs flex items-center gap-2">
                                                    {tag} <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                        <input 
                                            value={cmsForm.tagInput} 
                                            onChange={e => handleCmsChange('tagInput', e.target.value)} 
                                            onKeyDown={handleAddTag}
                                            className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:border-accent outline-none" 
                                            placeholder="Type and press Enter to add..." 
                                        />
                                    </section>

                                    {/* Narrative Context */}
                                    <section className="space-y-6">
                                        <h3 className="text-sm font-bold uppercase text-secondary tracking-wider border-b border-border pb-2 mb-4">Narrative Context</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-secondary block mb-2">The Challenge</label>
                                                <textarea 
                                                    value={cmsForm.challenge} 
                                                    onChange={e => handleCmsChange('challenge', e.target.value)} 
                                                    className="w-full bg-[#121212] border border-border rounded-xl p-4 text-sm focus:border-accent outline-none resize-none h-32 placeholder:text-zinc-700 transition-colors"
                                                    placeholder="Describe the problem..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-secondary block mb-2">The Solution</label>
                                                <textarea 
                                                    value={cmsForm.solution} 
                                                    onChange={e => handleCmsChange('solution', e.target.value)} 
                                                    className="w-full bg-[#121212] border border-border rounded-xl p-4 text-sm focus:border-accent outline-none resize-none h-32 placeholder:text-zinc-700 transition-colors"
                                                    placeholder="Describe how you solved it..."
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Key Results */}
                                    <section className="space-y-4 mt-8">
                                        <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
                                            <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Key Results</h3>
                                            <button onClick={() => setActiveMetric({value: '', label: '', trend: '', trendDirection: 'up'})} className="text-xs font-bold text-accent hover:text-white transition-colors flex items-center gap-1">
                                                <Plus size={12} /> Add Metric
                                            </button>
                                        </div>
                                        
                                        {cmsForm.results.length === 0 ? (
                                            <div className="border border-dashed border-border rounded-xl p-8 flex items-center justify-center text-secondary/50 text-sm">
                                                No metrics added yet.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {cmsForm.results.map((res, idx) => (
                                                    <div key={res.id || idx} className="bg-[#121212] border border-border rounded-xl p-4 relative group">
                                                        <button onClick={() => deleteMetric(res.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                                                        <div className="text-2xl font-bold text-primary mb-1">{res.value}</div>
                                                        <div className="text-xs text-secondary mb-2 line-clamp-1">{res.label}</div>
                                                        {res.trend && <div className="inline-block px-2 py-0.5 rounded bg-surface border border-border text-[10px] text-secondary">{res.trend}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    {/* Process & Gallery */}
                                    <section className="space-y-4 mt-8">
                                        <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
                                            <h3 className="text-sm font-bold uppercase text-secondary tracking-wider">Process & Gallery</h3>
                                            <div className="relative">
                                                <button onClick={() => setShowAddBlockMenu(!showAddBlockMenu)} className="text-xs font-bold text-accent hover:text-white transition-colors flex items-center gap-1">
                                                    <Plus size={12} /> Add Block
                                                </button>
                                                {showAddBlockMenu && (
                                                    <div className="absolute right-0 top-full mt-2 w-32 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-20 flex flex-col">
                                                        <button onClick={() => { setActiveBlock({type: 'text', title: '', body: '', image: ''}); setShowAddBlockMenu(false); }} className="px-3 py-2 text-left text-xs hover:bg-background text-secondary hover:text-primary">Text Block</button>
                                                        <button onClick={() => { setActiveBlock({type: 'image', title: '', body: '', image: ''}); setShowAddBlockMenu(false); }} className="px-3 py-2 text-left text-xs hover:bg-background text-secondary hover:text-primary">Image Block</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {cmsForm.contentBlocks.length === 0 ? (
                                            <div className="border border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-secondary/50 gap-3">
                                                <Layers size={24} className="opacity-50" />
                                                <span className="text-sm">Add content blocks to describe the process</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cmsForm.contentBlocks.map((block, idx) => (
                                                    <div key={block.id || idx} className="bg-[#121212] border border-border rounded-xl p-4 flex gap-4 items-start group">
                                                        <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center shrink-0 text-secondary">
                                                            {block.type === 'text' ? <TypeIcon size={16} /> : <ImageIcon size={16} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-bold text-primary mb-1">{block.title}</h4>
                                                                <button onClick={() => deleteBlock(block.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                                                            </div>
                                                            {block.type === 'text' ? (
                                                                <p className="text-xs text-secondary line-clamp-2">{block.body}</p>
                                                            ) : (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="w-12 h-8 bg-surface rounded overflow-hidden">
                                                                        <img src={block.image} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <span className="text-xs text-zinc-600 truncate">{block.image}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* TAB: INBOX */}
            {activeTab === 'inbox' && (
                <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
                    {/* Header - Only visible on desktop or if no message selected on mobile */}
                    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${selectedInquiry ? 'hidden lg:flex' : 'flex'}`}>
                        <div>
                            <h2 className="text-xl font-bold text-primary">Inbox</h2>
                            <p className="text-xs text-secondary mt-1">Manage inquiries and project requests</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative group flex-1 sm:flex-initial">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                                <input type="text" placeholder="Search messages..." className="w-full bg-surface border border-border rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-accent transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden flex h-full min-h-0 shadow-sm relative">
                        {/* Left Pane: Message List */}
                        <div className={`
                            w-full lg:w-[350px] xl:w-[400px] border-r border-border flex flex-col bg-background/50
                            ${selectedInquiry ? 'hidden lg:flex' : 'flex'}
                        `}>
                            {/* Filters */}
                            <div className="p-2 border-b border-border flex gap-1">
                                {['All', 'Unread', 'Project'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setInboxFilter(filter)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                            inboxFilter === filter ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary hover:bg-surface/50'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto">
                                {getFilteredInquiries().length === 0 ? (
                                    <div className="p-8 text-center text-secondary text-xs">No messages found.</div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {getFilteredInquiries().map((inq) => (
                                            <div 
                                                key={inq.id} 
                                                onClick={() => setSelectedInquiry(inq)}
                                                className={`p-4 cursor-pointer hover:bg-surface/80 transition-colors group relative ${selectedInquiry?.id === inq.id ? 'bg-surface border-l-2 border-accent' : 'border-l-2 border-transparent'}`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-bold text-sm truncate pr-2 ${inq.status === 'New' ? 'text-primary' : 'text-secondary'}`}>{inq.name}</span>
                                                    <span className="text-[10px] text-secondary whitespace-nowrap">{new Date(inq.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                                </div>
                                                <div className="text-xs font-medium text-primary truncate mb-1">
                                                    {inq.subject || 'No Subject'}
                                                </div>
                                                <div className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                                                    {inq.message}
                                                </div>
                                                {inq.status === 'New' && (
                                                    <div className="absolute top-4 right-2 w-2 h-2 bg-accent rounded-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Pane: Reading View */}
                        <div className={`
                            flex-1 bg-background flex-col h-full overflow-hidden
                            ${selectedInquiry ? 'flex fixed inset-0 z-50 lg:static' : 'hidden lg:flex'}
                        `}>
                            {selectedInquiry ? (
                                <>
                                    {/* Reading Header */}
                                    <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface/30 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setSelectedInquiry(null)} className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary">
                                                <ArrowLeft size={20} />
                                            </button>
                                            <div>
                                                <h3 className="font-bold text-lg text-primary line-clamp-1">{selectedInquiry.subject}</h3>
                                                <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                                                    <span className="font-mono bg-surface border border-border px-1.5 rounded">{selectedInquiry.type}</span>
                                                    <span>•</span>
                                                    <span>{selectedInquiry.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')} 
                                                className="p-2 text-secondary hover:text-accent hover:bg-surface rounded-lg transition-colors" title="Mark Replied"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                            <button 
                                                className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors" title="Archive"
                                            >
                                                <Archive size={18} />
                                            </button>
                                            <button 
                                                onClick={() => { setInquiryDeleteId(selectedInquiry.id); }}
                                                className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reading Content */}
                                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                        <div className="bg-surface/30 border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-lg">
                                                    {selectedInquiry.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-primary">{selectedInquiry.name}</div>
                                                    <div className="text-xs text-secondary">{selectedInquiry.company || 'Individual'}</div>
                                                </div>
                                                <div className="ml-auto text-xs text-secondary font-mono">
                                                    {new Date(selectedInquiry.date).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="prose prose-sm prose-invert max-w-none text-primary/90 leading-relaxed whitespace-pre-wrap">
                                                {selectedInquiry.message}
                                            </div>

                                            {(selectedInquiry.services || selectedInquiry.budget) && (
                                                <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4">
                                                    {selectedInquiry.budget && (
                                                        <div className="bg-background border border-border px-3 py-1.5 rounded-lg text-xs">
                                                            <span className="text-secondary mr-2">Budget:</span>
                                                            <span className="font-bold text-primary">{selectedInquiry.budget}</span>
                                                        </div>
                                                    )}
                                                    {selectedInquiry.services?.map(s => (
                                                        <div key={s} className="bg-background border border-border px-3 py-1.5 rounded-lg text-xs text-primary">
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply Box */}
                                    <div className="p-6 border-t border-border bg-surface/20">
                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <textarea 
                                                    placeholder="Type your reply..." 
                                                    className="w-full bg-background border border-border rounded-xl p-4 pr-12 text-sm focus:border-accent outline-none resize-none h-24 transition-colors"
                                                />
                                                <button className="absolute bottom-3 right-3 p-2 bg-accent text-black rounded-lg hover:opacity-90 transition-opacity">
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-secondary opacity-60">
                                    <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center mb-4">
                                        <Inbox size={32} strokeWidth={1} />
                                    </div>
                                    <p className="text-sm font-medium">Select a message to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* TAB: FINANCE */}
            {activeTab === 'finance' && (
                <div className="h-full flex flex-col animate-in fade-in duration-500 space-y-8">
                    
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total Revenue" value="$142,300" trend="+12%" positive icon={DollarSign} />
                        <StatCard label="Outstanding" value="$24,500" trend="-5%" positive icon={Clock} />
                        <StatCard label="Net Profit" value="$112,000" trend="+8%" positive icon={Wallet} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="font-bold text-primary flex items-center gap-2"><BarChart3 size={18} /> Revenue Analytics</h3>
                                    <p className="text-xs text-secondary mt-1">Monthly income overview</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-accent"></span>
                                    <span className="text-xs text-secondary">Income</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 flex items-end justify-between gap-4 min-h-[200px] px-2">
                                {[35, 50, 45, 70, 60, 85, 65, 90, 80, 55, 75, 95].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
                                        <div className="w-full bg-background rounded-t-sm relative h-full flex items-end overflow-hidden">
                                            <div 
                                                className="w-full bg-accent opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-sm"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-secondary font-mono">
                                            {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Invoices List */}
                        <div className="bg-surface border border-border rounded-xl p-0 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
                                <h3 className="font-bold text-primary">Recent Invoices</h3>
                                <button onClick={handleOpenCreateInvoice} className="text-xs bg-primary text-background px-3 py-1.5 rounded font-bold hover:bg-accent hover:text-black transition-colors">
                                    + New
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[400px]">
                                {invoiceList.slice(0, 6).map((inv) => (
                                    <div key={inv.id} className="p-4 border-b border-border/50 hover:bg-background transition-colors flex items-center justify-between group">
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm text-primary truncate">{inv.client}</div>
                                            <div className="text-xs text-secondary mt-0.5">{inv.id} • {inv.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-sm text-primary">{inv.amount}</div>
                                            <div className={`text-[10px] uppercase font-bold mt-1 ${
                                                inv.status === 'Paid' ? 'text-green-500' : 
                                                inv.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                                {inv.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 text-center border-t border-border mt-auto">
                                <button className="text-xs text-secondary hover:text-primary font-medium transition-colors">View All Invoices</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </main>

      {/* --- Modals --- */}
      
      {/* Metric Modal */}
      {activeMetric && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
                  <h3 className="text-lg font-bold mb-4">{activeMetric.id ? 'Edit Metric' : 'Add Metric'}</h3>
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-secondary uppercase">Value</label>
                          <input 
                            value={activeMetric.value}
                            onChange={(e) => setActiveMetric({...activeMetric, value: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none" 
                            placeholder="e.g. 40%"
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-secondary uppercase">Label</label>
                          <input 
                            value={activeMetric.label}
                            onChange={(e) => setActiveMetric({...activeMetric, label: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none" 
                            placeholder="e.g. Reduction in time"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Trend Badge</label>
                              <input 
                                value={activeMetric.trend}
                                onChange={(e) => setActiveMetric({...activeMetric, trend: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none" 
                                placeholder="e.g. +20%"
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Direction</label>
                              <select 
                                value={activeMetric.trendDirection}
                                onChange={(e) => setActiveMetric({...activeMetric, trendDirection: e.target.value as any})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none"
                              >
                                  <option value="up">Up (Positive)</option>
                                  <option value="down">Down (Negative)</option>
                                  <option value="neutral">Neutral</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setActiveMetric(null)} className="px-4 py-2 rounded-lg text-sm hover:bg-background transition-colors">Cancel</button>
                      <button onClick={saveMetric} className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:bg-accent hover:text-black transition-colors">Save Metric</button>
                  </div>
              </div>
          </div>
      )}

      {/* Block Modal */}
      {activeBlock && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-lg font-bold mb-4">{activeBlock.id ? 'Edit Block' : `Add ${activeBlock.type === 'text' ? 'Text' : 'Image'} Block`}</h3>
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-secondary uppercase">Title</label>
                          <input 
                            value={activeBlock.title}
                            onChange={(e) => setActiveBlock({...activeBlock, title: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none" 
                            placeholder="Section Title"
                          />
                      </div>
                      
                      {activeBlock.type === 'text' ? (
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Body Content</label>
                              <textarea 
                                value={activeBlock.body}
                                onChange={(e) => setActiveBlock({...activeBlock, body: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none min-h-[120px] resize-none" 
                                placeholder="Enter descriptive text..."
                              />
                          </div>
                      ) : (
                          <div className="space-y-1">
                              <ImageUploadControl 
                                  label="Block Image" 
                                  value={activeBlock.image} 
                                  onChange={(val) => setActiveBlock({...activeBlock, image: val})} 
                              />
                          </div>
                      )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setActiveBlock(null)} className="px-4 py-2 rounded-lg text-sm hover:bg-background transition-colors">Cancel</button>
                      <button onClick={saveBlock} className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:bg-accent hover:text-black transition-colors">Save Block</button>
                  </div>
              </div>
          </div>
      )}

      {/* ... (Existing Modals: Lead, Invoice, View Invoice remain unchanged) ... */}
      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Lead' : 'Add New Lead'}</h3>
                  <div className="space-y-4">
                      {/* ... inputs ... */}
                      <input 
                        placeholder="Company" 
                        value={newLeadFormData.company}
                        onChange={(e) => setNewLeadFormData({...newLeadFormData, company: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg p-2" 
                      />
                      {/* ... other inputs ... */}
                      <div className="grid grid-cols-2 gap-4">
                          <input 
                            placeholder="Contact Person" 
                            value={newLeadFormData.person}
                            onChange={(e) => setNewLeadFormData({...newLeadFormData, person: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2" 
                          />
                          <input 
                            placeholder="Role" 
                            value={newLeadFormData.role}
                            onChange={(e) => setNewLeadFormData({...newLeadFormData, role: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2" 
                          />
                      </div>
                      <input 
                        placeholder="Value (e.g. $10,000)" 
                        value={newLeadFormData.value}
                        onChange={(e) => setNewLeadFormData({...newLeadFormData, value: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg p-2" 
                      />
                      <input 
                        placeholder="Tech Stack (comma separated)" 
                        value={newLeadFormData.techStack}
                        onChange={(e) => setNewLeadFormData({...newLeadFormData, techStack: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg p-2" 
                      />
                      <input 
                        placeholder="Tags (comma separated)" 
                        value={newLeadFormData.tags}
                        onChange={(e) => setNewLeadFormData({...newLeadFormData, tags: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg p-2" 
                      />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setIsAddLeadModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-background transition-colors">Cancel</button>
                      <button onClick={handleAddLead} className="px-4 py-2 bg-primary text-background rounded-lg font-bold hover:bg-accent hover:text-black transition-colors">Save</button>
                  </div>
              </div>
          </div>
      )}

      {/* Create/Edit Invoice Modal */}
      {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold mb-4">{editingInvoiceId ? 'Edit Invoice' : 'Create New Invoice'}</h3>
                  <div className="space-y-4">
                      {/* ... inputs ... */}
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-secondary uppercase">Client Name</label>
                          <input 
                            value={invoiceFormData.client}
                            onChange={(e) => setInvoiceFormData({...invoiceFormData, client: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none" 
                            placeholder="e.g. Acme Corp"
                          />
                      </div>
                      {/* ... other inputs ... */}
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-secondary uppercase">Product / Project Description</label>
                          <textarea 
                            value={invoiceFormData.description}
                            onChange={(e) => setInvoiceFormData({...invoiceFormData, description: e.target.value})}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-accent outline-none min-h-[80px] resize-none" 
                            placeholder="Details of services rendered..."
                          />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Date</label>
                              <input 
                                type="date"
                                value={invoiceFormData.date}
                                onChange={(e) => setInvoiceFormData({...invoiceFormData, date: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-xs focus:border-accent outline-none" 
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Amount</label>
                              <input 
                                value={invoiceFormData.amount}
                                onChange={(e) => setInvoiceFormData({...invoiceFormData, amount: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-xs focus:border-accent outline-none" 
                                placeholder="0.00"
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-secondary uppercase">Status</label>
                              <select 
                                value={invoiceFormData.status}
                                onChange={(e) => setInvoiceFormData({...invoiceFormData, status: e.target.value})}
                                className="w-full bg-background border border-border rounded-lg p-2 text-xs focus:border-accent outline-none"
                              >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Overdue">Overdue</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 rounded-lg text-sm hover:bg-background transition-colors">Cancel</button>
                      <button onClick={handleSaveInvoice} className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:bg-accent hover:text-black transition-colors">{editingInvoiceId ? 'Save Changes' : 'Create Invoice'}</button>
                  </div>
              </div>
          </div>
      )}

      {/* View Invoice Modal */}
      {viewingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewingInvoice(null)}>
              <div onClick={(e) => e.stopPropagation()} className="bg-white text-black rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-8">
                          <div>
                              <div className="text-2xl font-bold tracking-tight">INVOICE</div>
                              <div className="text-sm text-gray-500 mt-1">#{viewingInvoice.id}</div>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-lg">Sam Ayebanate</div>
                              <div className="text-xs text-gray-500">AI Engineer & Designer</div>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</div>
                              <div className="font-bold">{viewingInvoice.client}</div>
                          </div>
                          <div className="text-right">
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</div>
                              <div className="font-bold">{viewingInvoice.date}</div>
                          </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">Service Fee</span>
                              <span className="font-bold">{viewingInvoice.amount}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-400">
                               <span>{viewingInvoice.description || 'Consultation & Development'}</span>
                          </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="text-sm font-bold text-gray-400">TOTAL</div>
                          <div className="text-3xl font-display font-bold">{viewingInvoice.amount}</div>
                      </div>
                  </div>
                  
                  <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                           viewingInvoice.status === 'Paid' ? 'bg-green-100 text-green-600' : 
                           viewingInvoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                           'bg-red-100 text-red-600'
                      }`}>
                          {viewingInvoice.status}
                      </div>
                      <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500" title="Print"><Printer size={16} /></button>
                          <button onClick={() => setViewingInvoice(null)} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Close</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- NEW: Inquiry Modals --- */}
      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-surface border border-border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border bg-background">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <img src={selectedLead.avatar} alt={selectedLead.person} className="w-16 h-16 rounded-full border-2 border-border object-cover" />
                            <div>
                                <h3 className="text-2xl font-bold text-primary">{selectedLead.company}</h3>
                                <p className="text-sm text-secondary flex items-center gap-2">
                                    {selectedLead.person}
                                    <span className="w-1 h-1 rounded-full bg-secondary"></span>
                                    {selectedLead.role}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-surface rounded-full text-secondary transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Pipeline Progress */}
                    <div className="flex items-center gap-1 w-full mt-6">
                        {KANBAN_COLUMNS.map((stage, idx) => {
                            const isCurrent = selectedLead.status === stage;
                            const isPast = KANBAN_COLUMNS.indexOf(selectedLead.status) > idx;
                            return (
                                <div key={stage} className="flex-1 group relative">
                                    <div 
                                        onClick={() => updateLeadStatus(selectedLead.id, stage)}
                                        className={`
                                            h-1.5 rounded-full cursor-pointer transition-all duration-300
                                            ${isCurrent ? 'bg-accent' : isPast ? 'bg-primary' : 'bg-border hover:bg-border/80'}
                                        `}
                                    ></div>
                                    <span className={`absolute top-3 left-0 text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-accent' : isPast ? 'text-primary' : 'text-secondary opacity-50'}`}>
                                        {stage}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 space-y-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface/50 border border-border rounded-xl">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block mb-1">Value</span>
                            <span className="text-lg font-bold text-primary">{selectedLead.value}</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block mb-1">Updated</span>
                            <span className="text-sm font-medium text-primary">{selectedLead.timeAgo}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold block mb-1">Tags</span>
                            <div className="flex flex-wrap gap-1">
                                {selectedLead.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-secondary">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 flex items-center gap-2"><CodeIcon size={14} /> Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedLead.techStack.map(tech => (
                                <span key={tech} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-primary font-bold">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Notes (Placeholder) */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> Latest Activity</h4>
                        <div className="p-4 rounded-xl bg-surface/30 border border-border/50 text-sm text-secondary italic">
                            No recent notes recorded for this lead.
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-background flex justify-between items-center">
                    <button 
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        className="text-red-400 hover:text-red-500 text-sm flex items-center gap-2 px-4 py-2 hover:bg-red-500/5 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} /> Delete Lead
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                handleEditLead(selectedLead);
                                setSelectedLead(null); // Close detail modal to show edit modal
                            }}
                            className="px-4 py-2 border border-border text-secondary hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Edit3 size={16} /> Edit Details
                        </button>
                        <button 
                            className="px-6 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:bg-accent hover:text-black transition-all flex items-center gap-2"
                            onClick={() => updateLeadStatus(selectedLead.id, 'Won')}
                        >
                            <Target size={16} /> Mark Won
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Delete Inquiry Confirmation Modal */}
      {inquiryDeleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 mb-4 text-red-500">
                      <AlertCircle size={24} />
                      <h3 className="text-lg font-bold text-primary">Delete Message?</h3>
                  </div>
                  <p className="text-sm text-secondary mb-6 leading-relaxed">
                      Are you sure you want to delete this message? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setInquiryDeleteId(null)} className="px-4 py-2 rounded-lg text-sm hover:bg-background transition-colors text-secondary hover:text-primary">Cancel</button>
                      <button onClick={handleDeleteInquiryConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Delete</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};