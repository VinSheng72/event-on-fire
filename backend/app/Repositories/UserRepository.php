<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    
    public function findById($id): User
    {
        return User::find($id); 
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function createSubAdmin(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $user->assignRole('sub-admin');
        return $user;
    }
}