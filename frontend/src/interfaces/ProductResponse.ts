import { Product } from "./Product";
import { Response } from "./Response";

export interface GetProductsResponse extends Response {
    products: Product[];
}