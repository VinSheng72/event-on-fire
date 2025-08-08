<?php

namespace App\Repositories;

use App\Models\Event;
use Illuminate\Support\Collection;

interface EventRepositoryInterface
{
    public function all(): Collection;
    public function find(int $id): Event;
    public function search(?string $keyword): Collection;
    public function create(array $data): Event;
    public function update(int $id, array $data): Event;
    public function delete(int $id): bool;
    public function getPopular(int $limit = 4): Collection;
    public function getUpcoming(int $limit = 10): Collection;
}