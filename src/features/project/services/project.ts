import { supabase } from '@/lib/supabase';
import type { Project } from '../types';

export const getRecentProjects = async (): Promise<{ projects: Array<Project> }> => {
	try {
		const { data } = await supabase
			.from('projects')
			.select(
				`
		    *,
				project_teams (
				  id,
					name,
					is_man,
					href
				)
			`
			)
			.order('created_at', { ascending: false })
			.limit(3);

		return { projects: data as Array<Project> };
	} catch {
		return { projects: [] };
	}
};

export const getProjectBySlug = async (slug: string): Promise<{ project: Project | null }> => {
	try {
		const { data } = await supabase
			.from('projects')
			.select(
				`
		      *,
  				project_teams (
  				  id, name, is_man, href
  				)
		`
			)
			.eq('slug', slug)
			.single();
		return { project: data as Project };
	} catch {
		return { project: null };
	}
};
