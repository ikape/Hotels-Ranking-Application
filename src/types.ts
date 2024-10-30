// src/types.ts

export interface Category {
    id: string;
    name: string;
    isCustom: true
}

export interface Hotel {
    id: string;
    name: string;
    country: string;
    address: string;
    category: string;
}
