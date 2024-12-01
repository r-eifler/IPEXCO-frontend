export type UserRole = 'admin' | 'creator' | 'user-study'

export interface User {
  _id?: string;
  name: string;
  role: UserRole;
}
