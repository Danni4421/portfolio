export interface Project {
	id: number;
	name: string;
	description?: string;
	image?: string;
	story?: string;
	tags?: string[];
	repository_url?: string;
	live_url?: string;
	tech_stack?: string[];
	created_at: string;
}
