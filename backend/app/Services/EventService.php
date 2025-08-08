<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepositoryInterface;
use App\Repositories\RegistrationRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class EventService
{
    public function __construct(
        protected EventRepositoryInterface $event,
        protected UserRepositoryInterface $user,
        protected RegistrationRepositoryInterface $register
    ) {}

    public function all(?string $search = null): Collection
    {
        if ($search !== null && $search !== '') {
            return $this->event->search($search);
        }
        return $this->event->all();
    }


    public function hasUserRegistration($userId, $eventId): bool
    {
        return $this->register->hasUserRegistration($userId, $eventId);
    }


    public function find(int $eventId, ?int $userId): array
    {

        $event = $this->event->find($eventId);
        $isRegistered = false;
        if ($userId !== null) {
            $isRegistered = $this->hasUserRegistration($userId, $eventId);
        }

        return [
            'event'          => $event,
            'is_registered'  => $isRegistered,
        ];
    }

    public function create(array $data): Event
    {
        return $this->event->create($data);
    }

    public function update(int $id, array $data): Event
    {
        $event = $this->event->update($id, $data);
        return $event;
    }

    public function delete(int $id): bool
    {
        return $this->event->delete($id);
    }

    public function getPopular(int $limit = 4): Collection
    {
        return $this->event->getPopular($limit);
    }

    public function getUpcoming(int $limit = 10): Collection
    {
        return $this->event->getUpcoming($limit);
    }

    public function register($event): JsonResponse
    {
        $userId  = Auth::user()->id;
        $eventId = $event->id;

        if ($this->hasUserRegistration($userId, $eventId)) {
            return response()->json(['message' => 'Already registered'], 409);
        }
        
        $this->register->create($userId, $eventId);
        return response()->json(['message' => 'Success'], 200);
    }
}
