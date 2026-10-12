<?php

declare(strict_types=1);

namespace App\Domains\Booking\DTOs;

use DateTimeImmutable;

final readonly class ReserveSlotData
{
    public function __construct(
        public int $locationId,
        public int $serviceId,
        public ?int $staffProfileId,
        public DateTimeImmutable $startsAt,
        public DateTimeImmutable $endsAt,
        public int $bufferBeforeMinutes,
        public int $bufferAfterMinutes,
        public int $priceInCents,
        public string $customerName,
        public string $customerEmail,
        public ?string $customerPhone = null,
        public ?string $notes = null,
        public ?int $customerId = null,
        public int $holdTtlMinutes = 10,
    ) {}
}
