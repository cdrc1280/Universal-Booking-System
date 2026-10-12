<?php

declare(strict_types=1);

use App\Domains\Role\Actions\UpsertRoleAction;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('creates a new role with normalized lowercase name and synced permissions', function (): void {
    $permissionRecord = Permission::create([
        'name' => 'manage-schedules',
        'guard_name' => 'web',
    ]);

    $action = new UpsertRoleAction();

    $role = $action->execute([
        'name' => '  COORDINATOR  ',
        'permissions' => [$permissionRecord->name],
    ]);

    expect($role)->toBeInstanceOf(Role::class);
    expect($role->name)->toBe('coordinator');
    expect($role->hasPermissionTo('manage-schedules'))->toBeTrue();
});

it('updates existing role name and re-synchronizes permissions', function (): void {
    $permA = Permission::create(['name' => 'view-reports', 'guard_name' => 'web']);
    $permB = Permission::create(['name' => 'export-reports', 'guard_name' => 'web']);

    $role = Role::create(['name' => 'auditor', 'guard_name' => 'web']);
    $role->syncPermissions([$permA->name]);

    $action = new UpsertRoleAction();

    $updated = $action->execute([
        'name' => 'senior-auditor',
        'permissions' => [$permB->name],
    ], $role);

    expect($updated->id)->toBe($role->id);
    expect($updated->name)->toBe('senior-auditor');
    expect($updated->hasPermissionTo('export-reports'))->toBeTrue();
    expect($updated->hasPermissionTo('view-reports'))->toBeFalse();
});
