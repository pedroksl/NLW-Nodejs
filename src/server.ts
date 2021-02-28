import { app } from './app'

// Imports the application and send a message to
// notify when the server is up and running
app.listen(3333, () => console.log("Server is running!"));