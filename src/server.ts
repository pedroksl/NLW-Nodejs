import express from 'express'

const app = express();

app.get("/", (request, response) => {
    return response.json({message: "Hello World"});
});

app.post("/", (request, response) => {
    return response.json({message: "Data saved!"});
});

app.listen(3333, () => console.log("Server is running!"));