// const connectDB = require("./db/index.js");
// const dotenv = require("dotenv");
// const app = require("./app.js");
import app from './app.js'


// dotenv.config({ path: "./.env" });

// connectDB();
const port = process.env.PORT || 5000;


app.get('/',(req, res)=>{
  res.send('Hello')
})

app.listen(port, (req, res) => {
  console.log("server is listening on: ", port);
});
