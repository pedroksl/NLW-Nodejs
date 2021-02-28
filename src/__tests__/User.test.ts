import request from 'supertest'
import { getConnection } from 'typeorm'
import { app } from '../app'

import createConnection from '../database'

// Description of the tests related to the user db table
describe("Users", () => {
    // Running required migrations before tests to
    // prepare the database
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })
    
    // Clean up code ran after tests to drop the
    // database before a future test is run
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    
    //Testing whether the creation of new users
    // on the databa is working as intended
    it ("Should be able to create a new user", async() => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })

        expect(response.status).toBe(201);
    })

    // Testing whether the attempt of creating a new
    // user with the same email return as error
    // as intended
    it ("Shouldn't be able to create a user with a repeated email", async() => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })
    })
})