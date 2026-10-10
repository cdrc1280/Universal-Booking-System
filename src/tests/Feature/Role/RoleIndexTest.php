<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('renders the roles index page with inertia and lists existing roles', function (): void {
    $admin = User::factory()->create();

    $manageUsers = Permission::firstOrCreate(['name' => 'manage-users', 'guard_name' => 'web']);
    $role = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
    $role->givePermissionTo($manageUsers);

    $response = $this->actingAs($admin)->get(route('roles.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('role/index')
            ->has('roles')
            ->has('permissions')
            ->where('roles.0.name', fn ($name) => in_array($name, ['admin', 'staff', 'customer', 'manager'], true))
        );
});