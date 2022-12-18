import express from "express";
import MapboxService from "../services/mapbox-autofill"

interface Controller {
    [k:string]: (req:express.Request,res:express.Response) => any
}

const MapboxSearchController: Controller = {
    getSearchSuggestions:async (req,res)=>{
        const searchStr: string = req.body.search;
        const country: string = req.body.country;
        if (!searchStr)
          return res
            .status(400)
            .json({ result: "Bad request: search param required" });
        const autofill = new MapboxService();
        const results = await autofill.fetchResult(searchStr, country);
        res.status(200).json({ results });
    }
}

export default MapboxSearchController