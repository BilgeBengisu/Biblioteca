import type { Comment } from "../types/Comment";

export type CommentNode = Comment & { children: CommentNode[] };

const byNewest = (a: CommentNode, b: CommentNode) => {
  const ta = new Date(a.created_at).getTime();
  const tb = new Date(b.created_at).getTime();
  return tb - ta;
};

const byOldest = (a: CommentNode, b: CommentNode) => {
  const ta = new Date(a.created_at).getTime();
  const tb = new Date(b.created_at).getTime();
  return ta - tb;
};

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, children: [] });
  }

  const roots: CommentNode[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id);
    if (!node) continue;

    if (comment.parent_id && nodes.has(comment.parent_id)) {
      const parent = nodes.get(comment.parent_id);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortChildrenOldest = (list: CommentNode[]) => {
    list.sort(byOldest);
    for (const item of list) sortChildrenOldest(item.children);
  };

  roots.sort(byNewest);
  for (const root of roots) sortChildrenOldest(root.children);

  return roots;
}
