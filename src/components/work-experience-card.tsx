"use client";
import { Job, JobTask } from "@/types";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface WorkExperienceCardProps {
  job: Job;
}

export default function WorkExperienceCard({ job }: WorkExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="bg-base-100 rounded-2xl p-6 mb-4 transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer transform hover:scale-105">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex items-center gap-5 min-w-0 flex-1">
          {!!job.logo ? (
            <div className="w-12 h-12 flex-shrink-0">
              <Image
                src={job.logo}
                alt={job.place ?? "Image"}
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0">
              <div className="flex items-center justify-center h-full text-base-100 text-bold font-serif text-xl">
                {job.place?.charAt(0)}.
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-gray-100 font-medium mb-1 truncate">
              {job.title}
            </div>
            <div className="text-gray-500 truncate">{job.place}</div>
          </div>
        </div>
        {!isExpanded && (
          <div className="text-gray-500 text-right flex-shrink-0 text-sm">
            {`${new Date(job.startDate!).toLocaleDateString("en-EN", {
              year: "numeric",
              month: "short",
            })} - ${
              !job.isDone
                ? "Present"
                : new Date(job.endDate!).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                  })
            }`}
          </div>
        )}
      </div>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "mt-4" : ""
        }`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="text-gray-400 text-sm">
          {/* Isi dengan job description */}
          <h4 className="text-gray-200 font-medium mb-2">Job Description:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {job.tasks?.map((task: JobTask, index) => (
              <li key={index}>
                <h3 className="text-md font-bold">{task.task}</h3>
                <span className="mb-5">{task.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isExpanded && (
        <div className="text-gray-500 text-right flex-shrink-0 text-sm">
          {`${new Date(job.startDate!).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "short",
          })} - ${
            !job.isDone
              ? "Present"
              : new Date(job.endDate!).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                })
          }`}
        </div>
      )}
    </div>
  );
}
