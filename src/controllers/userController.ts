import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepositories';
import * as yup from 'yup'
import { AppError } from '../errors/AppError';

/**
 * Class responsible for responding to a requests
 * sent to the users route. Provides a function
 * to add new users to the database.
 */
class UserController {
    /**
     * Create new user and add to the users database
     * @param request Request
     * @param response Response
     * @returns Code 201 and the added user if successful
     */
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        // Creating a schema for yup validation
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        // Try to validate using yup and throw an error if it fails
        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            throw new AppError({
                message: err,
                statusCode: 400
            })
        }

        const usersRepository = getCustomRepository(UsersRepository);

        // Check if the user already exists in the database
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        // If user already exists, throw an AppError
        if (userAlreadyExists) {
            throw new AppError({
                message: "User already exists.",
                statusCode: 400
            })
        }

        // If the user doesn't exist, create and save a new entry on the db
        const user = usersRepository.create({
            name, email
        });
        await usersRepository.save(user);

        // return code 201 for a success, and a json containing the created user
        return response.status(201).json(user);
    }
}

export { UserController };
