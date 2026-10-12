<?php

declare(strict_types=1);

use App\Domains\Location\Models\Location;
use App\Domains\User\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the locations index page with inertia', function (): void {
    $admin = User::factory()->create();
    Location::create([
        'name' => 'Metro Health Center',
        'slug' => 'metro-health-center',
        'timezone' => 'America/New_York',
        'country_code' => 'US',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('locations.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('location/index')
            ->has('locations', 1)
            ->where('locations.0.name', 'Metro Health Center')
        );
});

it('creates a new facility location via the store action', function (): void {
    $admin = User::factory()->create();

    $payload = [
        'name' => 'Downtown Wellness Clinic',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
        'city' => 'Chicago',
        'state' => 'IL',
        'postal_code' => '60601',
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)->post(route('locations.store'), $payload);

    $response->assertRedirect(route('locations.index'));
    $this->assertDatabaseHas('locations', [
        'name' => 'Downtown Wellness Clinic',
        'slug' => 'downtown-wellness-clinic',
        'city' => 'Chicago',
    ]);
});

it('updates an existing facility location', function (): void {
    $admin = User::factory()->create();
    $location = Location::create([
        'name' => 'Old Clinic Name',
        'slug' => 'old-clinic-name',
        'timezone' => 'UTC',
        'country_code' => 'US',
    ]);

    $payload = [
        'name' => 'Renovated Care Center',
        'timezone' => 'America/Los_Angeles',
        'country_code' => 'US',
        'is_active' => false,
    ];

    $response = $this->actingAs($admin)->put(route('locations.update', $location), $payload);

    $response->assertRedirect(route('locations.index'));
    $this->assertDatabaseHas('locations', [
        'id' => $location->id,
        'name' => 'Renovated Care Center',
        'is_active' => false,
    ]);
});

it('soft deletes a facility location', function (): void {
    $admin = User::factory()->create();
    $location = Location::create([
        'name' => 'Branch to Delete',
        'slug' => 'branch-to-delete',
        'timezone' => 'UTC',
        'country_code' => 'US',
    ]);

    $response = $this->actingAs($admin)->delete(route('locations.destroy', $location));

    $response->assertRedirect(route('locations.index'));
    $this->assertSoftDeleted('locations', ['id' => $location->id]);
});
