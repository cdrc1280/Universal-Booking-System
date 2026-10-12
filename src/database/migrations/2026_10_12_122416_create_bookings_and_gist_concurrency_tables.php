<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Root appointment container. Line items represent the actual scheduled sessions.
        Schema::create('bookings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('booking_reference', 32)->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 32)->nullable();
            $table->string('status', 32)->default('pending')->index()
                ->comment('pending, confirmed, in_progress, completed, cancelled, no_show');
            $table->string('payment_status', 32)->default('unpaid')->index()
                ->comment('unpaid, authorized, partially_paid, paid, refunded');
            $table->unsignedBigInteger('total_price_in_cents')->default(0);
            $table->string('currency', 3)->default('USD');
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestampTz('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Physical slot reservation ledger. Buffers are baked into blocked_from/blocked_until
        // so that GiST range checks detect collisions across adjacent services with turnaround windows.
        Schema::create('booking_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('staff_profile_id')->nullable()->constrained('staff_profiles')->nullOnDelete();
            
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->timestampTz('blocked_from')->comment('starts_at minus buffer_before_minutes');
            $table->timestampTz('blocked_until')->comment('ends_at plus buffer_after_minutes');
            
            $table->unsignedBigInteger('price_in_cents')->default(0);
            $table->boolean('occupies_slot')->default(true)->index();
            $table->timestampTz('hold_expires_at')->nullable()->index()
                ->comment('Checkout draft TTL. Unconfirmed reservations past this timestamp are purged by ReleaseExpiredHoldsJob');
            $table->timestamps();
        });

        // Engine-level double-booking defense. Traps overlapping periods at the storage layer
        // via btree_gist indexing, rejecting concurrent INSERTs with SQLSTATE 23P01.
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("
                ALTER TABLE booking_items 
                ADD COLUMN blocked_period tstzrange 
                GENERATED ALWAYS AS (tstzrange(blocked_from, blocked_until, '[)')) STORED;
            ");

            DB::statement("
                ALTER TABLE booking_items 
                ADD CONSTRAINT booking_items_staff_no_overlap 
                EXCLUDE USING gist (
                    staff_profile_id WITH =, 
                    blocked_period WITH &&
                ) 
                WHERE (occupies_slot = true AND staff_profile_id IS NOT NULL);
            ");
        }

        // 4. Booking Item Addons (Attached upsells / extra options)
        Schema::create('booking_item_addons', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('booking_item_id')->constrained('booking_items')->cascadeOnDelete();
            $table->foreignId('service_addon_id')->constrained('service_addons')->cascadeOnDelete();
            $table->unsignedInteger('duration_minutes')->default(0);
            $table->unsignedBigInteger('price_in_cents')->default(0);
            $table->timestamps();
        });

        // 5. Booking Item Physical Resources (Rooms / Chairs / Machines)
        Schema::create('booking_item_resources', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('booking_item_id')->constrained('booking_items')->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->unsignedInteger('quantity_allocated')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE booking_items DROP CONSTRAINT IF EXISTS booking_items_staff_no_overlap;');
        }

        Schema::dropIfExists('booking_item_resources');
        Schema::dropIfExists('booking_item_addons');
        Schema::dropIfExists('booking_items');
        Schema::dropIfExists('bookings');
    }
};
