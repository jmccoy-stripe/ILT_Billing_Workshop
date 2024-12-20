import fs from "fs";
import path from "path";

import { Customer, Subscription } from "./utils/interface";

// Path to the JSON file
const customerFilePath = path.resolve(__dirname, "customers.json");
const subscriptionFilePath = path.resolve(__dirname, "subscriptions.json");

// Type definition for a customer

// Load the JSON data
function loadCustomers(): Customer[] {
    try {
        const data = fs.readFileSync(customerFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save the JSON data
function saveCustomers(customers: Customer[]): void {
    fs.writeFileSync(
        customerFilePath,
        JSON.stringify(customers, null, 2),
        "utf-8"
    );
}

function loadSubscriptions(): Subscription[] {
    try {
        const data = fs.readFileSync(subscriptionFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save the JSON data
function saveSubscriptions(subscriptions: Subscription[]): void {
    fs.writeFileSync(
        subscriptionFilePath,
        JSON.stringify(subscriptions, null, 2),
        "utf-8"
    );
}

export function addSubscription(
    stripe_subscription_id: string,
    stripe_customer_id: string,
    plan_price: number,
    subscription_status: string,
    current_period_start: Date,
    current_period_end: Date
): Subscription {
    const subscriptions = loadSubscriptions();
    const newSubscription: Subscription = {
        stripe_subscription_id,
        stripe_customer_id,
        plan_price,
        subscription_status,
        current_period_start,
        current_period_end,
    };
    subscriptions.push(newSubscription);
    saveSubscriptions(subscriptions);
    return newSubscription;
}

// Get all customers
export function getAllCustomers(): Customer[] {
    return loadCustomers();
}

// Get a customer by ID
export function getCustomerById(id: string): Customer | undefined {
    const customers = loadCustomers();
    return customers.find((customer) => customer.stripe_customer_id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
    const customers = loadCustomers();
    return customers.find((customer) => customer.email === email);
}

// Add a new customer
export function addCustomer(id: string, name: string, email: string): Customer {
    const customers = loadCustomers();
    const newCustomer: Customer = {
        stripe_customer_id: id,
        name: name,
        email: email,
    };
    customers.push(newCustomer);
    saveCustomers(customers);
    return newCustomer;
}

// Update an existing customer
export function updateCustomer(
    id: string,
    updates: Partial<Omit<Customer, "stripe_customer_id">>
): Customer | null {
    const customers = loadCustomers();
    const index = customers.findIndex(
        (customer) => customer.stripe_customer_id === id
    );
    if (index === -1) return null;

    customers[index] = {
        ...customers[index],
        ...updates,
    };
    saveCustomers(customers);
    return customers[index];
}

// Delete a customer
export function deleteCustomer(id: string): boolean {
    const customers = loadCustomers();
    const newCustomers = customers.filter(
        (customer) => customer.stripe_customer_id !== id
    );
    if (newCustomers.length === customers.length) return false;

    saveCustomers(newCustomers);
    return true;
}

// Utility to generate a unique ID (UUID-like)
function generateId(): string {
    return "xxxxxx".replace(/[x]/g, () =>
        ((Math.random() * 36) | 0).toString(36)
    );
}
