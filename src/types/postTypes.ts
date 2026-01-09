import { images } from './../utils/assets';
export interface PostItemProps {
  id: number;
  title: string;
  description: string;
  created_at: string;
  vote: number;
  username: string;
  images?: string[];
  children?: React.ReactNode;
  noStats?: boolean
  showDivider?: boolean
  commentCount: number
  userVote: "upvote" | "downvote" | null
}

export interface UserProps {
  id: number;
  username: string;
  created_at: string;
  profile_pic: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  created_at: string;
  vote: number;
  username: string;
  commentCount: number; 
   userVote: "upvote" | "downvote" | null
   images?: string[]
}