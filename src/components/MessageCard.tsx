"use client";

import { Card, CardHeader, CardTitle } from "./ui/card";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Message } from "@/model/User";
import axios from "axios";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const getIdAsString = (id: any): string | null => {
    if (!id && id !== 0) return null;
    // If it's an object (Mongoose ObjectId), try toString()
    if (typeof id === "object") {
      try {
        if (typeof id.toString === "function") {
          const s = id.toString();
          return s;
        }
        // maybe { $oid: '...' }
        if (typeof id.$oid === "string") return id.$oid;
        return null;
      } catch {
        return null;
      }
    }
    // primitive -> coerce to string
    return String(id);
  };

  const handleDeleteConfirm = async () => {
    const id = getIdAsString(message._id);

    // Debug logs to help you catch wrong ids
    console.log("MessageCard: attempting delete for id:", message._id, "->", id);

    if (!id) {
      toast.error("Missing message id — cannot delete");
      console.error("Delete aborted: message._id is missing or invalid:", message._id);
      return;
    }

    try {
      const response = await axios.delete<{ success: boolean; message: string }>(
        `/api/delete-message/${encodeURIComponent(id)}`
      );

      // optimistic UI: remove immediately
      onMessageDelete(id);
      toast.success(response.data?.message || "Message deleted");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete message");
        console.error("Axios delete error:", error.response?.data ?? error.message);
      } else {
        toast.error("Failed to delete message");
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{message.content}</CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
