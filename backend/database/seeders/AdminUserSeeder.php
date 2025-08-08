<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Admin',
                'password' => bcrypt('test123'), 
            ]
        );
        $admin->assignRole('admin');

        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name'     => 'User',
                'password' => bcrypt('test123'),
            ]
        );
        $user->assignRole('user');
    }
}