import PsgcProxyController from './PsgcProxyController'
import LocationController from './LocationController'

const Controllers = {
    PsgcProxyController: Object.assign(PsgcProxyController, PsgcProxyController),
    LocationController: Object.assign(LocationController, LocationController),
}

export default Controllers