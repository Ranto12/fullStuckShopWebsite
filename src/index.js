const express = require("express");
const db = require('./config');
const route = require("./route");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const Users = require("./models/UsersModels");
const Product = require("./models/ProductModels");
require('dotenv').config()

const app = express();

 async function cekConnect() {
    try {
        await db.authenticate();
        console.log("database connected");
        await Users.sync()
        await Product.sync()
    } catch (error) {
        console.log(error);
    }
 }

cekConnect();

app.use(cors({
    credentials : true, origin : "*"
}))
app.use(cookieParser())
app.use(express.json())
app.use(route)

app.listen(2000, () => {
    console.log(`server jalan pada http://localhost:2000`);
})