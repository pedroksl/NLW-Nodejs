import { EntityRepository, Repository } from "typeorm";
import { Survey } from '../models/Survey'

/**
 * Survey Custom Respository.
 */
@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {
}

export { SurveysRepository };