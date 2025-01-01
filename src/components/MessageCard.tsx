import { Message } from "@/model/User.model";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiResponse } from "@/types/ApiResponse";

function MessageCard({
  message,
  onMessageDelete,
}: {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}) {
  const createdDate = new Date(message.createdAt);

  const { toast } = useToast();

  async function handleDeleteConfirm() {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);
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

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-4 flex justify-between">
        <p>{message.content}</p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button size="sm" variant="destructive">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
      <CardFooter className="text-sm ">
        <p>{createdDate.toDateString()}</p>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
