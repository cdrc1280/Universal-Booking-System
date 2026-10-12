<?php

declare(strict_types=1);

use App\Domains\Booking\Actions\ReserveSlotAction;
use App\Domains\Booking\DTOs\ReserveSlotData;
use App\Domains\Booking\Exceptions\SlotUnavailableException;
use App\Domains\User\Models\User;
use Illuminate\Support\Facades\DB;

it('successfully reserves an open appointment slot', function (): void {
    if (DB::getDriverName() !== 'pgsql') {
        $this->markTestSkipped('GiST exclusion tests require PostgreSQL.');
    }

    $locationId = DB::table('locations')->insertGetId([
        'name' => 'Downtown Clinic',
        'slug' => 'downtown-clinic-' . uniqid(),
        'timezone' => 'UTC',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $serviceId = DB::table('services')->insertGetId([
        'name' => 'General Consultation',
        'slug' => 'consultation-' . uniqid(),
        'duration_minutes' => 30,
        'price_in_cents' => 5000,
        'buffer_before_minutes' => 5,
        'buffer_after_minutes' => 10,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $staffUser = User::factory()->create();
    $staffProfileId = DB::table('staff_profiles')->insertGetId([
        'user_id' => $staffUser->id,
        'timezone' => 'UTC',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $action = new ReserveSlotAction();

    $booking = $action->execute(new ReserveSlotData(
        locationId: $locationId,
        serviceId: $serviceId,
        staffProfileId: $staffProfileId,
        startsAt: new DateTimeImmutable('2026-10-20 14:00:00', new DateTimeZone('UTC')),
        endsAt: new DateTimeImmutable('2026-10-20 14:30:00', new DateTimeZone('UTC')),
        bufferBeforeMinutes: 5,
        bufferAfterMinutes: 10,
        priceInCents: 5000,
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor@example.com',
    ));

    expect($booking->status)->toBe('pending');
    expect($booking->payment_status)->toBe('unpaid');
    expect($booking->items)->toHaveCount(1);
    expect($booking->items->first()->occupies_slot)->toBeTrue();
});

it('rejects double-booking at the database engine level via GiST exclusion constraint', function (): void {
    if (DB::getDriverName() !== 'pgsql') {
        $this->markTestSkipped('GiST exclusion tests require PostgreSQL.');
    }

    $locationId = DB::table('locations')->insertGetId([
        'name' => 'West Branch',
        'slug' => 'west-branch-' . uniqid(),
        'timezone' => 'UTC',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $serviceId = DB::table('services')->insertGetId([
        'name' => 'Specialist Review',
        'slug' => 'specialist-review-' . uniqid(),
        'duration_minutes' => 45,
        'price_in_cents' => 7500,
        'buffer_before_minutes' => 0,
        'buffer_after_minutes' => 15,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $staffUser = User::factory()->create();
    $staffProfileId = DB::table('staff_profiles')->insertGetId([
        'user_id' => $staffUser->id,
        'timezone' => 'UTC',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $action = new ReserveSlotAction();

    // First reservation occupies [10:00, 10:45) with 15m cleanup buffer -> blocked until 11:00
    $action->execute(new ReserveSlotData(
        locationId: $locationId,
        serviceId: $serviceId,
        staffProfileId: $staffProfileId,
        startsAt: new DateTimeImmutable('2026-10-20 10:00:00', new DateTimeZone('UTC')),
        endsAt: new DateTimeImmutable('2026-10-20 10:45:00', new DateTimeZone('UTC')),
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 15,
        priceInCents: 7500,
        customerName: 'Marcus Bell',
        customerEmail: 'marcus@example.com',
    ));

    // Second reservation attempts to overlap the cleanup buffer interval (10:45 - 11:15)
    // PostgreSQL GiST exclusion constraint MUST catch this collision and throw SlotUnavailableException!
    expect(fn () => $action->execute(new ReserveSlotData(
        locationId: $locationId,
        serviceId: $serviceId,
        staffProfileId: $staffProfileId,
        startsAt: new DateTimeImmutable('2026-10-20 10:45:00', new DateTimeZone('UTC')),
        endsAt: new DateTimeImmutable('2026-10-20 11:30:00', new DateTimeZone('UTC')),
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        priceInCents: 7500,
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah@example.com',
    )))->toThrow(SlotUnavailableException::class);
});
