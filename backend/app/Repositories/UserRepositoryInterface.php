<?php

namespace App\Repositories;

use App\Models\User;

interface UserRepositoryInterface
{

    public function findById($id): User;
    public function create(array $data): User;
    public function findByEmail(string $email): ?User;
    public function createSubAdmin(array $data): User;
}
