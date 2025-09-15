export interface Rental {
    id: number;
    description: string;
    price: number;
    owner: string;
    rented: boolean;
    rented_by?: string;
    comments?: string; // Usamos '?' para tornar o campo opcional por enquanto
}