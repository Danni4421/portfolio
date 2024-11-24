export interface JobTask {
  id: number;
  description: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  wo_id: number;
  task: string;
}

export interface Job {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  logo: string | null;
  title: string | null;
  place: string | null;
  isDone: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
  tasks?: WorkExperienceTask[];
}

export interface Achievement {
  type: "Awward" | "Certificate" | "Other";
  id: number;
  icon: string | null;
  file: string;
  title: string;
  description: string;
  dateAchieve: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Project {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  name: string;
  description: string;
  files: string[];
  startDate: Date;
  endDate: Date;
  isDone: boolean;
}
