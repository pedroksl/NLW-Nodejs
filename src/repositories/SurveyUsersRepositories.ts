import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from '../models/SurveyUser'

/**
 * Survey User Custom Respository.
 */
@EntityRepository(SurveyUser)
class SurveyUsersRepository extends Repository<SurveyUser> {
}

export { SurveyUsersRepository };