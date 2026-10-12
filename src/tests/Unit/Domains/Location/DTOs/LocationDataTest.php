<?php

declare(strict_types=1);

use App\Domains\Location\DTOs\LocationData;
use App\Domains\Location\Models\Location;

it('transforms Eloquent Location model into typed LocationData DTO', function (): void {
    $facility = Location::create([
        'name' => 'Downtown Wellness Center',
        'slug' => 'downtown-wellness-center',
        'timezone' => 'America/Chicago',
        'address_line1' => '100 Main Street',
        'address_line2' => 'Suite 400',
        'city' => 'Chicago',
        'state' => 'IL',
        'postal_code' => '60601',
        'country_code' => 'US',
        'phone' => '+1-312-555-0199',
        'email' => 'contact@downtownwellness.com',
        'is_active' => true,
    ]);

    $data = LocationData::fromModel($facility);

    expect($data)->toBeInstanceOf(LocationData::class);
    expect($data->id)->toBe($facility->id);
    expect($data->name)->toBe('Downtown Wellness Center');
    expect($data->slug)->toBe('downtown-wellness-center');
    expect($data->timezone)->toBe('America/Chicago');
    expect($data->address_line1)->toBe('100 Main Street');
    expect($data->address_line2)->toBe('Suite 400');
    expect($data->city)->toBe('Chicago');
    expect($data->state)->toBe('IL');
    expect($data->postal_code)->toBe('60601');
    expect($data->country_code)->toBe('US');
    expect($data->phone)->toBe('+1-312-555-0199');
    expect($data->email)->toBe('contact@downtownwellness.com');
    expect($data->is_active)->toBeTrue();
    expect($data->created_at)->not->toBeNull();
});
