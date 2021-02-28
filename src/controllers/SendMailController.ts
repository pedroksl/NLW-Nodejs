import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepositories';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepositories';
import { UsersRepository } from '../repositories/UsersRepositories';
import SendMailService from '../services/sendMailService'
import { resolve } from 'path'

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email});

        if (!user) {
            return response.status(400).json({
                error: "User does not exist."
            });
        };

        const survey = await surveysRepository.findOne({id: survey_id})

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exist."
            })
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserExists = await surveyUsersRepository.findOne({
            where: [{ user_id: user.id }, { value: null }],
            relations: ["user", "survey"],
        })

        if (surveyUserExists) {
            await SendMailService.execute(
                {
                    to: email,
                    subject: survey.title,
                    variables,
                    path: npsPath
                });
            return response.json(surveyUserExists);
        }

        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveyUsersRepository.save(surveyUser);

        await SendMailService.execute(
            {
                to: email,
                subject: survey.title,
                variables,
                path: npsPath
            });

        return response.json(surveyUser);
    }
}

export { SendMailController };