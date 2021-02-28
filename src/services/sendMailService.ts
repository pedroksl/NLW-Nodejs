import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'


/**
 * Interface used to receive email configuration
 * Contains 'to': target email
 * 'subject': title of the email
 * 'variables': several info that goes on the email body
 * including user name, id, survey id, etc
 * 'path': the path of the handlebars template file
 */
interface SendMailProps {
    to: string;
    subject: string;
    variables: object;
    path: string;
}

/**
 * Service class responsible for the action of sending
 * fake emails using nodemailer, according to the
 * handlebars template
 */
class SendMailService {
    /**
     * Private variable used to store the transporter
     * created inside the constructor
     */
    private client: Transporter;

    // During creation of the serivice, define a transporter
    // that will be used to send fake emails later on
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    };

    /**
     * Send an email with the requested parameters
     * @param {SendMailProps} props to, subject, variables and path, in a SendMailProps interface
     */
    async execute({ to, subject, variables, path }: SendMailProps) {
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables)

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com>"
        })

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

// Exported an already created instance of the service
// ready to be used
export default new SendMailService;