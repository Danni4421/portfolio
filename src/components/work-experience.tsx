import { getWorkExperiences } from "@/actions/work-experience";
import WorkExperienceCard from "@/components/work-experience-card";

export default async function WorkExperiences() {
  const workExperiences = await getWorkExperiences();
  return (
    <div className="flex flex-col gap-4">
      {workExperiences &&
        workExperiences.map((job, index) => (
          <WorkExperienceCard key={index} job={job} />
        ))}
    </div>
  );
}
