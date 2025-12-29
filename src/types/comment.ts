interface CommentResponse {
  id: number;
  comment: string;
  post_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  vote: number;
  user_id: number;
  username: string;
  profile_pic: string | null;    
  totalReplies?: number;          
  replies?: CommentResponse[];      
  userVote: "upvote" | "downvote" | null
}

interface CommentInfo {
  comment: string;
  parent_id: number | null;
  post_id?: number;
  [key: string]: unknown;
}