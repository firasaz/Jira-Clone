"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { registerSchema } from "@/lib/auth/schemas";
import { useRegister } from "@/hooks/auth/use-register";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export const RegisterCard = () => {
  const { mutate } = useRegister();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate(values);
  };

  return (
    <Card className="size-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center p-7">
        <CardTitle className="text-2xl">Sign Up!</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href={"/privacy"} className="text-blue-700">
            <span>Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href={"/privacy"} className="text-blue-700">
            <span>Terms of Service</span>
          </Link>{" "}
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormItem>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
                      />
                    </FormItem>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button disabled={false} size="lg" className="w-full">
              Log in
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
        <CardContent className="flex flex-col gap-y-4 p-7">
          <Button
            disabled={false}
            size={"lg"}
            variant={"secondary"}
            className="w-full"
          >
            <FcGoogle className="mr-2 size-5" />
            Login with Google
          </Button>
          <Button
            disabled={false}
            size={"lg"}
            variant={"secondary"}
            className="w-full"
          >
            <FaGithub className="mr-2 size-5" />
            Login with Github
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};
