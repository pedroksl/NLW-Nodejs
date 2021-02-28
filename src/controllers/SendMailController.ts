import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepositories';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepositories';
import { UsersRepository } from '../repositories/UsersRepositories';
import SendMailService from '../services/sendMailService'
import { resolve } from 'path'
import { AppError } from '../errors/AppError';

/**
 * Class responsible for responding to a requests
 * sent to the sendMail route. Provides a method that looks
 * for the user provided on the request body, matches
 * it with the survey_id and, if validated, requests that
 * an email is sent to the user for service evaluation
 */
class SendMailController {
    /**
     * Validates the user info with the database
     * and sends an email with the survey
     * @param request Request
     * @param response Response
     * @returns JSON file containing the user to which the email was sent
     */
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email});

        // Throw an error in case the user ins't found on the db
        if (!user) {
            throw new AppError({
                message: "User does not exist",
                statusCode: 400
            })
        };

        // Throw an error in case the survey ins't found on the db
        const survey = await surveysRepository.findOne({id: survey_id})

        if (!survey) {
            throw new AppError({
                message: "Survey does not exist.",
                statusCode: 400
            })
        };

        // Build the path to the handlebars file used to customize the email design
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        // Build a JSON file with the user info to be used in the email body
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL,
            id: ""  // Created empty because the value depends
                    // whether the user already exists or not
        }

        // Check if the user already answered the survey
        const surveyUserExists = await surveyUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        })

        // If the user exists, send another email without re-adding
        // the same user to the survey_users db table
        if (surveyUserExists) {
            variables.id = surveyUserExists.id;
            await SendMailService.execute({
                to: email,
                subject: survey.title,
                variables,
                path: npsPath
            });

            return response.json(surveyUserExists);
        }

        // In case it's a new user, create the entry on the db
        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id,
        });
        await surveyUsersRepository.save(surveyUser);
        // Update the variables with the user id with the newly created entry
        variables.id = surveyUser.id;

        // Request SendMailService to send a service with
        // the appropriate parameters
        await SendMailService.execute({
            to: email,
            subject: survey.title,
            variables,
            path: npsPath
        });

        // Return a JSON file containing the target user for the email
        return response.json(surveyUser);
    }
}

export { SendMailController };