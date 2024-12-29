"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchemaValidation } from "@/schemas/signupSchema";
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
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function Signup() {
  const form = useForm<z.infer<typeof signUpSchemaValidation>>({
    resolver: zodResolver(signUpSchemaValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [usernameValidationMessage, setUsernameValidationMessage] =
    useState("");
  const [isChecking, setIsChecking] = useState(false);

  // this delays the call to backend
  const debouncedUsername = useDebounce(username, 1000);

  async function onSubmit(data: z.infer<typeof signUpSchemaValidation>) {
    try {
      const response = await axios.post("/api/signup", data);
      console.log(response);

      toast({
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong",
      });
    }
  }

  useEffect(() => {
    async function checkUsername() {
      if (debouncedUsername) {
        setIsChecking(true);
        setUsernameValidationMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          );

          setUsernameValidationMessage(response.data.message);
        } catch (error) {
          setUsernameValidationMessage("Something went wrong");
        } finally {
          setIsChecking(false);
        }
      }
    }

    checkUsername();
  }, [debouncedUsername]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">
            Sign up to get started with True Feedback
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="w-full px-3 py-2 "
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {isChecking && <Loader2 className="animate-spin" />}
                    {!isChecking && usernameValidationMessage && (
                      <p
                        className={`text-sm ${
                          usernameValidationMessage === "Username is available"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameValidationMessage}
                      </p>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
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
              className="w-full py-2 px-4 font-semibold rounded-md transition duration-200"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/signin"
            className=" text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Signin
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
