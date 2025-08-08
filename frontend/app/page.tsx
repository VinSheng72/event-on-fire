'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@radix-ui/react-label';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import EventCard from '@/components/EventCard';
import { eventsApi ,Event } from '@/lib/api';

import { configureEcho, useEchoPublic } from "@laravel/echo-react";
import { toast } from 'sonner';

const rawPort =
  process.env.NEXT_PUBLIC_REVERB_PORT ||
  process.env.REVERB_PORT ||
  "8080";
const wsPort = parseInt(rawPort, 10);

configureEcho({
  broadcaster: "reverb",
  key: "bqg9nvn3igxp2bmepytt",
  wsHost: "localhost",
  wsPort: wsPort,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});


export default function DashboardPage() {
  const [popular, setPopular]   = useState<Event[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  useEchoPublic("notification", "NotificationBroadcast", (e:any) => toast.error(e.message));


  useEffect(() => {
    eventsApi.getPopular().then(r => setPopular(r.data.data));
    eventsApi.getUpcoming().then(r => setUpcoming(r.data.data));
  }, []);

  const renderSection = (title: string, events: Event[]) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-2xl font-bold">{title}</Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => <EventCard key={evt.id} event={evt} />)}
      </div>
    </section>
  );

  return (
    <div className="space-y-12 p-6">
      {renderSection('🔥 Popular Events', popular)}
      {renderSection('⏳ Upcoming Events', upcoming)}
    </div>
  );
}
