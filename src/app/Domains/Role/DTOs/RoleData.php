<?php

declare(strict_types=1);

namespace App\Domains\Role\DTOs;

use App\Domains\Permission\DTOs\PermissionData;
use Spatie\LaravelData\Data;
use Spatie\Permission\Models\Role;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RoleData extends Data
{
    /**
     * @param array<int, PermissionData> $permissions
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $guard_name,
        public int $users_count,
        public array $permissions = [],
        public ?string $created_at = null,
    ) {}

    public static function fromModel(Role $role): self
    {
        return new self(
            id: $role->id,
            name: $role->name,
            guard_name: $role->guard_name,
            users_count: (int) ($role->users_count ?? 0),
            permissions: PermissionData::collect($role->permissions)->all(),
            created_at: $role->created_at?->toIso8601String(),
        );
    }
}