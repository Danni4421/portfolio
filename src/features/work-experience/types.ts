export interface WorkExperienceJobDesc {
  id: string;
  work_experience_id: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  description: string;
  company_url: string;
  redirect_url: string;
  start_date: string;
  end_date?: string | null;
  job_descriptions: WorkExperienceJobDesc[];
}
