'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';;
import { toast } from 'sonner';
import EventForm, { EventFormValues } from '@/components/EventForm';
import { Event, eventsApi } from '@/lib/api';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initial, setInitial] = useState<EventFormValues | null>(null);

  useEffect(() => {
    (async () => {
      try {
        
        const res = await eventsApi.get(id as string);
        const ev : Event = res.data.event;
        const dtLocal = new Date(ev.starts_at).toISOString().slice(0, 16);
        setInitial({
          title:       ev.title,
          starts_at:   dtLocal,
          location:    ev.location,
          description: ev.description ?? '',
        });
      } catch {
        toast.error('Failed to load event');
        router.back();
      }
    })();
  }, [id, router]);

  if (!initial) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  const handleUpdate = async (vals: EventFormValues) => {
    const dt = new Date(vals.starts_at);
    const date = dt.toISOString().slice(0, 19).replace('T', ' ');
    await eventsApi.update(id as string, {...vals , starts_at : date})
    toast.success('Event updated!');
    router.push('/admin/events');
  };

  return (
    <EventForm
      title="Edit Event"
      description="Update the event details below."
      initialValues={initial}
      onSubmit={handleUpdate}
    />
  );
}
