import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { makeQueryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => makeQueryClient());

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
