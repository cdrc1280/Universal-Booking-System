<?php

declare(strict_types=1);

use App\Domains\Location\Models\Location;
use App\Domains\Location\Requests\UpsertLocationRequest;
use Illuminate\Support\Facades\Validator;

it('validates rules for required fields, country code length, and timezone integrity', function (): void {
    $request = new UpsertLocationRequest();
    $rules = $request->rules();

    // Invalid payload: missing name, invalid timezone, country_code wrong length
    $validator = Validator::make([
        'name' => '',
        'timezone' => 'Invalid/Timezone',
        'country_code' => 'USA', // must be size:2
    ], $rules);

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('name'))->toBeTrue();
    expect($validator->errors()->has('timezone'))->toBeTrue();
    expect($validator->errors()->has('country_code'))->toBeTrue();

    // Valid payload
    $validValidator = Validator::make([
        'name' => 'Valid Branch',
        'timezone' => 'America/New_York',
        'country_code' => 'US',
        'is_active' => true,
    ], $rules);

    expect($validValidator->passes())->toBeTrue();
});

it('enforces slug uniqueness while ignoring current model on update', function (): void {
    $existing = Location::create([
        'name' => 'Existing Branch',
        'slug' => 'existing-branch',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
    ]);

    $request = new UpsertLocationRequest();
    $rules = $request->rules();

    // Duplicate slug
    $validator = Validator::make([
        'name' => 'New Branch',
        'slug' => 'existing-branch',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
    ], $rules);

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('slug'))->toBeTrue();
});
