"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { verifySchemaValidation } from "@/schemas/verifySchema";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function InputOTPForm() {
  const { username } = useParams();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchemaValidation>>({
    resolver: zodResolver(verifySchemaValidation),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof verifySchemaValidation>) {
    console.log(data);

    try {
      const response = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      console.log(response);

      if (response.data.success) {
        toast({
          description: response.data.message,
        });

        router.replace("/signin");
      }
    } catch (error) {
      console.log(error);
      toast({
        // @ts-ignore
        description: error.response.data.message,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full space-y-8 p-10 bg-zinc-900/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-zinc-800">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
          <p className="text-zinc-400 text-sm">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-zinc-200">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-zinc-500 text-sm">
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
