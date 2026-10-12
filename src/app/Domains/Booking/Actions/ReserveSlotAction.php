<?php

declare(strict_types=1);

namespace App\Domains\Booking\Actions;

use App\Domains\Booking\DTOs\ReserveSlotData;
use App\Domains\Booking\Exceptions\SlotUnavailableException;
use App\Domains\Booking\Models\Booking;
use App\Domains\Booking\Models\BookingItem;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class ReserveSlotAction
{
    /**
     * Atomically creates a draft booking reservation with a 10-minute hold TTL.
     * Concurrency is enforced at the database storage engine level via PostgreSQL GiST
     * exclusion constraints. Concurrent attempts to reserve an overlapping slot throw
     * SQLSTATE 23P01, which is trapped and converted into a typed SlotUnavailableException.
     *
     * @throws SlotUnavailableException
     */
    public function execute(ReserveSlotData $data): Booking
    {
        $bufferBefore = $data->bufferBeforeMinutes;
        $bufferAfter = $data->bufferAfterMinutes;

        $blockedFrom = $data->startsAt->modify("-{$bufferBefore} minutes");
        $blockedUntil = $data->endsAt->modify("+{$bufferAfter} minutes");
        $holdExpiresAt = now()->addMinutes($data->holdTtlMinutes)->toImmutable();

        return DB::transaction(function () use ($data, $blockedFrom, $blockedUntil, $holdExpiresAt): Booking {
            try {
                $booking = Booking::create([
                    'location_id' => $data->locationId,
                    'customer_id' => $data->customerId,
                    'booking_reference' => 'BK-' . strtoupper(Str::random(10)),
                    'customer_name' => $data->customerName,
                    'customer_email' => $data->customerEmail,
                    'customer_phone' => $data->customerPhone,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'total_price_in_cents' => $data->priceInCents,
                    'notes' => $data->notes,
                ]);

                BookingItem::create([
                    'booking_id' => $booking->id,
                    'service_id' => $data->serviceId,
                    'staff_profile_id' => $data->staffProfileId,
                    'starts_at' => $data->startsAt,
                    'ends_at' => $data->endsAt,
                    'blocked_from' => $blockedFrom,
                    'blocked_until' => $blockedUntil,
                    'price_in_cents' => $data->priceInCents,
                    'occupies_slot' => true,
                    'hold_expires_at' => $holdExpiresAt,
                ]);

                return $booking->load('items');
            } catch (QueryException $e) {
                // Trap PostgreSQL SQLSTATE 23P01: exclusion_violation
                if ($e->getCode() === '23P01' || str_contains($e->getMessage(), '23P01')) {
                    throw SlotUnavailableException::forStaffAndPeriod(
                        staffProfileId: (int) $data->staffProfileId,
                        from: $data->startsAt->format('Y-m-d H:i:s'),
                        until: $data->endsAt->format('Y-m-d H:i:s'),
                    );
                }

                throw $e;
            }
        });
    }
}
