<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL'])) {
            $baseStorage = '/tmp/storage';
            $paths = [
                $baseStorage . '/framework/views',
                $baseStorage . '/framework/cache',
                $baseStorage . '/framework/sessions',
                $baseStorage . '/logs',
            ];

            foreach ($paths as $path) {
                if (!is_dir($path)) {
                    mkdir($path, 0755, true);
                }
            }

            $this->app->useStoragePath($baseStorage);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
