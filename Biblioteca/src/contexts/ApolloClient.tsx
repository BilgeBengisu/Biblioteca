import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function createApolloClient() {
  // Apollo Client setup
  // auth link never changes, so everything is combined in one link
  const httpLink = new HttpLink({
    uri: "/api/hardcover",
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
  return client;
}

const client = createApolloClient();

export const apolloClient = client;
