<?php

declare(strict_types=1);

namespace App\Domains\Location\Controllers;

use App\Domains\Location\Services\PsgcService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PsgcProxyController extends Controller
{
    public function __construct(
        private readonly PsgcService $psgcService,
    ) {}

    public function regions(): JsonResponse
    {
        $regions = $this->psgcService->getRegions();

        return response()->json($regions);
    }

    public function provinces(string $regionCode): JsonResponse
    {
        $provinces = $this->psgcService->getProvinces($regionCode);

        return response()->json($provinces);
    }

    public function citiesMunicipalities(Request $request): JsonResponse
    {
        $provinceCode = $request->query('province_code');
        $regionCode = $request->query('region_code');

        $cities = $this->psgcService->getCitiesMunicipalities(
            is_string($provinceCode) ? $provinceCode : null,
            is_string($regionCode) ? $regionCode : null
        );

        return response()->json($cities);
    }

    public function barangays(string $cityOrMunicipalityCode): JsonResponse
    {
        $barangays = $this->psgcService->getBarangays($cityOrMunicipalityCode);

        return response()->json($barangays);
    }
}
