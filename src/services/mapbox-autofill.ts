import "cross-fetch/polyfill";
import { AutofillRetrieveResponse, AutofillSuggestion, GeocodeFeature, MapboxAutofill, SessionToken } from "@mapbox/search-js-core";
import {AddressData, MapboxStrategy, SuggestionData } from "./types"

class MapboxAutofillStrategy implements MapboxStrategy {
  autofill: MapboxAutofill;
  token:SessionToken
  cache:AutofillSuggestion[]

  constructor() {
    this.autofill = new MapboxAutofill({
      accessToken: process.env.MAPBOX_API_KEY,
    });
    this.token = new SessionToken();
    this.cache = [];
  }

  private async fetchResult(query: string, country?: string) {
    const responseData = await this.autofill.suggest(query, {
      country: country ?? undefined,
      sessionToken:this.token
    });
    const data = responseData.suggestions;
    return data
  }

  private convertSuggestionToAddressData(data:AutofillRetrieveResponse):AddressData{
    const result = data.features[0].properties;
    return {
      line1:result.address_line1 ?? '',
      line2:result.address_line2,
      postcode:result.postcode ?? '',
      region:`${result.country_code?.toLocaleUpperCase()}-${result.address_level1}` ?? '',
      townCity:result.address_level2 ?? '',
    }
  }
  
  private convertAutofillToSuggestion(data:AutofillSuggestion):SuggestionData {
    return {
      id:data.action.id,
      value:data.place_name ?? ''
    }
  }

  async suggest(query:string,country:string) {
    console.log("AUTOFILL: suggest");
    const autofillSuggestions = await this.fetchResult(query,country);
    this.cache = autofillSuggestions
    return autofillSuggestions.map(this.convertAutofillToSuggestion);
  };
  async retrieve(id: string) {
    console.log("AUTOFILL: retrieve");
    const suggestion = this.cache.find((suggestion)=>suggestion.action.id === id);
    if(!suggestion) throw Error("Failed to find suggestion in cache")
    const data = await this.autofill.retrieve(suggestion,{sessionToken:this.token});
    return this.convertSuggestionToAddressData(data)
  };
}

export default MapboxAutofillStrategy;
