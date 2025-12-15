"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sendSignInLinkToEmail } from "firebase/auth";
import React, { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase/provider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

function RegisterPage() {
  const searchParams = useSearchParams();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const redirectUrl = searchParams.get("redirectUrl") || "/dashboard";
    
    // The URL must be whitelisted in the Firebase Console
    const actionCodeSettings = {
      url: `${window.location.origin}/finish-signup?redirectUrl=${encodeURIComponent(redirectUrl)}`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
      // Save the email locally so you don't have to ask the user for it again
      // on the finish-signup page.
      window.localStorage.setItem('emailForSignIn', values.email);
      
      toast({
        title: "Check Your Email",
        description: `A sign-in link has been sent to ${values.email}.`,
      });
      // Clear form or show a success message, without redirecting yet.
      form.reset();

    } catch (error: any) {
      console.error("Error sending sign-in link:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send sign-in link. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Enter your email to receive a magic link and start your journey with CAUSAE Legaltech.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending Link..." : "Send Magic Link"}
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Sign up with Google
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href={`/login?redirectUrl=${searchParams.get('redirectUrl') || ''}`} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center text-center p-8 h-[550px] w-[448px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>}>
      <RegisterPage />
    </Suspense>
  )
}
