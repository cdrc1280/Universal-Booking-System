<?php

declare(strict_types=1);

namespace App\Domains\User\Actions;

use App\Domains\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

final class UpsertUserAction
{
    /**
     * @param array{
     *     name: string,
     *     email: string,
     *     password?: ?string,
     *     roles?: array<int, string>
     * } $payload
     */
    public function execute(array $payload, ?User $user = null): User
    {
        return DB::transaction(function () use ($payload, $user): User {
            $attributes = [
                'name' => $payload['name'],
                'email' => $payload['email'],
            ];

            if (!empty($payload['password'])) {
                $attributes['password'] = Hash::make($payload['password']);
            }

            if ($user) {
                $user->update($attributes);
            } else {
                /** @var User $user */
                $user = User::query()->create($attributes);
            }

            if (array_key_exists('roles', $payload)) {
                $user->syncRoles($payload['roles'] ?? []);
            }

            return $user->fresh(['roles']);
        });
    }
}
