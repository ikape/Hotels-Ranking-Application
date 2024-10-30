// src/types.ts

export interface Category {
    id: string;
    name: string;
    isCustom: boolean;  
}
export interface Hotel {
    id: string;
    name: string;
    country: string;
    address: string;
    category: string;
}
