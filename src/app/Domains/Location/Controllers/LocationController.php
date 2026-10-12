<?php

declare(strict_types=1);

namespace App\Domains\Location\Controllers;

use App\Domains\Location\Actions\UpsertLocationAction;
use App\Domains\Location\DTOs\LocationData;
use App\Domains\Location\Models\Location;
use App\Domains\Location\Requests\UpsertLocationRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class LocationController extends Controller
{
    public function index(): Response
    {
        $locations = Location::query()->latest()->get();

        return Inertia::render('location/index', [
            'locations' => LocationData::collect($locations),
        ]);
    }

    public function store(UpsertLocationRequest $request, UpsertLocationAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    public function update(UpsertLocationRequest $request, Location $location, UpsertLocationAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $location);

        return redirect()->route('locations.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
