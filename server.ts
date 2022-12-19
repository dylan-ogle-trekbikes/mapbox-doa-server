require("dotenv").config();
import express from "express";
import cors from "cors"
import MapboxSearchController from "./controllers/mapbox.controller";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

//routing
app.post("/search", MapboxSearchController.getSearchSuggestions);
app.get('/locales',MapboxSearchController.getEnabledLocales);
app.get("/health", (_req,res)=>{
  res.set('Cache-Control','no-cache')
  res.status(200).json({status:'available'})
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
