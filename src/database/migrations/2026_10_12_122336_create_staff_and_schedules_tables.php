<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->text('bio')->nullable();
            $table->string('timezone', 64)->default('UTC');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('staff_locations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['staff_profile_id', 'location_id']);
        });

        Schema::create('staff_services', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->unsignedInteger('custom_duration_minutes')->nullable();
            $table->unsignedBigInteger('custom_price_in_cents')->nullable();
            $table->timestamps();

            $table->unique(['staff_profile_id', 'service_id']);
        });

        Schema::create('staff_schedules', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week')->comment('0=Sunday, 1=Monday, ..., 6=Saturday');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['staff_profile_id', 'day_of_week', 'is_active']);
        });

        Schema::create('staff_schedule_breaks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_schedule_id')->constrained('staff_schedules')->cascadeOnDelete();
            $table->string('label')->default('Break');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('staff_schedule_overrides', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time')->nullable()->comment('Null means completely off on this date');
            $table->time('end_time')->nullable();
            $table->boolean('is_working_day')->default(true);
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->unique(['staff_profile_id', 'date']);
        });

        Schema::create('staff_time_off', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->string('reason')->nullable();
            $table->string('status', 32)->default('approved')->index()->comment('pending, approved, rejected');
            $table->timestamps();

            $table->index(['staff_profile_id', 'starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_time_off');
        Schema::dropIfExists('staff_schedule_overrides');
        Schema::dropIfExists('staff_schedule_breaks');
        Schema::dropIfExists('staff_schedules');
        Schema::dropIfExists('staff_services');
        Schema::dropIfExists('staff_locations');
        Schema::dropIfExists('staff_profiles');
    }
};
