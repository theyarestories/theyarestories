export interface DBUser {
  _id: string;
  username: string;
  avatar?: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
