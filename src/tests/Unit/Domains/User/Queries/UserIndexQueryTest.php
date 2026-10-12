<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use App\Domains\User\Queries\UserIndexQuery;
use Spatie\Permission\Models\Role;

it('executes user index query with search filter against name and email, and loads roles', function (): void {
    $role = Role::create(['name' => 'therapist', 'guard_name' => 'web']);

    $matchUser = User::query()->create([
        'name' => 'Alexander Fleming',
        'email' => 'fleming@penicillin.org',
        'password' => bcrypt('password123'),
    ]);
    $matchUser->assignRole($role);

    User::query()->create([
        'name' => 'Louis Pasteur',
        'email' => 'pasteur@microbes.org',
        'password' => bcrypt('password123'),
    ]);

    $query = new UserIndexQuery();

    // Search by name substring
    $resultsByName = $query->execute(['search' => 'fleming', 'per_page' => 10]);
    expect($resultsByName->total())->toBe(1);
    expect($resultsByName->first()->id)->toBe($matchUser->id);
    expect($resultsByName->first()->relationLoaded('roles'))->toBeTrue();

    // Search by email substring
    $resultsByEmail = $query->execute(['search' => 'penicillin', 'per_page' => 10]);
    expect($resultsByEmail->total())->toBe(1);
    expect($resultsByEmail->first()->id)->toBe($matchUser->id);

    // Search with non-matching query
    $noResults = $query->execute(['search' => 'nonexistentquery999']);
    expect($noResults->total())->toBe(0);
});
