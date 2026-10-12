<?php

declare(strict_types=1);

use App\Domains\User\Actions\DeleteUserAction;
use App\Domains\User\Models\User;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

it('prevents a user from deleting their own account', function (): void {
    $user = User::query()->create([
        'name' => 'Self User',
        'email' => 'self@example.com',
        'password' => bcrypt('password123'),
    ]);

    $action = new DeleteUserAction();

    expect(fn () => $action->execute($user, currentAuthUserId: $user->id))
        ->toThrow(ValidationException::class);
});

it('prevents deleting the last remaining system administrator', function (): void {
    $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);

    $soleAdmin = User::query()->create([
        'name' => 'Sole Admin',
        'email' => 'sole.admin@example.com',
        'password' => bcrypt('password123'),
    ]);
    $soleAdmin->assignRole($adminRole);

    $action = new DeleteUserAction();

    expect(fn () => $action->execute($soleAdmin, currentAuthUserId: 9999))
        ->toThrow(ValidationException::class);
});

it('allows deleting an administrator when another administrator exists', function (): void {
    $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);

    $adminOne = User::query()->create([
        'name' => 'Primary Admin',
        'email' => 'primary@example.com',
        'password' => bcrypt('password123'),
    ]);
    $adminOne->assignRole($adminRole);

    $adminTwo = User::query()->create([
        'name' => 'Secondary Admin',
        'email' => 'secondary@example.com',
        'password' => bcrypt('password123'),
    ]);
    $adminTwo->assignRole($adminRole);

    $action = new DeleteUserAction();
    $action->execute($adminTwo, currentAuthUserId: $adminOne->id);

    expect(User::query()->find($adminTwo->id))->toBeNull();
    expect(User::query()->find($adminOne->id))->not->toBeNull();
});
