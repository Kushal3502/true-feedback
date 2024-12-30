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

function Dashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { register, watch, setValue } = useForm<
    z.infer<typeof acceptMessageSchemaValidation>
  >({
    resolver: zodResolver(acceptMessageSchemaValidation),
  });

  const acceptMessages = watch("accepting");

  const shareUrl = `${window.location.origin}/u/${session?.user.username}`;

  async function fetchAcceptMessageStatus() {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      console.log(response);

      setValue("accepting", response.data.isAcceptingMessages);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
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

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    fetchAcceptMessageStatus();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <div>
        <h2>Copy your unique link</h2>
        <div className=" flex ">
          <Input type="text" disabled value={shareUrl} />
          <Button onClick={handleCopyToClipboard} disabled={copied}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className=" flex items-center gap-2">
          <Switch
            {...register("accepting")}
            checked={acceptMessages}
            onCheckedChange={toggleAcceptMessage}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Dashboard;
