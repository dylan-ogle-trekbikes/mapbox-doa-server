import "cross-fetch/polyfill";
import { GeocodeFeature, GeocodeFeatureContext, MapboxGeocode } from "@mapbox/search-js-core";
import { AddressData, MapboxStrategy, SuggestionData } from "./types";

class MapboxGeocodingStrategy implements MapboxStrategy {
  geocode: MapboxGeocode;
  cache: GeocodeFeature[];

  constructor() {
    this.geocode = new MapboxGeocode({
      accessToken: process.env.MAPBOX_API_KEY,
    });
    this.cache = [];
  }

  private async fetchResult(query: string, country?: string) {
    const responseData = await this.geocode.forward(query, {
      country: country ?? undefined,
    });
    const data = responseData.features;
    this.cache = data;
    return data;
  }

  private convertGeocodeToAddressData(data: GeocodeFeature): AddressData {
    const findProperty = (context:GeocodeFeatureContext[], property:string) => {
      return context.find((obj) => obj.id.includes(property));
    };
    return {
      line1: `${data.address || ""} ${data.text || ""}`,
      line2: "",
      postcode: findProperty(data.context, "postcode")?.text ?? "",
      region: findProperty(data.context, "region")?.short_code ?? "",
      townCity: findProperty(data.context, "place")?.text ?? "",
    };
  }

  private convertGeocodeToSuggestionData(data: GeocodeFeature): SuggestionData {
    return {
      value: data.place_name,
      id: data.id,
    };
  }

  async suggest(query: string, country: string) {
    console.log("GEOCODE: suggest");
    const geocodeData = await this.fetchResult(query, country);
    this.cache = geocodeData;
    return geocodeData.map(this.convertGeocodeToSuggestionData);
  }
  async retrieve(id: string) {
    console.log("GEOCODE: retrieve");    
    const geocodeData = this.cache.find((feature) => {
      return feature.id === id;
    });
    if (!geocodeData) throw new Error("Geocoding data not found");
    return this.convertGeocodeToAddressData(geocodeData);
  }
}

export default MapboxGeocodingStrategy;
