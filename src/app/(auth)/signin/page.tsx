"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchemaValidation } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";

function Signin() {
  const form = useForm<z.infer<typeof signInSchemaValidation>>({
    resolver: zodResolver(signInSchemaValidation),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  });

  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof signInSchemaValidation>) {
    console.log(data);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.identifier,
        password: data.password,
      });

      console.log(response);

      if (response?.error) {
        toast({
          description: response.error,
        });
      } else {
        toast({
          description: "Welcome back!!!",
        });

        if (response?.url) {
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">
            Sign in to continue getting True Feedback
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@gmail.com"
                      {...field}
                      className="w-full px-3 py-2 "
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="w-full px-3 py-2 "
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 text-base font-semibold rounded-md transition duration-200"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className=" text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Signup
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signin;
