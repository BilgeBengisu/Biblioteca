import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function createApolloClient() {
  // Apollo Client setup
  // auth link never changes, so everything is combined in one link
  const httpLink = new HttpLink({
    uri: "https://api.hardcover.app/v1/graphql",
    headers: {
      authorization: import.meta.env.VITE_HARDCOVER_API_BEARER
        ? `Bearer ${import.meta.env.VITE_HARDCOVER_API_BEARER}`
        : "",
    },
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
  return client;
}

const client = createApolloClient();

export const apolloClient = client;