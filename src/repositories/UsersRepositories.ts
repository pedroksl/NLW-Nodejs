import { EntityRepository, Repository } from "typeorm";
import { User } from '../models/User'

/**
 * User Custom Respository.
 */
@EntityRepository(User)
class UsersRepository extends Repository<User> {
}

export { UsersRepository };