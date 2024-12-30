"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { acceptMessageSchemaValidation } from "@/schemas/acceptMessageSchema";
import { Message } from "@/model/User.model";
import MessageCard from "@/components/MessageCard";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { register, watch, setValue } = useForm<
    z.infer<typeof acceptMessageSchemaValidation>
  >({
    resolver: zodResolver(acceptMessageSchemaValidation),
  });

  const acceptMessages = watch("accepting");

  const shareUrl = `${window.location.origin}/u/${session?.user.username}`;

  async function fetchAcceptMessageStatus() {
    try {
      const response = await axios.get("/api/accept-message");
      console.log(response);

      setValue("accepting", response.data.isAcceptingMessages);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  async function toggleAcceptMessage() {
    console.log(acceptMessages);

    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessage: !acceptMessages,
      });
      console.log(response);

      setValue("accepting", !acceptMessages);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  async function fetchMessages() {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/get-messages");
      console.log(response);

      setMessages(response.data.data || []);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    fetchAcceptMessageStatus();
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      <Card className=" shadow-md my-6">
        <CardHeader>
          <CardTitle>Share your unique link</CardTitle>
        </CardHeader>
        <CardContent className=" flex gap-3">
          <Input type="text" disabled value={shareUrl} className="flex-1" />
          <Button
            onClick={handleCopyToClipboard}
            disabled={copied}
            className="min-w-[100px]"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </CardContent>
        <CardFooter>
          <Switch
            {...register("accepting")}
            checked={acceptMessages}
            onCheckedChange={toggleAcceptMessage}
            disabled={isSwitchLoading}
          />
          <span className="ml-2 text-sm font-medium">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </CardFooter>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages &&
            messages.map((item) => (
              <MessageCard message={item} key={item._id} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
