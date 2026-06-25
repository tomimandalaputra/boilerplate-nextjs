import * as z from "zod";

// The schema is the single source of truth (PRD §10.5). Defined at module level
// (not inside a component, which would re-create it every render).
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
});

// infer the type — never hand-write a parallel interface
export type CreateUserInput = z.infer<typeof createUserSchema>;
