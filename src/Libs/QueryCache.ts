import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const aWeek = 1000 * 60 * 60 * 24 * 7;
const cacheTime = process.env.REACT_APP_CACHE_ENABLED === "true" ? aWeek : 0;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
      staleTime: cacheTime,
    },
  },
});

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

export function clearQueryCache(): void {
  queryClient.clear();
  localStoragePersister.removeClient();
}
