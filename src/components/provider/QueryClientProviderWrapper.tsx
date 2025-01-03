"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode,  } from "react";
import Providers from "./Providers";
import { GCTIME, STALETIME } from "@/constant/constant";
import ChatWood from "../ChatWood";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client,
        staleTime: STALETIME,
        gcTime: GCTIME,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
const queryClient = getQueryClient();

const QueryClientProviderWrapper = ({ children }: { children: ReactNode }) => {
 
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>{children}</Providers>
      <ChatWood/>
    </QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;
