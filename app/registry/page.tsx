"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { RegistrySidebar } from "./registry-sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const RegistryPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading, authenticating } = useAuth();

  useEffect(() => {
    if (authenticating) return;
    if (!user) router.replace("/");
  }, [authenticating, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <RegistrySidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default RegistryPage;
