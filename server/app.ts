import * as express from "express";
import { Application } from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import * as bodyParser from "body-parser";
const app: Application = express();
import signup from "./routes/signup";
import connection from "./db";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

app.use("/api", signup);
