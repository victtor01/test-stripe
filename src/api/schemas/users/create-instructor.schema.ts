import { z } from "zod";

export const createInstructorSchema = z.object({
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(8),
});

export type CreateInstructorSchema = z.infer<typeof createInstructorSchema>;