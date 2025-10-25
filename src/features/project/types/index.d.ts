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
	project_teams: Array<TeamMember>;
	created_at: string;
}

export interface TeamMember {
	id: number;
	name: string;
	is_man: boolean;
	href: string | null;
	created_at: string;
}
