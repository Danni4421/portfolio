"use client";
import { useModal } from "@/hooks/useModal";
import { Achievement } from "@/types";
import { IoMdClose } from "react-icons/io";
import PdfViewer from "@/components/pdf-viewer";
import Image from "next/image";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { openModal } = useModal(`achievement-${achievement.id}`);

  return (
    <>
      <div
        onClick={() => openModal()}
        className="bg-base-100 rounded-2xl p-6 mb-4 flex flex-col sm:flex-row gap-4 sm:items-center transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-center gap-5 min-w-0 flex-1">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-300">
            <div className="flex items-center justify-center h-full text-base-100 text-bold font-serif text-xl">
              {!!achievement.icon ? (
                <Image
                  src={achievement.icon}
                  alt={achievement.title}
                  width={48}
                  height={48}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{achievement.title.charAt(0)}</span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-gray-100 font-medium mb-1 truncate">
              {achievement.title}
            </div>
            <div className="text-gray-500 text-sm line-clamp-2">
              {achievement.description}
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-right flex-shrink-0 text-sm">
          {`Achieved on ${new Date(achievement.dateAchieve!).toLocaleDateString(
            "en-EN",
            {
              year: "numeric",
              month: "short",
            }
          )}`}
        </div>
      </div>

      {/* Modal */}
      <dialog id={`achievement-${achievement.id}`} className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <IoMdClose />
            </button>
          </form>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-300">
              <div className="flex items-center justify-center h-full text-base-100 text-bold font-serif text-xl">
                {!!achievement.icon ? (
                  <Image
                    src={achievement.icon}
                    alt={achievement.title}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{achievement.title.charAt(0)}</span>
                )}
              </div>
            </div>
            <h3 className="font-bold text-lg">{`${achievement.title} ${achievement.type}`}</h3>
          </div>

          <div className="py-4">
            {achievement.file && (
              <div className="mb-4">
                <PdfViewer url={achievement.file} />
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-base">{achievement.description}</p>
            <p className="text-gray-500 mt-4 text-sm">
              {`I achieved this on ${new Date(
                achievement.dateAchieve!
              ).toLocaleDateString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
