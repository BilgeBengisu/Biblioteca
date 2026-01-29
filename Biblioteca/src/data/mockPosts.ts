// data/mockPosts.ts
import type { Post } from "../types/Post";

export const mockPosts: Post[] = [
  {
    id: "1",
    createdAt: new Date().toISOString(),

    author: {
      id: "user-1",
      username: "bilge",
      avatarUrl: null,
    },

    contentType: "review",
    content: "I loved the atmosphere and the characters.",
    rating: 4,

    book: {
      id: 123,
      title: "The Secret History",
      author: "Donna Tartt",
      coverUrl: "/book.jpg",
    },
  },
  {
    id: "2",
    createdAt: new Date().toISOString(),

    author: {
      id: "user-2",
      username: "reader42",
      avatarUrl: null,
    },

    contentType: "book_update",
    status: "currently_reading",
    content: "Halfway through and really enjoying it!",

    book: {
      id: 456,
      title: "Norwegian Wood",
      author: "Haruki Murakami",
      coverUrl: null,
    },
  },
];
