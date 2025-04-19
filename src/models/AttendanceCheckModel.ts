interface AttendanceCheckModel {
  id?: number;
  studentCode: string;
  fullName: string;
  courseAttendanceId: number;
  workplaceId?: number | null;
}

export default AttendanceCheckModel;
