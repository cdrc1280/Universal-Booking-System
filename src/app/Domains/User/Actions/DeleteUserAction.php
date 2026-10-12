<?php

declare(strict_types=1);

namespace App\Domains\User\Actions;

use App\Domains\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class DeleteUserAction
{
    /**
     * @throws ValidationException
     */
    public function execute(User $user, ?int $currentAuthUserId = null): void
    {
        $currentAuthUserId ??= (int) auth()->id();

        if ($user->id === $currentAuthUserId) {
            throw ValidationException::withMessages([
                'user' => 'You cannot delete your own active administrator account.',
            ]);
        }

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            throw ValidationException::withMessages([
                'user' => 'Cannot delete the last remaining system administrator account.',
            ]);
        }

        DB::transaction(function () use ($user): void {
            $user->syncRoles([]);
            $user->delete();
        });
    }
}
