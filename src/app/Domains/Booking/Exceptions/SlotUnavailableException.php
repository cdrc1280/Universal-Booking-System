<?php

declare(strict_types=1);

namespace App\Domains\Booking\Exceptions;

use RuntimeException;

/**
 * Thrown when a chosen slot collides with an existing reservation or turnaround buffer.
 * Traps PostgreSQL SQLSTATE 23P01 exclusion constraint violations.
 */
final class SlotUnavailableException extends RuntimeException
{
    public static function forStaffAndPeriod(int $staffProfileId, string $from, string $until): self
    {
        return new self("The selected appointment slot between {$from} and {$until} is no longer available.");
    }
}
