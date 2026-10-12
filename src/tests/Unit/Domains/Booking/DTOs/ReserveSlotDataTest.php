<?php

declare(strict_types=1);

use App\Domains\Booking\DTOs\ReserveSlotData;

it('instantiates ReserveSlotData with required properties and default TTL', function (): void {
    $startsAt = new DateTimeImmutable('2026-10-15 10:00:00', new DateTimeZone('UTC'));
    $endsAt = new DateTimeImmutable('2026-10-15 10:45:00', new DateTimeZone('UTC'));

    $reservationDto = new ReserveSlotData(
        locationId: 1,
        serviceId: 2,
        staffProfileId: 3,
        startsAt: $startsAt,
        endsAt: $endsAt,
        bufferBeforeMinutes: 10,
        bufferAfterMinutes: 15,
        priceInCents: 6500,
        customerName: 'Marcus Aurelius',
        customerEmail: 'marcus@example.com',
        customerPhone: '+1-555-0199',
        notes: 'Requested quiet corner booth.',
    );

    expect($reservationDto->locationId)->toBe(1);
    expect($reservationDto->serviceId)->toBe(2);
    expect($reservationDto->staffProfileId)->toBe(3);
    expect($reservationDto->startsAt)->toBe($startsAt);
    expect($reservationDto->endsAt)->toBe($endsAt);
    expect($reservationDto->bufferBeforeMinutes)->toBe(10);
    expect($reservationDto->bufferAfterMinutes)->toBe(15);
    expect($reservationDto->priceInCents)->toBe(6500);
    expect($reservationDto->customerName)->toBe('Marcus Aurelius');
    expect($reservationDto->customerEmail)->toBe('marcus@example.com');
    expect($reservationDto->customerPhone)->toBe('+1-555-0199');
    expect($reservationDto->notes)->toBe('Requested quiet corner booth.');
    expect($reservationDto->customerId)->toBeNull();
    expect($reservationDto->holdTtlMinutes)->toBe(10);
});
