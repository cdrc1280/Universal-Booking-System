import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
export const regions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: regions.url(options),
    method: 'get',
})

regions.definition = {
    methods: ["get","head"],
    url: '/psgc/regions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
regions.url = (options?: RouteQueryOptions) => {
    return regions.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
regions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: regions.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
regions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: regions.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
const regionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: regions.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
regionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: regions.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::regions
* @see app/Domains/Location/Controllers/PsgcProxyController.php:18
* @route '/psgc/regions'
*/
regionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: regions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

regions.form = regionsForm

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
export const provinces = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(args, options),
    method: 'get',
})

provinces.definition = {
    methods: ["get","head"],
    url: '/psgc/regions/{regionCode}/provinces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
provinces.url = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { regionCode: args }
    }

    if (Array.isArray(args)) {
        args = {
            regionCode: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        regionCode: args.regionCode,
    }

    return provinces.definition.url
            .replace('{regionCode}', parsedArgs.regionCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
provinces.get = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
provinces.head = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: provinces.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
const provincesForm = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: provinces.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
provincesForm.get = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: provinces.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::provinces
* @see app/Domains/Location/Controllers/PsgcProxyController.php:25
* @route '/psgc/regions/{regionCode}/provinces'
*/
provincesForm.head = (args: { regionCode: string | number } | [regionCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: provinces.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

provinces.form = provincesForm

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
export const citiesMunicipalities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: citiesMunicipalities.url(options),
    method: 'get',
})

citiesMunicipalities.definition = {
    methods: ["get","head"],
    url: '/psgc/cities-municipalities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
citiesMunicipalities.url = (options?: RouteQueryOptions) => {
    return citiesMunicipalities.definition.url + queryParams(options)
}

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
citiesMunicipalities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: citiesMunicipalities.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
citiesMunicipalities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: citiesMunicipalities.url(options),
    method: 'head',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
const citiesMunicipalitiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: citiesMunicipalities.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
citiesMunicipalitiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: citiesMunicipalities.url(options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::citiesMunicipalities
* @see app/Domains/Location/Controllers/PsgcProxyController.php:32
* @route '/psgc/cities-municipalities'
*/
citiesMunicipalitiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: citiesMunicipalities.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

citiesMunicipalities.form = citiesMunicipalitiesForm

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
export const barangays = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: barangays.url(args, options),
    method: 'get',
})

barangays.definition = {
    methods: ["get","head"],
    url: '/psgc/cities-municipalities/{code}/barangays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
barangays.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    if (Array.isArray(args)) {
        args = {
            code: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        code: args.code,
    }

    return barangays.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
barangays.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: barangays.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
barangays.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: barangays.url(args, options),
    method: 'head',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
const barangaysForm = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: barangays.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
barangaysForm.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: barangays.url(args, options),
    method: 'get',
})

/**
* @see \App\Domains\Location\Controllers\PsgcProxyController::barangays
* @see app/Domains/Location/Controllers/PsgcProxyController.php:45
* @route '/psgc/cities-municipalities/{code}/barangays'
*/
barangaysForm.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: barangays.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

barangays.form = barangaysForm

const PsgcProxyController = { regions, provinces, citiesMunicipalities, barangays }

export default PsgcProxyController