<?php

declare(strict_types=1);

use App\Domains\User\DTOs\UserData;
use App\Domains\User\Models\User;
use Spatie\Permission\Models\Role;

it('transforms User model into typed UserData DTO with assigned role names', function (): void {
    $role = Role::create(['name' => 'physician', 'guard_name' => 'web']);

    $user = User::query()->create([
        'name' => 'Dr. Gregory House',
        'email' => 'house@example.com',
        'password' => bcrypt('vicodin123'),
    ]);
    $user->assignRole($role);

    $dto = UserData::fromModel($user);

    expect($dto)->toBeInstanceOf(UserData::class);
    expect($dto->id)->toBe($user->id);
    expect($dto->name)->toBe('Dr. Gregory House');
    expect($dto->email)->toBe('house@example.com');
    expect($dto->roles)->toBe(['physician']);
    expect($dto->created_at)->not->toBeNull();
});
