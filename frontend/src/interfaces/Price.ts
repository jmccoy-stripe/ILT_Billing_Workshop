import { Product } from "./Product";

export interface Price {
    id: string;
    unit_amount: number;
    currency: string;
    product: Product;
}