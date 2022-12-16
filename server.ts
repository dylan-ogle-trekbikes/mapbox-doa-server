require("dotenv").config();
import express from "express";
import MapboxService from "./mapbox-autofill";
const app = express();
const port = 3000;

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.get("/search", async (req: express.Request, res: express.Response) => {
  const searchStr: string = req.query.search as string;
  const country: string = req.query.locale as string;
  if (!searchStr)
    return res
      .status(400)
      .json({ result: "Bad request: search param required" });
  const autofill = new MapboxService();
  const result = await autofill.fetchResult(searchStr, country);
  res.status(200).json({ result });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
