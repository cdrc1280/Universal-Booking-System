<?php

declare(strict_types=1);

use App\Domains\Permission\DTOs\PermissionData;
use Spatie\Permission\Models\Permission;

it('transforms Permission model into typed PermissionData DTO', function (): void {
    $perm = Permission::create([
        'name' => 'manage-catalogs',
        'guard_name' => 'web',
    ]);

    $dto = PermissionData::fromModel($perm);

    expect($dto)->toBeInstanceOf(PermissionData::class);
    expect($dto->id)->toBe($perm->id);
    expect($dto->name)->toBe('manage-catalogs');
    expect($dto->guard_name)->toBe('web');
    expect($dto->created_at)->not->toBeNull();
});
