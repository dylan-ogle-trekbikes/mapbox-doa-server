import express from "express";
import MapboxAutofillStrategy from "../services/mapbox-autofill";
import MapboxGeocodingStrategy from "../services/mapbox-geocoding";
import { MapboxStrategy } from "../services/types";

interface Controller {
  [k: string]: (req: express.Request, res: express.Response) => any;
}

let serviceInstance: MapboxStrategy | undefined = undefined;

enum STRATEGIES {
    geocode,
    autofill
}

const getMapboxStrategy = (country: string):MapboxStrategy | undefined => {
    const geocodeLocales = process.env.GEOCODE_LOCALES ?? '';
    const autofillLocales = process.env.AUTOFILL_LOCALES ?? '';
    
  const supportedLocales = [
    ...geocodeLocales?.split(",").map((localeStr)=>{return{locale:localeStr,strategy:STRATEGIES.geocode}}),
    ...autofillLocales?.split(",").map((localeStr)=>{return{locale:localeStr,strategy:STRATEGIES.autofill}})
  ];

  if(!supportedLocales.length) return undefined
  const selectedStrategy = supportedLocales.find((val)=>val.locale === country)?.strategy
  return selectedStrategy === STRATEGIES.geocode ? new MapboxGeocodingStrategy() : new MapboxAutofillStrategy()
};

const MapboxSearchController: Controller = {
  getEnabledLocales: async (_req, res) => {
    const locales = [...(process.env.AUTOFILL_LOCALES?.split(",") ?? []),...(process.env.GEOCODE_LOCALES?.split(",") ?? [])];
    return res.status(200).json({ locales });
  },
  getSearchSuggestions: async (req, res) => {
    const searchStr: string = req.body.search;
    const country: string = req.body.country;
    if (!searchStr)
      return res
        .status(400)
        .json({ status: "Bad request: search param required" });
    serviceInstance = getMapboxStrategy(country);
    if(!serviceInstance) return res.status(500).json({status:"Failed to get service"});
    const results = await serviceInstance.suggest(searchStr, country);
    if (!results) return res.status(500).end();
    return res.status(200).json({ results });
  },
  getSuggestionResult: async (req, res) => {
    const id: string = req.body.id;
    if (!id)
      return res
        .status(400)
        .json({ status: "Bad request: suggestion id required" });
    if (!serviceInstance)
      return res
        .status(400)
        .json({
          status: "Empty cache: /search should be called before /retrieve",
        });
    const result = await serviceInstance.retrieve(id);
    serviceInstance = undefined;
    return res.status(200).json({ result });
  },
};

export default MapboxSearchController;
