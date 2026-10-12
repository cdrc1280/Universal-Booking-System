<?php

declare(strict_types=1);

use App\Domains\Role\Requests\UpsertRoleRequest;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

it('validates role upsert request rules for required name and valid permission names', function (): void {
    $perm = Permission::create(['name' => 'view-dashboard', 'guard_name' => 'web']);

    $request = new UpsertRoleRequest();
    $rules = $request->rules();

    // Invalid payload: empty name, non-existent permission
    $invalidValidator = Validator::make([
        'name' => '',
        'permissions' => ['non-existent-perm'],
    ], $rules);

    expect($invalidValidator->fails())->toBeTrue();
    expect($invalidValidator->errors()->has('name'))->toBeTrue();
    expect($invalidValidator->errors()->has('permissions.0'))->toBeTrue();

    // Valid payload
    $validValidator = Validator::make([
        'name' => 'Support Agent',
        'permissions' => [$perm->name],
    ], $rules);

    expect($validValidator->passes())->toBeTrue();
});

it('enforces unique role name rule', function (): void {
    Role::create(['name' => 'dispatcher', 'guard_name' => 'web']);

    $request = new UpsertRoleRequest();
    $rules = $request->rules();

    $duplicateValidator = Validator::make([
        'name' => 'dispatcher',
    ], $rules);

    expect($duplicateValidator->fails())->toBeTrue();
    expect($duplicateValidator->errors()->has('name'))->toBeTrue();
});
