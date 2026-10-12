<?php

declare(strict_types=1);

use App\Domains\Booking\Models\Booking;
use App\Domains\Booking\Models\BookingItem;
use App\Domains\Location\Models\Location;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

it('verifies BookingItem relations and datetime casts', function (): void {
    $facility = Location::create([
        'name' => 'Riverside Health',
        'slug' => 'riverside-health',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
        'is_active' => true,
    ]);

    $serviceRecord = DB::table('services')->insertGetId([
        'name' => 'Therapy Session',
        'slug' => 'therapy-session',
        'duration_minutes' => 60,
        'buffer_before_minutes' => 10,
        'buffer_after_minutes' => 10,
        'price_in_cents' => 9000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $booking = Booking::create([
        'location_id' => $facility->id,
        'booking_reference' => 'BK-ITEM-001',
        'customer_name' => 'Alan Turing',
        'customer_email' => 'alan@example.com',
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'total_price_in_cents' => 9000,
        'currency' => 'USD',
    ]);

    $startsAt = now()->toImmutable();
    $endsAt = now()->addMinutes(60)->toImmutable();
    $blockedFrom = now()->subMinutes(10)->toImmutable();
    $blockedUntil = now()->addMinutes(70)->toImmutable();

    $item = BookingItem::create([
        'booking_id' => $booking->id,
        'service_id' => $serviceRecord,
        'starts_at' => $startsAt,
        'ends_at' => $endsAt,
        'blocked_from' => $blockedFrom,
        'blocked_until' => $blockedUntil,
        'price_in_cents' => 9000,
        'occupies_slot' => true,
    ]);

    expect($item->booking())->toBeInstanceOf(BelongsTo::class);
    expect($item->booking->id)->toBe($booking->id);
    expect($item->occupies_slot)->toBeTrue();
    expect($item->price_in_cents)->toBeInt()->toBe(9000);
    expect($item->starts_at)->toBeInstanceOf(DateTimeImmutable::class);
    expect($item->ends_at)->toBeInstanceOf(DateTimeImmutable::class);
});
