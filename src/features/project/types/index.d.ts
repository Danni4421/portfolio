export interface Project {
	id: number;
	title: string;
	slug: string;
	description?: string;
	thumbnail?: string;
	story?: string;
	tags?: string[];
	repository_url?: string;
	live_url?: string;
	tech_stack?: string[];
	created_at: string;
}
