<?php

declare(strict_types=1);

use App\Domains\Booking\Models\Booking;
use App\Domains\Booking\Models\BookingItem;
use App\Domains\Location\Models\Location;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

it('verifies Booking model relations, casts, and soft delete behavior', function (): void {
    $facility = Location::create([
        'name' => 'Central Hub Clinic',
        'slug' => 'central-hub-clinic',
        'timezone' => 'America/Chicago',
        'country_code' => 'US',
        'is_active' => true,
    ]);

    $serviceRecord = DB::table('services')->insertGetId([
        'name' => 'Checkup',
        'slug' => 'checkup',
        'duration_minutes' => 30,
        'buffer_before_minutes' => 0,
        'buffer_after_minutes' => 0,
        'price_in_cents' => 5000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $booking = Booking::create([
        'location_id' => $facility->id,
        'booking_reference' => 'BK-TEST998811',
        'customer_name' => 'Ada Lovelace',
        'customer_email' => 'ada@example.com',
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'total_price_in_cents' => 5000,
        'currency' => 'USD',
    ]);

    expect($booking->items())->toBeInstanceOf(HasMany::class);
    expect($booking->total_price_in_cents)->toBeInt()->toBe(5000);

    BookingItem::create([
        'booking_id' => $booking->id,
        'service_id' => $serviceRecord,
        'starts_at' => now(),
        'ends_at' => now()->addMinutes(30),
        'blocked_from' => now(),
        'blocked_until' => now()->addMinutes(30),
        'price_in_cents' => 5000,
        'occupies_slot' => true,
    ]);

    expect($booking->items()->count())->toBe(1);

    // Soft delete verification
    $booking->delete();
    expect(Booking::find($booking->id))->toBeNull();
    expect(Booking::withTrashed()->find($booking->id))->not->toBeNull();
});
