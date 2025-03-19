export type UserRole = 'admin' | 'creator' | 'user-study'

export interface UserBase {
  name: string;
  role: UserRole;
}

export interface User extends UserBase{
  _id: string;
}
