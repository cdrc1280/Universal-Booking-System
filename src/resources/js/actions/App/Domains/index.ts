import User from './User'
import Role from './Role'

const Domains = {
    User: Object.assign(User, User),
    Role: Object.assign(Role, Role),
}

export default Domains