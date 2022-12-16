require("dotenv").config();
import express from "express";
import MapboxSearchController from "./controllers/mapboxSearch";

const app = express();
const port = 3000;

app.get("/search", MapboxSearchController.getSearchSuggestions);
app.get("/health", (_req,res)=>{
  res.set('Cache-Control','no-cache')
  res.status(200).json({status:'available'})
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
