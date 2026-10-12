<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

it('redirects unauthenticated guests accessing settings to login', function (): void {
    $response = $this->get('/settings');

    $response->assertRedirect('/login');
});

it('renders the account settings page for authenticated users with inertia', function (): void {
    $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    $user = User::query()->create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'password' => bcrypt('password123'),
    ]);
    $user->assignRole($role);

    $response = $this->actingAs($user)->get('/settings');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/index')
        ->has('auth.user', fn ($prop) => $prop
            ->where('id', $user->id)
            ->where('name', 'Ada Lovelace')
            ->where('email', 'ada@example.com')
            ->where('roles', ['admin'])
        )
    );
});

it('updates user profile information successfully', function (): void {
    $user = User::query()->create([
        'name' => 'Charles Babbage',
        'email' => 'charles@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->actingAs($user)->put('/user/profile-information', [
        'name' => 'Charles P. Babbage',
        'email' => 'charles.babbage@example.com',
    ]);

    $response->assertSessionHasNoErrors();
    $user->refresh();

    expect($user->name)->toBe('Charles P. Babbage');
    expect($user->email)->toBe('charles.babbage@example.com');
});

it('updates user password when valid current password is provided', function (): void {
    $user = User::query()->create([
        'name' => 'Alan Turing',
        'email' => 'alan@example.com',
        'password' => Hash::make('CurrentSecret123!'),
    ]);

    $response = $this->actingAs($user)->put('/user/password', [
        'current_password' => 'CurrentSecret123!',
        'password' => 'NewSecretPassword999!',
        'password_confirmation' => 'NewSecretPassword999!',
    ]);

    $response->assertSessionHasNoErrors();
    $user->refresh();

    expect(Hash::check('NewSecretPassword999!', $user->password))->toBeTrue();
});

it('rejects password update when current password does not match', function (): void {
    $user = User::query()->create([
        'name' => 'Margaret Hamilton',
        'email' => 'margaret@example.com',
        'password' => Hash::make('CorrectSecret123!'),
    ]);

    $response = $this->actingAs($user)->put('/user/password', [
        'current_password' => 'WrongSecretPassword!',
        'password' => 'NewSecretPassword999!',
        'password_confirmation' => 'NewSecretPassword999!',
    ]);

    $response->assertSessionHasErrors(['current_password'], errorBag: 'updatePassword');
});
