<?php

namespace App\Repositories;

use App\Models\Registration;

interface RegistrationRepositoryInterface
{
    public function create(int $userId, int $eventId): Registration;
    public function hasUserRegistration(int $eventId, int $userId): bool;

}