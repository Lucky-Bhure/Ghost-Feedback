'use client';

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type AcceptForm = {
  acceptMessages: boolean | undefined;
};

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const form = useForm<AcceptForm>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: undefined, 
    },
  });

  const { control, watch, reset } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse & { isAcceptingMessage?: boolean }>(
        `/api/accept-messages`
      );

      reset({
        acceptMessages: !!response.data.isAcceptingMessage,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [reset]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) toast.message("Refreshing latest messages");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data.message !== "User not found") {
        toast.error(axiosError.response?.data.message || "Failed to fetch messages");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async (value: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: value,
      });

      reset({ acceptMessages: value });

      toast.message(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="w-full h-[10vh] text-center mt-10">
        <p className="text-2xl font-800">Please Login</p>
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = profileUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.message("Profile URL copied.");
    } catch (err) {
      toast.error("Failed to copy URL.");
    }
  };

  /** If switch value hasn’t loaded yet, show placeholder */
  if (acceptMessages === undefined || isSwitchLoading) {
    return (
      <div className="w-full text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        <p className="mt-2 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto px-6 bg-white rounded w-full max-w-6xl">
      <div className="pb-4">
        <p className='mr-4 font-800 text-2xl'>
          Welcome, {user?.username || user?.email}
        </p>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">Dashboard</h1>

      {/* PROFILE URL */}
      <div className="mb-4">
        <h2 className="text-md md:text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex flex-col md:flex-row md:items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className="w-fit">Copy</Button>
        </div>
      </div>

      {/* SWITCH */}
      <div className="mb-4 flex items-center">
        <Controller
          name="acceptMessages"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              disabled={isSwitchLoading}
              onCheckedChange={async (value) => {
                field.onChange(value);
                await handleSwitchChange(value);
              }}
            />
          )}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      {/* REFRESH BUTTON */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      {/* MESSAGES GRID */}
      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onDelete={() => fetchMessages(false)}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
