export interface User {
  _id: string;
  name: string;
  email: string;
}
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  followers: string[];
  following: string[];
}

export interface Tweet {
  _id: string;
  content: string;
  author: User;
  likes?: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
