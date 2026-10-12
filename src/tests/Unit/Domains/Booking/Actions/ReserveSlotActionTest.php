<?php

declare(strict_types=1);

use App\Domains\Booking\Actions\ReserveSlotAction;
use App\Domains\Booking\DTOs\ReserveSlotData;
use App\Domains\Booking\Models\Booking;
use App\Domains\Location\Models\Location;
use Illuminate\Support\Facades\DB;

it('creates draft booking with computed blocked buffer windows and hold TTL', function (): void {
    $facility = Location::create([
        'name' => 'Metro Dental Suite',
        'slug' => 'metro-dental-suite',
        'timezone' => 'America/New_York',
        'country_code' => 'US',
        'is_active' => true,
    ]);

    $serviceRecord = DB::table('services')->insertGetId([
        'name' => 'Crown Consultation',
        'slug' => 'crown-consultation',
        'duration_minutes' => 45,
        'buffer_before_minutes' => 15,
        'buffer_after_minutes' => 15,
        'price_in_cents' => 12000,
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $action = new ReserveSlotAction();

    $startsAt = new DateTimeImmutable('2026-10-20 14:00:00', new DateTimeZone('UTC'));
    $endsAt = new DateTimeImmutable('2026-10-20 14:45:00', new DateTimeZone('UTC'));

    $reservationDto = new ReserveSlotData(
        locationId: $facility->id,
        serviceId: $serviceRecord,
        staffProfileId: null,
        startsAt: $startsAt,
        endsAt: $endsAt,
        bufferBeforeMinutes: 15,
        bufferAfterMinutes: 15,
        priceInCents: 12000,
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor@example.com',
        customerPhone: '+1-555-0144',
        notes: 'First time visit.',
        holdTtlMinutes: 12,
    );

    $booking = $action->execute($reservationDto);

    expect($booking)->toBeInstanceOf(Booking::class);
    expect($booking->status)->toBe('pending');
    expect($booking->payment_status)->toBe('unpaid');
    expect($booking->booking_reference)->toStartWith('BK-');
    expect($booking->customer_name)->toBe('Eleanor Vance');
    expect($booking->customer_email)->toBe('eleanor@example.com');
    expect($booking->total_price_in_cents)->toBe(12000);

    $items = $booking->items;
    expect($items)->toHaveCount(1);

    $item = $items->first();
    expect($item->service_id)->toBe($serviceRecord);
    expect($item->price_in_cents)->toBe(12000);
    expect($item->occupies_slot)->toBeTrue();
    expect($item->starts_at->format('Y-m-d H:i:s'))->toBe('2026-10-20 14:00:00');
    expect($item->ends_at->format('Y-m-d H:i:s'))->toBe('2026-10-20 14:45:00');
    expect($item->blocked_from->format('Y-m-d H:i:s'))->toBe('2026-10-20 13:45:00');
    expect($item->blocked_until->format('Y-m-d H:i:s'))->toBe('2026-10-20 15:00:00');
    expect($item->hold_expires_at)->not->toBeNull();
});
