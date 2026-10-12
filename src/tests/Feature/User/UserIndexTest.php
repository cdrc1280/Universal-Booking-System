<?php

declare(strict_types=1);

use App\Domains\User\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('it renders the users index page with inertia', function () {
    $operator = User::factory()->create();
    User::factory()->count(4)->create();

    $response = $this->actingAs($operator)->get(route('users.index'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/index')
            ->has('users.data', 5)
            ->has('filters')
        );
});

test('it filters users by search query', function () {
    $operator = User::factory()->create();
    User::factory()->create(['name' => 'Alice Johnson', 'email' => 'alice@test.com']);
    User::factory()->create(['name' => 'Bob Smith', 'email' => 'bob@test.com']);

    $response = $this->actingAs($operator)->get(route('users.index', ['search' => 'Alice']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Alice Johnson')
        );
});
