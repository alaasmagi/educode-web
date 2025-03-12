interface CourseAttendanceData {
    id:number;
    courseId: number;
    course: {
        courseCode:string;
        courseName:string;
    }
}