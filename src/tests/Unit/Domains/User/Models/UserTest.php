<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use Spatie\Permission\Models\Role;

it('verifies User model attributes, hidden attributes, password auto-hashing, and roles relation', function (): void {
    $role = Role::create(['name' => 'clinician', 'guard_name' => 'web']);

    $user = User::query()->create([
        'name' => 'Florence Nightingale',
        'email' => 'florence@example.com',
        'password' => 'rawPasswordString123',
    ]);
    $user->assignRole($role);

    expect($user->password)->not->toBe('rawPasswordString123');
    expect(password_verify('rawPasswordString123', $user->password))->toBeTrue();

    // Verify hidden attributes in array serialization
    $serialized = $user->toArray();
    expect(array_key_exists('password', $serialized))->toBeFalse();
    expect(array_key_exists('remember_token', $serialized))->toBeFalse();

    expect($user->hasRole('clinician'))->toBeTrue();
    expect($user->roles()->count())->toBe(1);
});
