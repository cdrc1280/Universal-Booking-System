<?php

declare(strict_types=1);

use App\Availability\DTOs\TimeInterval;
use App\Availability\Services\AvailabilityCalculator;

it('generates valid appointment slots within working shifts', function (): void {
    $calculator = new AvailabilityCalculator();

    // Staff shift: 09:00 to 12:00 UTC (180 minutes)
    $shift = new TimeInterval(
        new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC'))
    );

    // Booked meeting: 10:00 to 10:30 UTC
    $busy = new TimeInterval(
        new DateTimeImmutable('2026-10-15 10:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 10:30:00', new DateTimeZone('UTC'))
    );

    // 30-minute service, 15-minute grid step, zero buffers
    $slots = $calculator->computeSlotsForIntervals(
        workingShifts: [$shift],
        busyWindows: [$busy],
        serviceId: 1,
        serviceDurationMinutes: 30,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        slotStepMinutes: 15,
        staffIds: [42],
        priceInCents: 5000,
    );

    // Expected free windows:
    // Window 1: 09:00 - 10:00 (30 min slots at 09:00, 09:15, 09:30) = 3 slots
    // Busy: 10:00 - 10:30
    // Window 2: 10:30 - 12:00 (30 min slots at 10:30, 10:45, 11:00, 11:15, 11:30) = 5 slots
    // Total = 8 slots
    expect($slots)->toHaveCount(8);
    expect($slots[0]->start->format('H:i'))->toBe('09:00');
    expect($slots[0]->end->format('H:i'))->toBe('09:30');
    expect($slots[3]->start->format('H:i'))->toBe('10:30');
});

it('rejects slots when prep or turnaround buffers collide with busy boundaries', function (): void {
    $calculator = new AvailabilityCalculator();

    // Staff shift: 09:00 to 11:00 UTC
    $shift = new TimeInterval(
        new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 11:00:00', new DateTimeZone('UTC'))
    );

    // Existing booking: 09:30 to 10:00 UTC
    $busy = new TimeInterval(
        new DateTimeImmutable('2026-10-15 09:30:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 10:00:00', new DateTimeZone('UTC'))
    );

    // 30-minute service with 15-minute cleanup buffer after session
    // Proposed 09:00 - 09:30 slot has footprint [09:00, 09:45).
    // Because busy starts at 09:30, the 15-min buffer collides with the busy window.
    $slots = $calculator->computeSlotsForIntervals(
        workingShifts: [$shift],
        busyWindows: [$busy],
        serviceId: 1,
        serviceDurationMinutes: 30,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 15,
        slotStepMinutes: 30,
        staffIds: [1],
    );

    // In Window 1 (09:00 - 09:30), footprint is 09:00 - 09:45 which exceeds 09:30. Zero slots fit.
    // In Window 2 (10:00 - 11:00), footprint for 10:00 is 10:00 - 10:45 which fits!
    expect($slots)->toHaveCount(1);
    expect($slots[0]->start->format('H:i'))->toBe('10:00');
});
