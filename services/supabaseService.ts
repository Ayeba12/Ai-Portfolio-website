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

    // Also delete associated case study
    await deleteCaseStudy(id);

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

export async function deleteCaseStudy(projectId: number): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_case_studies')
        .delete()
        .eq('project_id', projectId);
    if (error) { console.error('deleteCaseStudy error:', error); return false; }
    return true;
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

export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string | null> {
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
    }

    const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

    return data.publicUrl;
}

// ============================================================
// CRM / Leads
// ============================================================

export interface PortfolioLead {
    id: string;
    company: string;
    person: string;
    role: string;
    value: string;
    tech_stack: string[]; // DB column name might be tech_stack
    tags: string[];
    avatar: string;
    status: string;
    created_at?: string;
}

export async function getLeads(): Promise<PortfolioLead[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('portfolio_leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { console.error('getLeads error:', error); return []; }
    return data || [];
}

export async function upsertLead(lead: Partial<PortfolioLead>): Promise<PortfolioLead | null> {
    if (!supabase) return null;

    // Map frontend camelCase to snake_case if necessary, or ensure DB matches.
    // Assuming DB has 'tech_stack' based on common patterns, but let's be careful.
    // If the DB column is 'techStack', we use that. 
    // For now, let's assume the component passes the right shape or we adjust here.

    const { data, error } = await supabase
        .from('portfolio_leads')
        .upsert(lead as any, { onConflict: 'id' })
        .select()
        .single();

    if (error) { console.error('upsertLead error:', error); return null; }
    return data;
}

export async function deleteLead(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
        .from('portfolio_leads')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteLead error:', error); return false; }
    return true;
}
