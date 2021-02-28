import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepositories';

/**
 * Class responsible for responding to requests
 * sent to the nps route as well as compiling the info
 * from the survey users and calculating the nps value
 */
class NpsController {
    /**
     * Checkd if the requested survey exists, compiles the available
     * information and calculates the value of nps
     * @param request Request
     * @param response Response
     * @returns Json file containing the number of detractors, promoters, passives, total amount of answers and the nps value
     */
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        // Find all the users that have answered the specified
        // survey (having a non zero value) on the db
        const surveyUsers = await surveyUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        // Filters the amount of detractors from the user pool
        const detractors = surveyUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        // Filters the amount of promoters from the user pool
        const promoters = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        // Filters the amount of passives from the user pool
        const passives = surveyUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        // Calculate the value of the nps
        const totalAnswers = surveyUsers.length;
        const calculate = (((promoters - detractors) / totalAnswers) * 100).toFixed(2);

        // Return a json file containing all relevant information
        return response.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate
        })
    }
}

export { NpsController };