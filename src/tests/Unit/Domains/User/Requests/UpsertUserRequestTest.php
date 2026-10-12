<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use App\Domains\User\Requests\UpsertUserRequest;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

it('validates rules for required user fields and valid assigned roles', function (): void {
    $role = Role::create(['name' => 'billing-specialist', 'guard_name' => 'web']);

    $request = new UpsertUserRequest();
    $rules = $request->rules();

    // Invalid payload: empty name, invalid email, non-existent role
    $invalidValidator = Validator::make([
        'name' => '',
        'email' => 'invalid-email-address',
        'password' => 'short',
        'roles' => ['fake-role-999'],
    ], $rules);

    expect($invalidValidator->fails())->toBeTrue();
    expect($invalidValidator->errors()->has('name'))->toBeTrue();
    expect($invalidValidator->errors()->has('email'))->toBeTrue();
    expect($invalidValidator->errors()->has('password'))->toBeTrue();
    expect($invalidValidator->errors()->has('roles.0'))->toBeTrue();

    // Valid payload
    $validValidator = Validator::make([
        'name' => 'Marie Curie',
        'email' => 'curie@radium.org',
        'password' => 'SecurePassWord123!',
        'roles' => [$role->name],
    ], $rules);

    expect($validValidator->passes())->toBeTrue();
});

it('enforces email uniqueness on user creation', function (): void {
    User::query()->create([
        'name' => 'Existing Doctor',
        'email' => 'doctor@example.com',
        'password' => bcrypt('password123'),
    ]);

    $request = new UpsertUserRequest();
    $rules = $request->rules();

    $duplicateValidator = Validator::make([
        'name' => 'New Doctor',
        'email' => 'doctor@example.com',
        'password' => 'SecurePassWord123!',
    ], $rules);

    expect($duplicateValidator->fails())->toBeTrue();
    expect($duplicateValidator->errors()->has('email'))->toBeTrue();
});
