<?php

declare(strict_types=1);

namespace App\Availability\DTOs;

use DateTimeImmutable;

/**
 * Immutable slot candidate emitted by the Availability engine.
 * Ready for consumption by frontend SlotPicker or reservation action.
 */
final readonly class AvailableSlot
{
    /**
     * @param list<int> $candidateStaffIds Staff qualified and free during this window
     */
    public function __construct(
        public DateTimeImmutable $start,
        public DateTimeImmutable $end,
        public int $serviceId,
        public array $candidateStaffIds,
        public int $totalDurationMinutes,
        public int $totalPriceInCents,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'start' => $this->start->format(\DateTimeInterface::ATOM),
            'end' => $this->end->format(\DateTimeInterface::ATOM),
            'service_id' => $this->serviceId,
            'candidate_staff_ids' => $this->candidateStaffIds,
            'duration_minutes' => $this->totalDurationMinutes,
            'price_in_cents' => $this->totalPriceInCents,
        ];
    }
}
