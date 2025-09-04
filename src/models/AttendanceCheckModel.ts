interface AttendanceCheckModel {
  id?: string;
  studentCode: string;
  fullName: string;
  courseAttendanceId: number;
  workplaceId?: number | null;
}

export default AttendanceCheckModel;
