<?php

declare(strict_types=1);

namespace App\Domains\Role\Actions;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

final class UpsertRoleAction
{
    /**
     * @param array{
     *     name: string,
     *     permissions?: array<int, string>
     * } $payload
     */
    public function execute(array $payload, ?Role $role = null): Role
    {
        return DB::transaction(function () use ($payload, $role): Role {
            $normalizedName = strtolower(trim($payload['name']));

            if ($role) {
                $role->update(['name' => $normalizedName]);
            } else {
                $role = Role::create([
                    'name' => $normalizedName,
                    'guard_name' => 'web',
                ]);
            }

            if (array_key_exists('permissions', $payload)) {
                $role->syncPermissions($payload['permissions'] ?? []);
            }

            return $role->fresh(['permissions']);
        });
    }
}
