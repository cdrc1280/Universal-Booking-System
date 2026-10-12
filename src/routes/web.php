<?php

use App\Domains\Location\Controllers\LocationController;
use App\Domains\Role\Controllers\RoleController;
use App\Domains\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/index', [
            'metrics' => [
                'total_bookings' => \App\Domains\Booking\Models\Booking::count(),
                'active_staff' => \Illuminate\Support\Facades\DB::table('staff_profiles')->where('is_active', true)->count(),
                'services_count' => \Illuminate\Support\Facades\DB::table('services')->where('is_active', true)->count(),
                'revenue_in_cents' => (int) \App\Domains\Booking\Models\Booking::sum('total_price_in_cents'),
            ],
            'recent_bookings' => \App\Domains\Booking\Models\Booking::with(['items.service'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($booking) => [
                    'id' => $booking->id,
                    'reference' => $booking->booking_reference,
                    'customer_name' => $booking->customer_name,
                    'service_name' => $booking->items->first()?->service?->name ?? 'Standard Appointment',
                    'time_window' => $booking->items->first()?->starts_at?->format('M d, Y • h:i A') ?? 'Scheduled',
                    'status' => $booking->status,
                    'price_formatted' => '$' . number_format($booking->total_price_in_cents / 100, 2),
                ]),
        ]);
    })->name('dashboard');

    // Fully implemented active domain modules
    Route::resource('locations', LocationController::class)->except(['create', 'show', 'edit']);
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
    Route::resource('roles', RoleController::class)->except(['create', 'show', 'edit']);
});
