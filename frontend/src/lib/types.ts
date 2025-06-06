
export interface UserType {
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AuthImagePatternProps = {
  title: string;
  subtitle: string;
};

export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
};
