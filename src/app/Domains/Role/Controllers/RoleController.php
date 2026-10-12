<?php

declare(strict_types=1);

namespace App\Domains\Role\Controllers;

use App\Domains\Permission\DTOs\PermissionData;
use App\Domains\Role\Actions\DeleteRoleAction;
use App\Domains\Role\Actions\UpsertRoleAction;
use App\Domains\Role\DTOs\RoleData;
use App\Domains\Role\Queries\RoleIndexQuery;
use App\Domains\Role\Requests\UpsertRoleRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RoleController extends Controller
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

    public function store(UpsertRoleRequest $request, UpsertRoleAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('roles.index')->with('success', 'Security role created successfully.');
    }

    public function update(UpsertRoleRequest $request, Role $role, UpsertRoleAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $role);

        return redirect()->route('roles.index')->with('success', 'Security role updated successfully.');
    }

    public function destroy(Role $role, DeleteRoleAction $action): RedirectResponse
    {
        $action->execute($role);

        return redirect()->route('roles.index')->with('success', 'Security role deleted successfully.');
    }
}