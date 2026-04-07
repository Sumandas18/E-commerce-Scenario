const express = require('express');
const app = express();
const connectDatabase = require('./app/config/dbConfig');   
require('dotenv').config();

app.use(express.json())
connectDatabase()

app.use("/lookup", require("./app/routers/lookupRoutes"))
app.use("/group", require("./app/routers/groupRoute"))
app.use("/combine", require("./app/routers/combineRoute"))

const port = 4002
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})