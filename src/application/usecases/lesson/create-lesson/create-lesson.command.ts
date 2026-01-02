export interface CreateLessonCommand {
  studentId: string;
  instructorId: string;
	startAt: Date;
  topic?: string;
  description?: string;
}
