<?php

declare(strict_types=1);

namespace App\Domains\Role\Controllers;

use App\Domains\Permission\DTOs\PermissionData;
use App\Domains\Role\DTOs\RoleData;
use App\Domains\Role\Queries\RoleIndexQuery;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index(RoleIndexQuery $query): Response
    {
        $roles = $query->execute();
        $allPermissions = Permission::query()->orderBy('name')->get();

        return Inertia::render('role/index', [
            'roles' => RoleData::collect($roles),
            'permissions' => PermissionData::collect($allPermissions),
        ]);
    }
}