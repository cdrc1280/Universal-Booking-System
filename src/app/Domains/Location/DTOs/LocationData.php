<?php

declare(strict_types=1);

namespace App\Domains\Location\DTOs;

use App\Domains\Location\Models\Location;
use Spatie\LaravelData\Data;

final class LocationData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public string $timezone,
        public ?string $address_line1,
        public ?string $address_line2,
        public ?string $city,
        public ?string $state,
        public ?string $postal_code,
        public string $country_code,
        public ?string $phone,
        public ?string $email,
        public bool $is_active,
        public ?string $created_at,
    ) {}

    public static function fromModel(Location $location): self
    {
        return new self(
            id: $location->id,
            name: $location->name,
            slug: $location->slug,
            timezone: $location->timezone,
            address_line1: $location->address_line1,
            address_line2: $location->address_line2,
            city: $location->city,
            state: $location->state,
            postal_code: $location->postal_code,
            country_code: $location->country_code,
            phone: $location->phone,
            email: $location->email,
            is_active: $location->is_active,
            created_at: $location->created_at?->format('M d, Y'),
        );
    }
}
