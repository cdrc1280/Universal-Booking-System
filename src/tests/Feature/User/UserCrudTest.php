<?php

declare(strict_types=1);

namespace Tests\Feature\User;

use App\Domains\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

it('renders the users index page with inertia and available roles', function (): void {
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

    $admin = User::factory()->create();
    $admin->assignRole($adminRole);

    $response = $this->actingAs($admin)->get(route('users.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/index')
            ->has('users.data')
            ->has('available_roles')
            ->where('available_roles', fn ($roles) => in_array('admin', $roles->all(), true))
        );
});

it('creates a new user account and synchronizes assigned roles', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

    $payload = [
        'name' => 'Sarah Connor',
        'email' => 'sarah@example.com',
        'password' => 'SecurePass123!',
        'roles' => ['staff'],
    ];

    $response = $this->actingAs($admin)->post(route('users.store'), $payload);

    $response->assertRedirect(route('users.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'name' => 'Sarah Connor',
        'email' => 'sarah@example.com',
    ]);

    $createdUser = User::where('email', 'sarah@example.com')->firstOrFail();
    expect($createdUser->hasRole('staff'))->toBeTrue();
    expect(Hash::check('SecurePass123!', $createdUser->password))->toBeTrue();
});

it('validates email uniqueness on user creation', function (): void {
    $admin = User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->actingAs($admin)
        ->from(route('users.index'))
        ->post(route('users.store'), [
            'name' => 'Duplicate User',
            'email' => 'existing@example.com',
            'password' => 'SecurePass123!',
        ]);

    $response->assertRedirect(route('users.index'))
        ->assertSessionHasErrors(['email']);
});

it('updates an existing user and syncs roles', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
    $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

    $user = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);
    $user->assignRole($customerRole);

    $response = $this->actingAs($admin)->put(route('users.update', $user), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'roles' => ['staff'],
    ]);

    $response->assertRedirect(route('users.index'))
        ->assertSessionHas('success');

    $user->refresh();
    expect($user->name)->toBe('Updated Name');
    expect($user->email)->toBe('updated@example.com');
    expect($user->hasRole('staff'))->toBeTrue();
    expect($user->hasRole('customer'))->toBeFalse();
});

it('preserves existing password when password is not provided on update', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $originalHash = Hash::make('OriginalPassword123!');
    $user = User::factory()->create([
        'password' => $originalHash,
    ]);

    $response = $this->actingAs($admin)->put(route('users.update', $user), [
        'name' => 'Preserved Pass User',
        'email' => $user->email,
        'password' => '',
    ]);

    $response->assertRedirect(route('users.index'));

    $user->refresh();
    expect($user->password)->toBe($originalHash);
});

it('prevents a user from deleting their own account', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $response = $this->actingAs($admin)
        ->from(route('users.index'))
        ->delete(route('users.destroy', $admin));

    $response->assertSessionHasErrors(['user']);
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

it('successfully deletes another user account', function (): void {
    $admin = User::factory()->create();
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin->assignRole($adminRole);

    $targetUser = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $targetUser));

    $response->assertRedirect(route('users.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
});
