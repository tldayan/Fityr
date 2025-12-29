export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile_pic: string | null;
  created_at: string; 
  stytch_user_id: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface SignupResponse {
  success: boolean;
  user: User;
  message: string;
}


export interface UserProfileResponse {
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  gender: "Male" | "Female" | null;
  profilePic: string | null;
  createdAt: string;
}


