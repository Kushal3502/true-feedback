import { Message } from "@/model/User.model";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

function MessageCard({ message }: { message: Message }) {
  const createdDate = new Date(message.createdAt);

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-4 flex justify-between">
        <p>{message.content}</p>
        <Button size="sm" variant="destructive">
          <Trash2 />
        </Button>
      </CardContent>
      <CardFooter className="text-sm ">
        <p>{createdDate.toDateString()}</p>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
