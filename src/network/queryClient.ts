import { QueryClient } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
});

export default client;
