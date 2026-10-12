import Location from './Location'
import User from './User'
import Role from './Role'

const Domains = {
    Location: Object.assign(Location, Location),
    User: Object.assign(User, User),
    Role: Object.assign(Role, Role),
}

export default Domains