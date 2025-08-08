<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Support\Collection;

class EventRepository implements EventRepositoryInterface
{
    public function all(): Collection
    {
        return Event::orderBy('id')->get();
    }

    public function find(int $id): Event
    {
        return Event::findOrFail($id);
    }

    public function search(?string $keyword): Collection
    {
        $query = Event::query();

        if ($keyword) {
            $query->where('title','like',"%{$keyword}%")
                ->orWhere('location','like',"%{$keyword}%");
        }

        return $query->orderBy('id')->get();
    }

    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function update(int $id, array $data): Event
    {
        $event = $this->find($id);
        $event->update($data);
        return $event;
    }

    public function delete(int $id): bool
    {
        return $this->find($id)->delete();
    }

    public function getPopular(int $limit = 4): Collection
    {
        return Event::withCount('registrations')->orderByDesc('registrations_count')->limit($limit)->get();
    }

    public function getUpcoming(int $limit = 10): Collection
    {
        return Event::query()->orderBy('starts_at', 'asc')->limit($limit)->get();
    }
}
