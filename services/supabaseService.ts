import { supabase } from './supabaseClient';

// ============================================================
// Types
// ============================================================

export interface PortfolioProject {
    id: number;
    title: string;
    category: string;
    date: string;
    description: string;
    image: string;
    tags: string[];
    status: string;
    sort_order: number;
}

export interface PortfolioCaseStudy {
    id: number;
    project_id: number;
    title: string;
    subtitle: string;
    category: string;
    client: string;
    year: string;
    duration: string;
    role: string[];
    tech_stack: string[];
    hero_image: string;
    challenge: string;
    solution: string;
    results: any[];
    content: any[];
}

export interface PortfolioInquiry {
    id: string;
    name: string;
    email: string;
    company: string;
    type: string;
    subject: string;
    budget: string;
    services: string[];
    message: string;
    status: string;
    date: string;
}

// ============================================================
// Projects
// ============================================================

export async function getProjects(): Promise<PortfolioProject[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true });
    if (error) { console.error('getProjects error:', error); return []; }
    return data || [];
}

export async function upsertProject(project: Partial<PortfolioProject> & { title: string }): Promise<PortfolioProject | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('portfolio_projects')
        .upsert(project, { onConflict: 'id' })
        .select()
        .single();
    if (error) { console.error('upsertProject error:', error); return null; }
    return data;
}

export async function deleteProject(id: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteProject error:', error); return false; }
    return true;
}

// ============================================================
// Case Studies
// ============================================================

export async function getCaseStudy(projectId: number): Promise<PortfolioCaseStudy | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('portfolio_case_studies')
        .select('*')
        .eq('project_id', projectId)
        .single();
    if (error) { console.error('getCaseStudy error:', error); return null; }
    return data;
}

export async function getAllCaseStudies(): Promise<Record<number, PortfolioCaseStudy>> {
    if (!supabase) return {};
    const { data, error } = await supabase
        .from('portfolio_case_studies')
        .select('*');
    if (error) { console.error('getAllCaseStudies error:', error); return {}; }
    const map: Record<number, PortfolioCaseStudy> = {};
    (data || []).forEach((cs: PortfolioCaseStudy) => { map[cs.project_id] = cs; });
    return map;
}

export async function upsertCaseStudy(cs: Partial<PortfolioCaseStudy> & { project_id: number }): Promise<PortfolioCaseStudy | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('portfolio_case_studies')
        .upsert(cs, { onConflict: 'project_id' })
        .select()
        .single();
    if (error) { console.error('upsertCaseStudy error:', error); return null; }
    return data;
}

// ============================================================
// Inquiries
// ============================================================

export async function getInquiries(): Promise<PortfolioInquiry[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('portfolio_inquiries')
        .select('*')
        .order('date', { ascending: false });
    if (error) { console.error('getInquiries error:', error); return []; }
    return data || [];
}

export async function createInquiry(inquiry: Omit<PortfolioInquiry, 'id'>): Promise<PortfolioInquiry | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('portfolio_inquiries')
        .insert(inquiry)
        .select()
        .single();
    if (error) { console.error('createInquiry error:', error); return null; }
    return data;
}

export async function updateInquiryStatus(id: string, status: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_inquiries')
        .update({ status })
        .eq('id', id);
    if (error) { console.error('updateInquiryStatus error:', error); return false; }
    return true;
}

export async function deleteInquiry(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_inquiries')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteInquiry error:', error); return false; }
    return true;
}

// ============================================================
// Site Config
// ============================================================

export async function getSiteConfig(): Promise<Record<string, string>> {
    if (!supabase) return {};
    const { data, error } = await supabase
        .from('portfolio_site_config')
        .select('*');
    if (error) { console.error('getSiteConfig error:', error); return {}; }
    const config: Record<string, string> = {};
    (data || []).forEach((row: { key: string; value: string }) => {
        config[row.key] = row.value;
    });
    return config;
}

export async function setSiteConfig(key: string, value: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_site_config')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) { console.error('setSiteConfig error:', error); return false; }
    return true;
}

export async function setSiteConfigBatch(config: Record<string, string>): Promise<boolean> {
    if (!supabase) return false;
    const rows = Object.entries(config).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
        .from('portfolio_site_config')
        .upsert(rows, { onConflict: 'key' });
    if (error) { console.error('setSiteConfigBatch error:', error); return false; }
    return true;
}
