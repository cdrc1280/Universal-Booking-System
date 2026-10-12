<?php

declare(strict_types=1);

use App\Domains\Permission\DTOs\PermissionData;
use App\Domains\Role\DTOs\RoleData;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('transforms Spatie Role model into typed RoleData DTO with mapped permissions', function (): void {
    $perm = Permission::create([
        'name' => 'manage-staff',
        'guard_name' => 'web',
    ]);

    $role = Role::create([
        'name' => 'manager',
        'guard_name' => 'web',
    ]);
    $role->syncPermissions([$perm->name]);
    $role->load('permissions');

    $data = RoleData::fromModel($role);

    expect($data)->toBeInstanceOf(RoleData::class);
    expect($data->id)->toBe($role->id);
    expect($data->name)->toBe('manager');
    expect($data->guard_name)->toBe('web');
    expect($data->users_count)->toBe(0);
    expect($data->permissions)->toHaveCount(1);
    expect($data->permissions[0])->toBeInstanceOf(PermissionData::class);
    expect($data->permissions[0]->name)->toBe('manage-staff');
});
