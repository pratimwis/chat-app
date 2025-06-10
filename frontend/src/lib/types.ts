
export interface UserType {
  _id:string;
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export interface MessageType{
  _id: string;
  text:string;
  image:string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthImagePatternProps = {
  title: string;
  subtitle: string;
};

export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
};
