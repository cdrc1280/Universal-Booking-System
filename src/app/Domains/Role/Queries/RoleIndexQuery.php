<?php

declare(strict_types=1);

namespace App\Domains\Role\Queries;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

class RoleIndexQuery
{
    /**
     * @return Collection<int, Role>
     */
    public function execute(): Collection
    {
        return Role::query()
            ->with('permissions')
            ->withCount('users')
            ->orderBy('name')
            ->get();
    }
}