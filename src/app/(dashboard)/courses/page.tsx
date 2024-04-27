import { createCourse, getEnrolledCourses } from "@/actions/courses";
import CourseCard from "@/components/courseCard";
import img from "/public/assets/notEnrolled.png";
import { BsDropbox } from "react-icons/bs";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";
import AddCourse from "@/components/addCourse";

export default async function Courses() {
  const courses = await getEnrolledCourses();
  const currentUser = await getCurrentUser();
  return (
    <div>
      {courses?.length === 0 || ( courses && courses[0].isPublished === false) ? (
        <div  className="text-center text-2xl font-bold" >
          <div hidden= {currentUser?.role === 'INSTRUCTOR'} >
            <div className=" mt-3 flex items-center justify-center space-y-3">
              No Courses enrolled &nbsp; <BsDropbox className=" w-7 h-7" />
            </div>
            <div className="text-center  w-full flex flex-1 mt-10">
              <Image
                src={img}
                alt="unenrolled.png"
                className="m-auto w-[50%] h-[50%]"
                />
            </div>
          </div>
          {currentUser?.role === "INSTRUCTOR" && <AddCourse/>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 m-2 md:m-6">
          {courses?.map(async (course) => {
            const classesCompleted = 0;
            let percent;
            if (course._count.classes == 0) percent = 0;
            else percent = (classesCompleted * 100) / course._count.classes;
            return (
              <CourseCard
                key={course.id}
                course={course}
                percent={percent}
                classesCompleted={classesCompleted}
              />
            );
          })}
          {currentUser?.role === "INSTRUCTOR" && <AddCourse/>}
        </div>
      )}
    </div>
  );
}
