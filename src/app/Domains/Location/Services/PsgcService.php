<?php

declare(strict_types=1);

namespace App\Domains\Location\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class PsgcService
{
    private const BASE_URL = 'https://psgc.gitlab.io/api';
    private const CACHE_TTL_SECONDS = 86400 * 7;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getRegions(): array
    {
        return Cache::remember('psgc:regions', self::CACHE_TTL_SECONDS, function (): array {
            $response = Http::timeout(10)->get(self::BASE_URL . '/regions.json');
            if ($response->failed()) {
                return [];
            }

            return $response->json() ?? [];
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getProvinces(string $regionCode): array
    {
        $sanitizedCode = preg_replace('/[^a-zA-Z0-9]/', '', $regionCode);
        if ($sanitizedCode === '') {
            return [];
        }

        return Cache::remember("psgc:provinces:{$sanitizedCode}", self::CACHE_TTL_SECONDS, function () use ($sanitizedCode): array {
            $response = Http::timeout(10)->get(self::BASE_URL . "/regions/{$sanitizedCode}/provinces.json");
            if ($response->failed()) {
                return [];
            }

            return $response->json() ?? [];
        });
    }

    /**
     * Fetch cities and municipalities filtered by province or region (for special administrative regions like NCR).
     *
     * @return array<int, array<string, mixed>>
     */
    public function getCitiesMunicipalities(?string $provinceCode, ?string $regionCode = null): array
    {
        if ($provinceCode) {
            $sanitizedProvince = preg_replace('/[^a-zA-Z0-9]/', '', $provinceCode);

            return Cache::remember("psgc:cities_mun:prov:{$sanitizedProvince}", self::CACHE_TTL_SECONDS, function () use ($sanitizedProvince): array {
                $response = Http::timeout(10)->get(self::BASE_URL . "/provinces/{$sanitizedProvince}/cities-municipalities.json");
                if ($response->failed()) {
                    return [];
                }

                return $response->json() ?? [];
            });
        }

        if ($regionCode) {
            $sanitizedRegion = preg_replace('/[^a-zA-Z0-9]/', '', $regionCode);

            return Cache::remember("psgc:cities_mun:reg:{$sanitizedRegion}", self::CACHE_TTL_SECONDS, function () use ($sanitizedRegion): array {
                $response = Http::timeout(10)->get(self::BASE_URL . "/regions/{$sanitizedRegion}/cities-municipalities.json");
                if ($response->failed()) {
                    return [];
                }

                return $response->json() ?? [];
            });
        }

        return [];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getBarangays(string $cityOrMunicipalityCode): array
    {
        $sanitizedCode = preg_replace('/[^a-zA-Z0-9]/', '', $cityOrMunicipalityCode);
        if ($sanitizedCode === '') {
            return [];
        }

        return Cache::remember("psgc:barangays:{$sanitizedCode}", self::CACHE_TTL_SECONDS, function () use ($sanitizedCode): array {
            $response = Http::timeout(10)->get(self::BASE_URL . "/cities-municipalities/{$sanitizedCode}/barangays.json");
            if ($response->failed()) {
                return [];
            }

            return $response->json() ?? [];
        });
    }
}
