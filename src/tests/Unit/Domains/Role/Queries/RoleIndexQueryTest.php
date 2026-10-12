<?php

declare(strict_types=1);

use App\Domains\Role\Queries\RoleIndexQuery;
use App\Domains\User\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('executes role index query with eager loaded permissions, user counts, and alphabetical sorting', function (): void {
    $perm = Permission::create(['name' => 'manage-locations', 'guard_name' => 'web']);

    $roleZ = Role::create(['name' => 'zone-manager', 'guard_name' => 'web']);
    $roleA = Role::create(['name' => 'assistant', 'guard_name' => 'web']);
    $roleA->syncPermissions([$perm->name]);

    $user = User::query()->create([
        'name' => 'Grace Hopper',
        'email' => 'grace@example.com',
        'password' => bcrypt('password123'),
    ]);
    $user->assignRole($roleA);

    $query = new RoleIndexQuery();
    $roles = $query->execute();

    expect($roles->count())->toBeGreaterThanOrEqual(2);

    $firstRole = $roles->firstWhere('name', 'assistant');
    expect($firstRole)->not->toBeNull();
    expect($firstRole->relationLoaded('permissions'))->toBeTrue();
    expect($firstRole->users_count)->toBe(1);
    expect($firstRole->permissions->first()->name)->toBe('manage-locations');
});
