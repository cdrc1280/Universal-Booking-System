<?php

declare(strict_types=1);

use App\Domains\Location\Actions\UpsertLocationAction;
use App\Domains\Location\Models\Location;

it('creates a new location with auto-generated slug when slug is omitted', function (): void {
    $action = new UpsertLocationAction();

    $location = $action->execute([
        'name' => 'West End Physio',
        'timezone' => 'America/New_York',
        'country_code' => 'us',
        'is_active' => true,
    ]);

    expect($location)->toBeInstanceOf(Location::class);
    expect($location->name)->toBe('West End Physio');
    expect($location->slug)->toBe('west-end-physio');
    expect($location->country_code)->toBe('US');
    expect($location->is_active)->toBeTrue();
    expect($location->timezone)->toBe('America/New_York');
});

it('updates an existing location while preserving slug if empty', function (): void {
    $action = new UpsertLocationAction();

    $location = $action->execute([
        'name' => 'North Shore Medical',
        'slug' => 'custom-north-shore',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
    ]);

    expect($location->slug)->toBe('custom-north-shore');

    $updated = $action->execute([
        'name' => 'North Shore Specialty Medical',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
        'phone' => '+1-555-0188',
        'is_active' => false,
    ], $location);

    expect($updated->id)->toBe($location->id);
    expect($updated->name)->toBe('North Shore Specialty Medical');
    expect($updated->phone)->toBe('+1-555-0188');
    expect($updated->is_active)->toBeFalse();
});
