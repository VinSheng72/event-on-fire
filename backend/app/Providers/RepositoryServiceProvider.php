<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\EventRepositoryInterface;
use App\Repositories\EventRepository;
use App\Repositories\RegistrationRepositoryInterface;
use App\Repositories\RegistrationRepository;
use App\Repositories\UserRepository;
use App\Repositories\UserRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            EventRepositoryInterface::class,
            EventRepository::class
        );
        $this->app->bind(
            RegistrationRepositoryInterface::class,
            RegistrationRepository::class
        );
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );
    }
}
