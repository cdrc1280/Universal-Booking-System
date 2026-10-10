<?php

// Target: src/database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use App\Domains\User\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);
        Role::firstOrCreate(['name' => 'customer']);

        $admin = User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
        ]);
        $admin->assignRole($adminRole);

        $staff = User::factory()->create([
            'name' => 'Staff Member',
            'email' => 'staff@example.com',
        ]);
        $staff->assignRole($staffRole);

        User::factory(10)->create();
    }
}