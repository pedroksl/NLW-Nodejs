import { Router } from 'express'
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

/**
 * Router class. Used to configure all the available
 * routes and redirect them to the appropriate controllers
 * that will handle the requests
 */

// Define a route
const router = Router();

// Instantiate all the needed controllers
const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

// Setup all the required/available routes
router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

// Export the router
export { router };