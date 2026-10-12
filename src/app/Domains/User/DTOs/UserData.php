<?php

declare(strict_types=1);

namespace App\Domains\User\DTOs;

use App\Domains\User\Models\User;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $created_at,
        /** @var array<int, string> */
        public array $roles = [],
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            created_at: $user->created_at?->toIso8601String(),
            roles: $user->roles->pluck('name')->all(),
        );
    }
}