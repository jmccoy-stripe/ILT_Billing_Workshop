import { Price } from "./Price";
import { Response } from "./Response";

export interface GetPricesResponse extends Response {
    prices: Price[];
}