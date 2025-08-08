'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import EventForm, { EventFormValues } from '@/components/EventForm';
import { eventsApi } from '@/lib/api';

export default function CreateEventPage() {
  const router = useRouter();

  const handleCreate = async (vals: EventFormValues) => {
    const dt = new Date(vals.starts_at);
    const date = dt.toISOString().slice(0, 19).replace('T', ' ');
    await eventsApi.create({ ...vals, starts_at: date,})
    toast.success('Event created!');
    router.push('/admin/events');
  };

  return (
    <EventForm
      title="Create New Event"
      description="Fill in the details below to schedule your event."
      onSubmit={handleCreate}
    />
  );
}
