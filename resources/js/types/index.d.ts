import type { Config } from 'ziggy-js';

export interface Auth {
    customer: Customer;
    cashier: Cashier;
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cashier {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
}

type OrderStatus = 'pending' | 'completed' | 'cancelled';

type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
};

type Order = {
    id: number;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
};

type OrderListItem = {
    id: number;
    status: OrderStatus;
    total: number;
    created_at: string;
    items?: Array<{
        id: number;
        name: string;
        pivot: {
            quantity: number;
            price: number;
        };
    }>;
};
