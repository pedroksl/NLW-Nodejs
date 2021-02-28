import request from 'supertest'
import { getConnection } from 'typeorm'
import { app } from '../app'

import createConnection from '../database'

// Description of the tests related to the survey db table
describe("Surveys", () => {
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
    

    // Testing whether the creation of new serveys is
    // working as intended
    it ("Should be able to create a new survey", async() => {
        const response = await request(app).post("/surveys").send({
            title: "Title Example",
            description: "Description Example"
        })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    // Testing whether the get all surveys request is
    // working as intended
    it ("Should be able to get all surveys", async() => {
        // Creating a second entry to receive a
        // response while increasing its length
        await request(app).post("/surveys").send({
            title: "Title Example 2",
            description: "Description Example 2"
        })

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
    })
})