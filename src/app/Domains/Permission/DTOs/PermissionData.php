<?php

declare(strict_types=1);

namespace App\Domains\Permission\DTOs;

use Spatie\LaravelData\Data;
use Spatie\Permission\Models\Permission;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PermissionData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $guard_name,
        public ?string $created_at,
    ) {}

    public static function fromModel(Permission $permission): self
    {
        return new self(
            id: $permission->id,
            name: $permission->name,
            guard_name: $permission->guard_name,
            created_at: $permission->created_at?->toIso8601String(),
        );
    }
}