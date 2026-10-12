<?php

declare(strict_types=1);

use App\Domains\Location\Models\Location;

it('verifies Location model attributes, casts, and soft delete functionality', function (): void {
    $facility = Location::create([
        'name' => 'Highland Medical Park',
        'slug' => 'highland-medical-park',
        'timezone' => 'America/Denver',
        'country_code' => 'US',
        'is_active' => true,
    ]);

    expect($facility->is_active)->toBeTrue();
    expect($facility->timezone)->toBe('America/Denver');
    expect($facility->deleted_at)->toBeNull();

    $facility->delete();

    expect(Location::query()->find($facility->id))->toBeNull();
    expect(Location::withTrashed()->find($facility->id))->not->toBeNull();
    expect(Location::withTrashed()->find($facility->id)->deleted_at)->not->toBeNull();

    $facility->restore();
    expect(Location::query()->find($facility->id))->not->toBeNull();
});
