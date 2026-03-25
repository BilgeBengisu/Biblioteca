import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
    query GetBooks {
        books {
            id
            slug
            title
            image {
            color
            url
            }
            contributions {
            author {
                bio
                name
            }
            }
            rating
            description
        }
    }
`;

export const GET_BOOK_BY_SLUG = gql`
    query GetBookBySlug($slug: String!) {
        books(where: { slug: { _eq: $slug } }) {
            id
            slug
            title
            image {
                color
                url
            }
            contributions {
                author {
                    bio
                    name
                }
            }
            rating
            description
        }
    }
`;

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!, $perPage: Int, $page: Int) {
    search(query: $query, query_type: "books", per_page: 25, page: $page) {
      results
    }
  }
`;

export const SEARCH_BOOKS_POPULARITY = gql`
  query SearchBooksPopularity($limit: Int, $offset: Int) {
    books(limit: $limit, offset: $offset, order_by: {users_count: desc}) {
        id
        slug
        title
        image {
            color
            url
        }
        contributions {
            author {
                bio
                name
            }
        }
        rating
        description
    }
  }
`;

export const SEARCH_BOOKS_TRENDING = gql`
  query SearchBooksTrending($from: date!, $to: date!, $limit: Int!, $offset: Int!) {
    books_trending(from: $from, to: $to, limit: $limit, offset: $offset) {
        ids
        error
    }
  }
`;

export const GET_BOOKS_BY_IDS = gql`
  query GetBooksByIds($ids: [Int!]!) {
    books(where: { id: { _in: $ids } }) {
        id
        slug
        title
        image {
            color
            url
        }
        contributions {
            author {
                bio
                name
            }
        }
        rating
        description
    }
  }
`;

export const SEARCH_BOOKS_SHUFFLE = gql`
  query GetBooks {
        books {
            id
            slug
            title
            image {
            color
            url
            }
            contributions {
            author {
                bio
                name
            }
            }
            rating
            description
        }
    }
`;