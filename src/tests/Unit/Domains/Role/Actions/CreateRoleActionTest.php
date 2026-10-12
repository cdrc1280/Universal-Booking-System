<?php

declare(strict_types=1);

use App\Domains\Role\Actions\CreateRoleAction;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('creates a new role with assigned permissions within a transaction', function (): void {
    $permissionRecord = Permission::create([
        'name' => 'view-analytics',
        'guard_name' => 'web',
    ]);

    $action = new CreateRoleAction();

    $role = $action->execute([
        'name' => 'analyst',
        'guard_name' => 'web',
        'permissions' => [$permissionRecord->name],
    ]);

    expect($role)->toBeInstanceOf(Role::class);
    expect($role->name)->toBe('analyst');
    expect($role->guard_name)->toBe('web');
    expect($role->hasPermissionTo('view-analytics'))->toBeTrue();
});
