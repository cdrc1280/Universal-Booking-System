<?php

declare(strict_types=1);

namespace App\Domains\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class BookingItem extends Model
{
    protected $fillable = [
        'booking_id',
        'service_id',
        'staff_profile_id',
        'starts_at',
        'ends_at',
        'blocked_from',
        'blocked_until',
        'price_in_cents',
        'occupies_slot',
        'hold_expires_at',
    ];

    protected $casts = [
        'starts_at' => 'immutable_datetime',
        'ends_at' => 'immutable_datetime',
        'blocked_from' => 'immutable_datetime',
        'blocked_until' => 'immutable_datetime',
        'hold_expires_at' => 'immutable_datetime',
        'price_in_cents' => 'integer',
        'occupies_slot' => 'boolean',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
