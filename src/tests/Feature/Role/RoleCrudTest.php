<?php

declare(strict_types=1);

namespace Tests\Feature\Role;

use App\Domains\User\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('renders the roles index page with inertia and lists existing roles', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $manageUsers = Permission::firstOrCreate(['name' => 'manage-users', 'guard_name' => 'web']);
    $role = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
    $role->givePermissionTo($manageUsers);

    $response = $this->actingAs($admin)->get(route('roles.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('role/index')
            ->has('roles')
            ->has('permissions')
        );
});

it('creates a new security role and attaches permissions', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    Permission::firstOrCreate(['name' => 'create-bookings', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'cancel-bookings', 'guard_name' => 'web']);

    $response = $this->actingAs($admin)->post(route('roles.store'), [
        'name' => 'receptionist',
        'permissions' => ['create-bookings', 'cancel-bookings'],
    ]);

    $response->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $role = Role::where('name', 'receptionist')->firstOrFail();
    expect($role->hasPermissionTo('create-bookings'))->toBeTrue();
    expect($role->hasPermissionTo('cancel-bookings'))->toBeTrue();
});

it('validates role name uniqueness', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    Role::firstOrCreate(['name' => 'existing-role', 'guard_name' => 'web']);

    $response = $this->actingAs($admin)
        ->from(route('roles.index'))
        ->post(route('roles.store'), [
            'name' => 'existing-role',
        ]);

    $response->assertRedirect(route('roles.index'))
        ->assertSessionHasErrors(['name']);
});

it('updates an existing security role and syncs permissions', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $perm1 = Permission::firstOrCreate(['name' => 'perm-one', 'guard_name' => 'web']);
    $perm2 = Permission::firstOrCreate(['name' => 'perm-two', 'guard_name' => 'web']);

    $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
    $role->givePermissionTo($perm1);

    $response = $this->actingAs($admin)->put(route('roles.update', $role), [
        'name' => 'senior-editor',
        'permissions' => ['perm-two'],
    ]);

    $response->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $role->refresh();
    expect($role->name)->toBe('senior-editor');
    expect($role->hasPermissionTo('perm-two'))->toBeTrue();
    expect($role->hasPermissionTo('perm-one'))->toBeFalse();
});

it('prevents deleting the system administrator role', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $response = $this->actingAs($admin)
        ->from(route('roles.index'))
        ->delete(route('roles.destroy', $adminRole));

    $response->assertSessionHasErrors(['role']);
    $this->assertDatabaseHas('roles', ['name' => 'admin']);
});

it('prevents deleting a role that has active users assigned to it', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $supervisorRole = Role::create(['name' => 'supervisor', 'guard_name' => 'web']);
    $user = User::factory()->create();
    $user->assignRole($supervisorRole);

    $response = $this->actingAs($admin)
        ->from(route('roles.index'))
        ->delete(route('roles.destroy', $supervisorRole));

    $response->assertSessionHasErrors(['role']);
    $this->assertDatabaseHas('roles', ['name' => 'supervisor']);
});

it('successfully deletes an unused custom role', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $roleToDelete = Role::create(['name' => 'temporary-role', 'guard_name' => 'web']);

    $response = $this->actingAs($admin)->delete(route('roles.destroy', $roleToDelete));

    $response->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('roles', ['name' => 'temporary-role']);
});
