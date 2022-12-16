import express from "express";
import MapboxService from "../services/mapbox-autofill"

interface Controller {
    [k:string]: (req:express.Request,res:express.Response) => any
}

const MapboxSearchController: Controller = {
    getSearchSuggestions:async (req,res)=>{
        const searchStr: string = req.query.search as string;
        const country: string = req.query.locale as string;
        if (!searchStr)
          return res
            .status(400)
            .json({ result: "Bad request: search param required" });
        const autofill = new MapboxService();
        const result = await autofill.fetchResult(searchStr, country);
        res.status(200).json({ result });
    }
}

export default MapboxSearchController