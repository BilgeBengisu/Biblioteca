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
    search(query: $query, query_type: "books", per_page: $perPage, page: $page) {
      results
    }
  }
`;
