export interface CreatePaymentLessonDTO {
	amountInCents: number,
  instructorId: string;
  lessonId: string,
  studentId: string
}