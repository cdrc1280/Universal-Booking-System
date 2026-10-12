<?php

declare(strict_types=1);

namespace App\Domains\Location\Actions;

use App\Domains\Location\Models\Location;
use Illuminate\Support\Str;

final class UpsertLocationAction
{
    /**
     * @param array<string, mixed> $attributes
     */
    public function execute(array $attributes, ?Location $location = null): Location
    {
        $name = (string) $attributes['name'];
        $slug = ! empty($attributes['slug'])
            ? Str::slug((string) $attributes['slug'])
            : Str::slug($name);

        $payload = [
            'name' => $name,
            'slug' => $slug,
            'timezone' => $attributes['timezone'] ?? 'UTC',
            'address_line1' => $attributes['address_line1'] ?? null,
            'address_line2' => $attributes['address_line2'] ?? null,
            'city' => $attributes['city'] ?? null,
            'state' => $attributes['state'] ?? null,
            'postal_code' => $attributes['postal_code'] ?? null,
            'country_code' => strtoupper((string) ($attributes['country_code'] ?? 'US')),
            'phone' => $attributes['phone'] ?? null,
            'email' => $attributes['email'] ?? null,
            'is_active' => (bool) ($attributes['is_active'] ?? true),
        ];

        if ($location !== null) {
            $location->update($payload);
            return $location->fresh();
        }

        return Location::create($payload);
    }
}
