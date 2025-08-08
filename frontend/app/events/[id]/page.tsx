"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { eventsApi } from "@/lib/api";

type Event = {
  id: string;
  title: string;
  starts_at: string;
  location: string;
  description?: string;
};

export default function EventPageClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.get(id as string);
      setEvent(res.data.event);
      setRegistered(res.data.is_registered);
    } catch (e) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please log in to register.");
      return;
    }

    if (registered) return;

    setLoading(true);
    try {
      await eventsApi.register(id);
      setRegistered(true);
      toast.success("Successfully registered!");
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span>Loading event…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-600">
        <span>{error}</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center py-20">
        <span>Event not found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-lg overflow-hidden bg-gray-200"
      >
        <Image
          src="/assets/event.webp"
          alt={event.title}
          fill
          className="object-cover"
        />
      </AspectRatio>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="text-gray-600">
          <strong>Date:</strong> {new Date(event.starts_at).toLocaleString()}
        </p>
        <p className="text-gray-600">
          <strong>Location:</strong> {event.location}
        </p>
        {event.description && (
          <p className="text-gray-800">{event.description}</p>
        )}
      </div>

      <div>
        <Button onClick={handleRegister} disabled={registered}>
          {registered ? "Already Register" : "Register Now"}
        </Button>
      </div>
    </div>
  );
}
