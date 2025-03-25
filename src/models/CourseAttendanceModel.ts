export interface CourseAttendance {
  courseId: number;
  courseCode: string;
  courseName: string;
  attendanceId?: number;
  attendanceTypeId: string;
  attendanceType: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MultipleCourseAttendances {
  attendanceId?: number;
  courseId: number;
  attendanceTypeId: string;
  dates: string[];
  startTime: string;
  endTime: string;
}
