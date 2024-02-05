export interface DBUser {
  _id: string;
  mixpanelId: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
