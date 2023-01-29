export interface UserModel {
  email: string;
  role: "user" | "admin";
  created_at: Date;
  password?: string | undefined;
  name?: string | undefined;
  id?: string | undefined;
  updated_at?: Date | undefined;
}
