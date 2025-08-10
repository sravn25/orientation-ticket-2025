"use client";

import React, { useEffect, useId, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const TolPage = () => {
  const { signIn, user } = useAuth();
  const id = useId();
  const [attemptCount, setAttemptCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      errorMessage(Error("Fill in email and password"));
      return;
    }
    setLoading(true);
    try {
      setAttemptCount(attemptCount + 1);
      await signIn(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      errorMessage(error);
    } finally {
      setPassword("");
      setLoading(false);
      if (attemptCount === 3) {
        errorMessage(Error("Too many attempts"));
        router.replace("/");
      }
    }
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  useEffect(() => {
    if (user) router.push("/registry");
  }, [router, user]);

  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome Back OL</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@tol.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id={id}
                    className="pe-9"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                  />
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOffIcon size={16} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full hover:cursor-pointer"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TolPage;
