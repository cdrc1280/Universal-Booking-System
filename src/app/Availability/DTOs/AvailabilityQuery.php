<?php

declare(strict_types=1);

namespace App\Availability\DTOs;

use App\Availability\ValueObjects\TimeInterval;
use Carbon\CarbonImmutable;

final readonly class AvailabilityQuery
{
    /**
     * @param array<int, int> $staffIds Restrict lookup to these staff members, or empty for any eligible staff
     * @param array<int, TimeInterval> $workingShifts Base working hours for the date in customer timezone
     * @param array<int, TimeInterval> $busyIntervals Bookings, breaks, and time-offs converted to customer timezone
     */
    public function __construct(
        public CarbonImmutable $date,
        public int $durationMinutes,
        public int $bufferBeforeMinutes = 0,
        public int $bufferAfterMinutes = 0,
        public int $slotIntervalMinutes = 15,
        public int $minNoticeMinutes = 60,
        public int $maxAdvanceDays = 60,
        public string $customerTimezone = 'UTC',
        public array $staffIds = [],
        public array $workingShifts = [],
        public array $busyIntervals = [],
    ) {}

    public function totalSlotOccupancyMinutes(): int
    {
        return $this->bufferBeforeMinutes + $this->durationMinutes + $this->bufferAfterMinutes;
    }
}
