import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";

export default function EventCard({event} : any) {
  return (
    <Link key={event.id} href={`/events/${event.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg">
        <AspectRatio ratio={16 / 9} className="bg-gray-200">
          <Image
            src="/assets/event.webp"
            alt={event.title}
            fill
            className="object-cover"
          />
        </AspectRatio>
        <div className="p-4">
          <h2 className="font-semibold">{event.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(event.starts_at).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{event.location}</p>
        </div>
      </div>
    </Link>
  );
}

