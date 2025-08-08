"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import { eventsApi, Event } from "@/lib/api";

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const fetchMyEvents = async () => {
    try {
      const res = await eventsApi.getUserEvent();
      setEvents(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load your events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span>Loading your events…</span>
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

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <span>You haven’t registered for any events yet.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">My Registered Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
}
