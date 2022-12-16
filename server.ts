require("dotenv").config();
import express from "express";
import MapboxSearchController from "./controllers/mapboxSearch";

const app = express();
const port = 3000;

app.get("/search", MapboxSearchController.getSearchSuggestions);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
