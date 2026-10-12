<?php

declare(strict_types=1);

namespace App\Domains\Role\Actions;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class CreateRoleAction
{
    /**
     * @param array{name: string, guard_name?: string, permissions?: array<int, string>} $data
     */
    public function execute(array $data): Role
    {
        return DB::transaction(function () use ($data): Role {
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
            ]);

            if (! empty($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            return $role->load('permissions');
        });
    }
}