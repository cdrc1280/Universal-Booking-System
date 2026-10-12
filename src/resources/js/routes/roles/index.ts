import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::index
* @see app/Domains/Role/Controllers/RoleController.php:22
* @route '/roles'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Domains\Role\Controllers\RoleController::store
* @see app/Domains/Role/Controllers/RoleController.php:33
* @route '/roles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Domains\Role\Controllers\RoleController::store
* @see app/Domains/Role/Controllers/RoleController.php:33
* @route '/roles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Role\Controllers\RoleController::store
* @see app/Domains/Role/Controllers/RoleController.php:33
* @route '/roles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::store
* @see app/Domains/Role/Controllers/RoleController.php:33
* @route '/roles'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::store
* @see app/Domains/Role/Controllers/RoleController.php:33
* @route '/roles'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
export const update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
update.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
update.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
const updateForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
updateForm.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::update
* @see app/Domains/Role/Controllers/RoleController.php:40
* @route '/roles/{role}'
*/
updateForm.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Domains\Role\Controllers\RoleController::destroy
* @see app/Domains/Role/Controllers/RoleController.php:47
* @route '/roles/{role}'
*/
export const destroy = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Domains\Role\Controllers\RoleController::destroy
* @see app/Domains/Role/Controllers/RoleController.php:47
* @route '/roles/{role}'
*/
destroy.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Role\Controllers\RoleController::destroy
* @see app/Domains/Role/Controllers/RoleController.php:47
* @route '/roles/{role}'
*/
destroy.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::destroy
* @see app/Domains/Role/Controllers/RoleController.php:47
* @route '/roles/{role}'
*/
const destroyForm = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Domains\Role\Controllers\RoleController::destroy
* @see app/Domains/Role/Controllers/RoleController.php:47
* @route '/roles/{role}'
*/
destroyForm.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const roles = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default roles