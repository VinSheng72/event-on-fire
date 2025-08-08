<?php
// app/Services/EventService.php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepositoryInterface;
use App\Repositories\RegistrationRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class UserService
{
    public function __construct(
        protected EventRepositoryInterface $event,
        protected UserRepositoryInterface $user,
        protected RegistrationRepositoryInterface $register
    ) {}

    public function getUserEvent()
    {
        $user = $this->user->findById(Auth::user()->id);
        $events = $user->events;

        return response()->json(['data' => $events ], 200);
    }
}
