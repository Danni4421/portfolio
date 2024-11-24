"use client";
import { useModal } from "@/hooks/useModal";
import { Project } from "@/types";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { openModal } = useModal(`project-${project.id}`);

  return (
    <>
      <div
        onClick={() => openModal()}
        className="bg-base-100 rounded-2xl p-6 mb-4 flex flex-col sm:flex-row gap-4 sm:items-center transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="text-gray-100 font-medium mb-1 truncate">
            {project.name}
          </div>
          <div className="text-gray-500 line-clamp-2 text-sm">
            {project.description}
          </div>
        </div>
        <div className="text-gray-500 text-right flex-shrink-0 text-sm">
          {`${new Date(project.startDate!).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "short",
          })} - ${
            !project.isDone
              ? "Present"
              : new Date(project.endDate!).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                })
          }`}
        </div>
      </div>

      {/* Modal */}
      <dialog id={`project-${project.id}`} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <IoMdClose />
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4">{project.name}</h3>

          <div className="py-4">
            <div className="carousel carousel-center bg-neutral rounded-box w-full space-x-4 p-4">
              {project.files.map((file, index) => (
                <div className="carousel-item w-full" key={index}>
                  <Image
                    src={file}
                    width={800}
                    height={300}
                    className="rounded-box w-full object-contain"
                    alt={`Project image ${index + 1}`}
                    onClick={() => window.open(file, "_blank")}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-base">{project.description}</p>
            <p className="text-gray-500 mt-4 text-sm">
              {`I complete this on ${new Date(
                project.startDate
              ).toLocaleDateString("en-EN", {
                year: "numeric",
                month: "long",
              })} - ${
                project.isDone
                  ? new Date(project.endDate).toLocaleDateString("en-EN", {
                      year: "numeric",
                      month: "long",
                    })
                  : "Present"
              }`}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
