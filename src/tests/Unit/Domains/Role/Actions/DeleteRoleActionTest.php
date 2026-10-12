<?php

declare(strict_types=1);

use App\Domains\Role\Actions\DeleteRoleAction;
use App\Domains\User\Models\User;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('prevents deleting the system administrator role', function (): void {
    $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    $action = new DeleteRoleAction();

    expect(fn () => $action->execute($adminRole))
        ->toThrow(ValidationException::class);
});

it('prevents deleting a role that has active users assigned to it', function (): void {
    $role = Role::create(['name' => 'receptionist', 'guard_name' => 'web']);
    $user = User::query()->create([
        'name' => 'Sarah Connor',
        'email' => 'sarah@example.com',
        'password' => bcrypt('password123'),
    ]);
    $user->assignRole($role);

    $action = new DeleteRoleAction();

    expect(fn () => $action->execute($role))
        ->toThrow(ValidationException::class);
});

it('successfully deletes an unassigned custom role', function (): void {
    $perm = Permission::create(['name' => 'manage-inventory', 'guard_name' => 'web']);
    $role = Role::create(['name' => 'inventory-clerk', 'guard_name' => 'web']);
    $role->syncPermissions([$perm->name]);

    $action = new DeleteRoleAction();
    $action->execute($role);

    expect(Role::query()->where('name', 'inventory-clerk')->exists())->toBeFalse();
});
