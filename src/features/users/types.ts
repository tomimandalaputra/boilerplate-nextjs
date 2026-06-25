// COLOCATED domain types for the `users` feature (PRD §4). Only genuinely
// cross-cutting types live in the global `types/`.
export interface User {
  id: string;
  name: string;
  email: string;
}
