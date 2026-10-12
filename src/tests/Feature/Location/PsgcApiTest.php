<?php

declare(strict_types=1);

namespace Tests\Feature\Location;

use App\Domains\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class PsgcApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_fetch_psgc_regions(): void
    {
        Http::fake([
            'https://psgc.gitlab.io/api/regions.json' => Http::response([
                [
                    'code' => '010000000',
                    'name' => 'Ilocos Region',
                    'regionName' => 'Region I',
                ],
                [
                    'code' => '130000000',
                    'name' => 'National Capital Region',
                    'regionName' => 'NCR',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)->getJson(route('psgc.regions'));

        $response->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment([
                'code' => '010000000',
                'name' => 'Ilocos Region',
            ]);
    }

    public function test_authenticated_user_can_fetch_provinces_for_region(): void
    {
        Http::fake([
            'https://psgc.gitlab.io/api/regions/010000000/provinces.json' => Http::response([
                [
                    'code' => '012800000',
                    'name' => 'Ilocos Norte',
                    'regionCode' => '010000000',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)->getJson(route('psgc.provinces', ['regionCode' => '010000000']));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'code' => '012800000',
                'name' => 'Ilocos Norte',
            ]);
    }

    public function test_authenticated_user_can_fetch_cities_municipalities(): void
    {
        Http::fake([
            'https://psgc.gitlab.io/api/provinces/012800000/cities-municipalities.json' => Http::response([
                [
                    'code' => '012801000',
                    'name' => 'Adams',
                    'isMunicipality' => true,
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)->getJson(route('psgc.cities-municipalities', ['province_code' => '012800000']));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'code' => '012801000',
                'name' => 'Adams',
            ]);
    }

    public function test_authenticated_user_can_fetch_barangays(): void
    {
        Http::fake([
            'https://psgc.gitlab.io/api/cities-municipalities/012801000/barangays.json' => Http::response([
                [
                    'code' => '012801001',
                    'name' => 'Adams (Pob.)',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)->getJson(route('psgc.barangays', ['code' => '012801000']));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'code' => '012801001',
                'name' => 'Adams (Pob.)',
            ]);
    }
}
