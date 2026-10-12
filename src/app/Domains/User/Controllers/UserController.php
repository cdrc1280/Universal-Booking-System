<?php

declare(strict_types=1);

namespace App\Domains\User\Controllers;

use App\Domains\User\DTOs\UserData;
use App\Domains\User\Queries\UserIndexQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request, UserIndexQuery $query): Response
    {
        $paginator = $query->execute([
            'search' => $request->string('search')->toString() ?: null,
            'per_page' => $request->integer('per_page', 15),
        ]);

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
        ]);
    }
}