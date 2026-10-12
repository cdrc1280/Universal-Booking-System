<?php

declare(strict_types=1);

namespace App\Domains\User\Controllers;

use App\Domains\User\Actions\DeleteUserAction;
use App\Domains\User\Actions\UpsertUserAction;
use App\Domains\User\DTOs\UserData;
use App\Domains\User\Models\User;
use App\Domains\User\Queries\UserIndexQuery;
use App\Domains\User\Requests\UpsertUserRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class UserController extends Controller
{
    public function index(Request $request, UserIndexQuery $query): Response
    {
        $paginator = $query->execute([
            'search' => $request->string('search')->toString() ?: null,
            'per_page' => $request->integer('per_page', 15),
        ]);

        $availableRoles = Role::query()->orderBy('name')->pluck('name');

        return Inertia::render('user/index', [
            'users' => [
                'data' => UserData::collect($paginator->items()),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
            'filters' => [
                'search' => $request->string('search')->toString(),
            ],
            'available_roles' => $availableRoles,
        ]);
    }

    public function store(UpsertUserRequest $request, UpsertUserAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('users.index')->with('success', 'User account created successfully.');
    }

    public function update(UpsertUserRequest $request, User $user, UpsertUserAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $user);

        return redirect()->route('users.index')->with('success', 'User account updated successfully.');
    }

    public function destroy(User $user, DeleteUserAction $action): RedirectResponse
    {
        $action->execute($user);

        return redirect()->route('users.index')->with('success', 'User account deleted successfully.');
    }
}