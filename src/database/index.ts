import { Connection, createConnection, getConnectionOptions } from 'typeorm';

/**
 * Asyncronously creates and returns a connection to the appropriate
 * database, bet it production or testing, based on environmental variables
 */
export default async (): Promise<Connection> => {
    // Get the default connection options stored in ormconfig.json
    const defaultOptions = await getConnectionOptions();

    // Selects the appropriate database, according to NODE_ENV and returns a connection
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === "test" ? "./src/database/database.test.sqlite" : defaultOptions.database
        })
    );
}