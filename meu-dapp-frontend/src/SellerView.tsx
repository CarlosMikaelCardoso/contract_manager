// meu-dapp-frontend/src/SellerView.tsx

import { InputForm } from './InputForm';
import { RentalList } from './RentalList';


interface Rental {
    id: number;
    description: string;
    price: number;
    owner: string;
    rented: boolean;
    rented_by?: string;
}

interface SellerViewProps {
    userRentals: Rental[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const SellerView = ({ userRentals, isLoading, onRefresh }: SellerViewProps) => {
    return (
        <div className="panel">
            <h2>Área do Vendedor</h2>
            <p>Anuncie seu imóvel na plataforma.</p>
            <InputForm />
            <h3 style={{ marginTop: '20px' }}>Seus Imóveis Anunciados</h3>
            <button onClick={onRefresh} disabled={isLoading}>
                {isLoading ? 'Atualizando...' : 'Atualizar Lista (Grátis)'}
            </button>
            <RentalList rentals={userRentals} />
        </div>
    );
};