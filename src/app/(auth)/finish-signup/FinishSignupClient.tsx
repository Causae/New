"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useIsSignInWithEmailLink, useUser } from "@/firebase/provider";
import { signInWithEmailLink, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function FinishSignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const isSignInLink = useIsSignInWithEmailLink(window.location.href);

  const [status, setStatus] = useState<"loading" | "signingIn" | "setPassword" | "error" | "done">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeSignIn = async () => {
      if (user || isUserLoading || !isSignInLink) {
        if (user && !isUserLoading) setStatus("setPassword");
        else if (!isSignInLink && !isUserLoading) router.push("/login");
        return;
      }

      setStatus("signingIn");
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
        if (!email) {
          setError("Email is required to complete sign-in.");
          setStatus("error");
          return;
        }
      }

      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem("emailForSignIn");
        setStatus("setPassword");
      } catch (err: any) {
        console.error(err);
        setError("Failed to sign in. The link may be invalid or expired.");
        setStatus("error");
        toast({
          title: "Sign-in Error",
          description: err?.message || "Failed to complete sign-in.",
          variant: "destructive",
        });
      }
    };

    completeSignIn();
  }, [isSignInLink, user, isUserLoading, auth, router, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      setError("You must be signed in to set a password.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await updatePassword(user, values.password);

      setTimeout(() => {
        if (user.email) {
          sendPasswordResetEmail(auth, user.email);
        }
      }, 5000);

      toast({
        title: "Password set successfully!",
        description: "Redirecting...",
      });
      const redirectUrl = searchParams.get("redirectUrl") || "/dashboard";
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setError("Failed to set password. Please try again.");
      setStatus("error");
      toast({
        title: "Error",
        description: err?.message || "Failed to set password.",
        variant: "destructive",
      });
    }
  }

  const renderContent = () => {
    switch (status) {
      case "signingIn":
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Finalizing your sign-in...</p>
          </div>
        );
      case "error":
        return (
          <div className="text-center p-8">
            <CardTitle className="text-destructive">Sign-in Failed</CardTitle>
            <CardDescription className="mt-2">{error}</CardDescription>
            <Button onClick={() => router.push("/register")} className="mt-4">
              Try Again
            </Button>
          </div>
        );
      case "setPassword":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Set Your Password</CardTitle>
              <CardDescription>Welcome! To secure your account, please create a password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Save Password & Continue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return <Card className="w-full max-w-md">{renderContent()}</Card>;
}
