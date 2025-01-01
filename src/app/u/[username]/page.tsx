"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { messageSchemaValidation } from "@/schemas/messageSchema";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";

function Message() {
  const { username } = useParams();
  const { toast } = useToast();

  const initialMessageString = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ];

  const [messages, setMessages] = useState<string[]>(initialMessageString);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchemaValidation>>({
    resolver: zodResolver(messageSchemaValidation),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof messageSchemaValidation>) {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });

      toast({
        description: response.data.message || "Message sent successfully!",
      });

      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        description:
          axiosError.response?.data.message ??
          "Something went wrong. Try again!",
        variant: "destructive",
      });
    }
  }

  async function getMessages() {
    setLoading(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      setMessages(response.data.questions || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        description:
          axiosError.response?.data.message ??
          "Something went wrong. Try again!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 flex flex-col mt-12 items-center">
      <div className="w-full border rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Public Profile Link</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Send anonymous message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none min-h-[100px] focus:ring-2 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="px-6 py-2 w-full sm:w-auto"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Separator className="my-6" />
      <div className="w-full">
        <h3 className="text-center text-2xl font-medium mb-6">
          Get Suggestions
        </h3>
        <div className="flex flex-col justify-center items-center">
          <Button
            onClick={getMessages}
            disabled={loading}
            className=" sm:w-auto mb-8 "
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting...
              </>
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <div className="">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Button
                  variant="outline"
                  key={index}
                  onClick={() => form.setValue("content", message)}
                  className="w-full mb-6 py-6 text-base font-semibold"
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-center text-gray-500">
                {loading
                  ? "Fetching suggestions..."
                  : "No suggestions available"}
              </p>
            )}
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="mt-8 w-full flex justify-center items-center gap-4">
        <p className="text-lg font-medium">Get Your Message Board</p>
        <Link href="/signup">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Message;
