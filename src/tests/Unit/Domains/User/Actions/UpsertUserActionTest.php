<?php

declare(strict_types=1);

use App\Domains\User\Actions\UpsertUserAction;
use App\Domains\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

it('creates a new user with hashed password and synchronized roles', function (): void {
    $role = Role::create(['name' => 'practitioner', 'guard_name' => 'web']);
    $action = new UpsertUserAction();

    $user = $action->execute([
        'name' => 'Clara Barton',
        'email' => 'clara@example.com',
        'password' => 'secretPass123',
        'roles' => [$role->name],
    ]);

    expect($user)->toBeInstanceOf(User::class);
    expect($user->name)->toBe('Clara Barton');
    expect($user->email)->toBe('clara@example.com');
    expect(Hash::check('secretPass123', $user->password))->toBeTrue();
    expect($user->hasRole('practitioner'))->toBeTrue();
});

it('updates an existing user and preserves password when password is not supplied', function (): void {
    $action = new UpsertUserAction();

    $user = $action->execute([
        'name' => 'Jonas Salk',
        'email' => 'jonas@example.com',
        'password' => 'initialSecretPass1',
    ]);

    $originalPasswordHash = $user->password;

    $updated = $action->execute([
        'name' => 'Dr. Jonas Salk',
        'email' => 'jonas.salk@example.com',
    ], $user);

    expect($updated->id)->toBe($user->id);
    expect($updated->name)->toBe('Dr. Jonas Salk');
    expect($updated->email)->toBe('jonas.salk@example.com');
    expect($updated->password)->toBe($originalPasswordHash);
});
