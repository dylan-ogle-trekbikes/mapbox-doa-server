

export type AddressData = {
    line1:string;
    line2?:string;
    postcode:string;
    townCity:string;
    region:string;
    street?:string;
}

export type SuggestionData = {
    value:string;
    id:string;
}

export interface MapboxStrategy {
    suggest:(query:string,country:string)=>Promise<SuggestionData[]>;
    retrieve:(id:string)=>Promise<AddressData>;
}