import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysRepository } from '../repositories/SurveysRepositories';

/**
 * Class responsible for responding to a requests
 * sent to the surveys route. Provides two functions:
 * One responsible for displaying all data available in
 * the surveys database and another responsible for
 * creating new entires on the surveys database
 */
class SurveyController {
    /**
     * Create new survey and add to the surveys database
     * @param request Request
     * @param response Response
     * @returns Code 201 and the added survey if successful
     */
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        // Check for a survey with the same title
        const surveyAlreadyExists = await surveysRepository.findOne({
            title
        })

        // If a survey already existed, throw an AppError
        if (surveyAlreadyExists) {
            throw new AppError({
                message: "Survey already exists.",
                statusCode: 400
            })
        }

        // Create a new survey based on the request params
        const survey = surveysRepository.create({
            title, description
        });
        await surveysRepository.save(survey);

        // return code 201 for a success, and a json containing the created survey
        return response.status(201).json(survey);
    }

    /**
     * Returns all surveys on the database
     * @param request Request
     * @param response Response
     * @returns JSON list containing all surveys on the database
     */
    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        const all = await surveysRepository.find();

        return response.json(all);
    }
}

export { SurveyController };