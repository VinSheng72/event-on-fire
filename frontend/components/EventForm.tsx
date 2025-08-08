"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  starts_at: z.string().min(1, "Date & time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  title: string;
  description?: string;
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
}

export default function EventForm({
  title,
  description,
  initialValues,
  onSubmit,
}: EventFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      starts_at: initialValues?.starts_at ?? "",
      location: initialValues?.location ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const submitHandler = async (vals: EventFormValues) => {
    await onSubmit(vals);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Event Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="starts_at"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Description (optional)"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {title.startsWith("Edit") ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
