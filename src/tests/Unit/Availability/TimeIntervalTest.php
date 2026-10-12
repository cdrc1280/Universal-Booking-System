<?php

declare(strict_types=1);

use App\Availability\DTOs\TimeInterval;

it('calculates duration in minutes accurately', function (): void {
    $start = new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC'));
    $end = new DateTimeImmutable('2026-10-15 10:45:00', new DateTimeZone('UTC'));
    $interval = new TimeInterval($start, $end);

    expect($interval->durationInMinutes())->toBe(105);
});

it('throws invalid argument exception when end time precedes start time', function (): void {
    $start = new DateTimeImmutable('2026-10-15 10:00:00', new DateTimeZone('UTC'));
    $end = new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC'));

    expect(fn () => new TimeInterval($start, $end))
        ->toThrow(InvalidArgumentException::class, 'Interval end cannot precede start.');
});

it('detects interval overlaps accurately', function (): void {
    $base = new TimeInterval(
        new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 11:00:00', new DateTimeZone('UTC'))
    );

    $overlapping = new TimeInterval(
        new DateTimeImmutable('2026-10-15 10:30:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC'))
    );

    $disjoint = new TimeInterval(
        new DateTimeImmutable('2026-10-15 11:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC'))
    );

    expect($base->overlaps($overlapping))->toBeTrue();
    expect($base->overlaps($disjoint))->toBeFalse();
});

it('determines point and interval containment', function (): void {
    $window = new TimeInterval(
        new DateTimeImmutable('2026-10-15 08:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC'))
    );

    $insidePoint = new DateTimeImmutable('2026-10-15 10:00:00', new DateTimeZone('UTC'));
    $boundaryPoint = new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC'));
    $outsidePoint = new DateTimeImmutable('2026-10-15 12:00:01', new DateTimeZone('UTC'));

    expect($window->contains($insidePoint))->toBeTrue();
    expect($window->contains($boundaryPoint))->toBeFalse();
    expect($window->contains($outsidePoint))->toBeFalse();

    $nestedInterval = new TimeInterval(
        new DateTimeImmutable('2026-10-15 09:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 11:00:00', new DateTimeZone('UTC'))
    );

    expect($window->containsInterval($nestedInterval))->toBeTrue();
});

it('subtracts busy intervals resulting in multiple free windows', function (): void {
    $shift = new TimeInterval(
        new DateTimeImmutable('2026-10-15 08:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 17:00:00', new DateTimeZone('UTC'))
    );

    $lunchBreak = new TimeInterval(
        new DateTimeImmutable('2026-10-15 12:00:00', new DateTimeZone('UTC')),
        new DateTimeImmutable('2026-10-15 13:00:00', new DateTimeZone('UTC'))
    );

    $freeSegments = $shift->subtract($lunchBreak);

    expect($freeSegments)->toHaveCount(2);
    expect($freeSegments[0]->start->format('H:i'))->toBe('08:00');
    expect($freeSegments[0]->end->format('H:i'))->toBe('12:00');
    expect($freeSegments[1]->start->format('H:i'))->toBe('13:00');
    expect($freeSegments[1]->end->format('H:i'))->toBe('17:00');
});
