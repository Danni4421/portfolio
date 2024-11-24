import { getAchievements } from "@/actions/achievement";
import { AchievementCard } from "./achievement-card";

export default async function Achievements() {
  const achievements = await getAchievements();

  return (
    <div className="flex flex-col gap-4">
      {achievements &&
        achievements.map((job, index) => (
          <AchievementCard key={index} achievement={job} />
        ))}
    </div>
  );
}
