<?php

namespace App\Repositories;

use App\Models\Registration;

class RegistrationRepository implements RegistrationRepositoryInterface
{
    public function hasUserRegistration(int $userId, int $eventId): bool
    {
        return Registration::where('user_id', $userId)->where('event_id', $eventId)->exists();
    }

    public function create(int $userId, int $eventId): Registration
    {
        return Registration::create([ 'user_id'  => $userId, 'event_id' => $eventId ]);
    }
}