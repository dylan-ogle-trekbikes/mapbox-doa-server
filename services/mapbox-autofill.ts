import "cross-fetch/polyfill";
import { MapboxGeocode } from "@mapbox/search-js-core";

class MapboxService {
  geocode: MapboxGeocode;

  constructor() {
    this.geocode = new MapboxGeocode({
      accessToken: process.env.MAPBOX_API_KEY,
    });
  }

  async fetchResult(query: string, country?: string) {
    const responseData = await this.geocode.forward(query, {
      country: country ?? undefined,
    });
    return responseData.features.map((suggestion) => suggestion.place_name);
  }
}

export default MapboxService;
