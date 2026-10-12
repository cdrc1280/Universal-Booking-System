<?php

declare(strict_types=1);

namespace App\Domains\User\Queries;

use App\Domains\User\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserIndexQuery
{
    /**
     * @param array{search?: ?string, per_page?: int} $filters
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        return User::query()
            ->with('roles')
           ->when($filters['search'] ?? null, function ($query, string $search) {
                $normalized = strtolower(trim($search));
                $query->where(function ($q) use ($normalized) {
                    $q->whereRaw('LOWER(name) LIKE ?', ["%{$normalized}%"])
                      ->orWhereRaw('LOWER(email) LIKE ?', ["%{$normalized}%"]);
                });
            })
            ->latest('id')
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();
    }
}