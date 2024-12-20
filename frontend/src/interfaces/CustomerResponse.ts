import { Customer } from "./Customer";
import { Response } from "./Response";

export interface CreateCustomerResponse extends Response {
    stripeCustomerId: string;
}

export interface GetCustomerResponse extends Response {
    customer: Customer;
}