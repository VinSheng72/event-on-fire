"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useDialogStore from "@/store/useDialogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Event, eventsApi } from "@/lib/api";
import { useDebounce } from "use-debounce";
import apiClient from "@/lib/apiClient";

export default function AdminEvents() {
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 300);

  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const { onOpen, onClose } = useDialogStore();
  const logout = useAuthStore((s) => s.logout);

  const notify = async () => await eventsApi.notify("Maintenance Alert")

  const load = async () => {
    try {
      const res = await eventsApi.list(value);
      setEvents(res.data.data);
    } catch {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    load();
  }, [value]);

  const handleRowActionClick = (event: Event) => {
    onOpen({
      title: "Delete Confirmation",
      description: `Are you sure you want to delete "${event.title}"?`,
      cancelLabel: "Cancel",
      actionLabel: "Delete",
      onAction: async () => {
        try {
          await eventsApi.delete(event.id);
          toast.success("Deleted successfully");
          await load();
        } catch {
          toast.error("Delete failed");
        } finally {
          onClose();
        }
      },
      onCancel: () => onClose(),
    });
  };

  const columns: ColumnDef<Event>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "starts_at", header: "Start Date" },
    { accessorKey: "location", header: "Location" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => router.push(`/admin/events/${row.original.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              handleRowActionClick(row.original);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <Input
          placeholder="Search events..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1 ">
          <Button onClick={notify} variant="outline" size="sm" type="button">
            Send Notification
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/events/create")}
          >
            Create
          </Button>
          <Button onClick={async () => await logout()}>Logout</Button>
        </div>
      </div>
      <DataTable columns={columns} data={events} />
    </div>
  );
}
