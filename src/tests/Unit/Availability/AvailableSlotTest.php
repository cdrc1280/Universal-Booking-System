<?php

declare(strict_types=1);

use App\Availability\DTOs\AvailableSlot;

it('instantiates and serializes to array contract correctly', function (): void {
    $start = new DateTimeImmutable('2026-10-15 14:00:00', new DateTimeZone('UTC'));
    $end = new DateTimeImmutable('2026-10-15 14:45:00', new DateTimeZone('UTC'));

    $slot = new AvailableSlot(
        start: $start,
        end: $end,
        serviceId: 10,
        candidateStaffIds: [3, 7],
        totalDurationMinutes: 45,
        totalPriceInCents: 7500,
    );

    expect($slot->start)->toBe($start);
    expect($slot->end)->toBe($end);
    expect($slot->serviceId)->toBe(10);
    expect($slot->candidateStaffIds)->toBe([3, 7]);
    expect($slot->totalDurationMinutes)->toBe(45);
    expect($slot->totalPriceInCents)->toBe(7500);

    $serialized = $slot->toArray();

    expect($serialized)->toBe([
        'start' => $start->format(DateTimeInterface::ATOM),
        'end' => $end->format(DateTimeInterface::ATOM),
        'service_id' => 10,
        'candidate_staff_ids' => [3, 7],
        'duration_minutes' => 45,
        'price_in_cents' => 7500,
    ]);
});
