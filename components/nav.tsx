"use client";

import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const [haha, setHaha] = useState(5);

  if (user) {
    return (
      <div className="h-16 px-4 bg-amber-50 flex items-center justify-between">
        <p>
          Logged in as{" "}
          <a href="/registry" className="underline hover:text-amber-900">
            {user?.email?.split("@")[0]}
          </a>
        </p>
        <Button onClick={signOut} disabled={loading} className="cursor-pointer">
          Sign out
        </Button>
      </div>
    );
  }
  if (pathName === "/") {
    return (
      <div
        onClick={() => {
          setHaha(haha - 1);
          if (haha - 1 === 0) router.push("/tol");
        }}
      >
        Welcome
      </div>
    );
  }
};

export default Navbar;
