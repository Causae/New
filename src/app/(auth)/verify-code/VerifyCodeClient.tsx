"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

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
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Your code must be 6 digits." })
    .max(6, { message: "Your code must be 6 digits." }),
});

export default function VerifyCodeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const redirectUrl = searchParams.get("redirectUrl") || "/dashboard";

    toast({
      title: "Account Verified",
      description: "Redirecting...",
    });
    router.push(redirectUrl);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to you. Please enter it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="_ _ _ _ _ _"
                      {...field}
                      className="text-center text-2xl tracking-[1.5rem] font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Verify Account
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">Didn't receive a code?</p>
          <Button variant="link" className="text-primary">
            Resend Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
