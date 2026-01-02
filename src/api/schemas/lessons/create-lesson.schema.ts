import z from 'zod';

export const createLessonSchema = z.object({
  studentId: z.string(),
  instructorId: z.string(),
  startAt: z.coerce.date(),
  topic: z.string().optional(),
  description: z.string().optional(),
});
