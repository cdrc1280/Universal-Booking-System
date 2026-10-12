<?php

declare(strict_types=1);

namespace App\Domains\Booking\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'location_id',
        'customer_id',
        'booking_reference',
        'customer_name',
        'customer_email',
        'customer_phone',
        'status',
        'payment_status',
        'total_price_in_cents',
        'currency',
        'notes',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected $casts = [
        'total_price_in_cents' => 'integer',
        'cancelled_at' => 'immutable_datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}
