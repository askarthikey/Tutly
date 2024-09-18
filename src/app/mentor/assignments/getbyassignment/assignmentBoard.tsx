"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SingleAssignmentBoard({ courses, assignments }: {
  courses: any;
  assignments: {
    id: string;
    classes: {
      id: string;
      attachments: {
        id: string;
        title: string;
        submissions: {
          id: string;
          points: string;
        }[];
        createdAt: string;
      }[];
      createdAt: string;
    }[];
  }[];
}) {

  const [currentCourse, setCurrentCourse] = useState<string>(courses[0]?.id);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  assignments.forEach((course: any) => {
    course.classes.sort((a: any, b: any) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    course.classes.forEach((cls: any) => {
      cls.attachments.sort((a: any, b: any) => {
        return a.title.localeCompare(b.title);
      });
    });
  });

  // return <pre>{JSON.stringify(assignments, null, 2)}</pre>
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          {courses?.map((course: any) => (
            <button
              onClick={() => setCurrentCourse(course.id)}
              className={`rounded p-2 sm:w-auto ${
                currentCourse === course.id && "border rounded"
              }`}
              key={course.id}
            >
              <h1 className="truncate max-w-xs text-sm font-medium">
                {course.title}
              </h1>
            </button>
          ))}
        </div>
      </div>
      {assignments.map((course: any) => {
        if (course.id !== currentCourse) return null;
        return course.classes.map((cls: any) =>
          cls.attachments.map((assignment: any) => {
            const assignmentsEvaluated = assignment.submissions.filter((x:any)=>x.points.length>0)
            return (
            <div key={assignment.id} className="border rounded-lg p-1 md:p-3">
              <div className="flex items-center p-2 md:p-0 md:px-4 justify-around md:justify-between flex-wrap">
                <div className="flex md:flex-row items-center justify-between w-full flex-wrap">
                  <div className="text-sm">
                    <h2 className="flex-1 font-medium mx-2 my-1">
                      {assignment.title}
                    </h2>
                    <p className="text-xs text-gray-500 mx-2 mb-1">
                     {assignment.class?.title}
                    </p>
                  </div>
                  <div className="flex gap-3 md:gap-6 items-center text-xs font-medium text-white flex-wrap">
                    <div>
                      <div className="rounded-full p-2.5 bg-green-600">
                        {assignmentsEvaluated.length} evaluated
                      </div>
                    </div>
                    <div>
                      <div className="rounded-full p-2.5 bg-yellow-600">
                        {assignment.submissions.length-assignmentsEvaluated.length} under review
                      </div>
                    </div>
                    <div className="flex gap-6 itens-center">
                      <div className="rounded-full p-2.5 bg-secondary-600">
                        {assignment.submissions.length} submissions
                      </div>
                    </div>
                    <button
                      title="Details"
                      onClick={() =>
                        router.push(`/assignments/${assignment.id}`)
                      }
                      className="p-2.5 bg-blue-500 rounded"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})
        );
      })}
    </div>
  );
}