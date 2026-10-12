<?php

declare(strict_types=1);

namespace App\Domains\Role\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

final class DeleteRoleAction
{
    /**
     * @throws ValidationException
     */
    public function execute(Role $role): void
    {
        if (strtolower($role->name) === 'admin') {
            throw ValidationException::withMessages([
                'role' => 'The system administrator role is protected and cannot be deleted.',
            ]);
        }

        $assignedCount = $role->users()->count();
        if ($assignedCount > 0) {
            throw ValidationException::withMessages([
                'role' => "Cannot delete role '{$role->name}' because {$assignedCount} active user(s) are assigned to it. Reassign or remove their roles first.",
            ]);
        }

        DB::transaction(function () use ($role): void {
            $role->syncPermissions([]);
            $role->delete();
        });
    }
}
