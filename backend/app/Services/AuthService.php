<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\NewAccessToken;

class AuthService
{
    protected UserRepositoryInterface $users;

    public function __construct(UserRepositoryInterface $users)
    {
        $this->users = $users;
    }

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->users->create($data);

        $user->assignRole('user');

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $data): array
    {
        $user = $this->users->findByEmail($data['email']);

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid Email'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}
