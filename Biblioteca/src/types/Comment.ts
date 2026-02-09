export interface CommentAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author?: CommentAuthor;
  like_count?: number | null;
  liked_by_me?: boolean;
};

export type CreateCommentInput = {
  postId: string;
  content: string;
  parentId?: string | null;
};
