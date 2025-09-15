// Arquivo: meu-dapp-frontend/src/ClientView.tsx
// Modificação: Adiciona uma lógica para exibir uma mensagem clara quando
// não há imóveis de outros proprietários disponíveis.

import { RentalList } from './RentalList';

interface Rental {
    id: number; description: string; price: number;
    owner: string; rented: boolean; rented_by?: string;
}

interface ClientViewProps {
    rentals: Rental[]; isLoading: boolean; onRefresh: () => void;
}

export const ClientView = ({ rentals, isLoading, onRefresh }: ClientViewProps) => {
    return (
        <div className="panel">
            <h2>Área do Cliente</h2>
            <p>Veja os imóveis disponíveis para alugar.</p>
            <button onClick={onRefresh} disabled={isLoading}>
                {isLoading ? 'Atualizando...' : 'Atualizar Lista (Grátis)'}
            </button>
            <h3>Imóveis Disponíveis</h3>
            
            {/* Lógica de exibição melhorada */}
            {isLoading ? (
                <p>Carregando...</p>
            ) : rentals.length > 0 ? (
                <RentalList rentals={rentals} />
            ) : (
                <p>Nenhum imóvel de outros proprietários foi encontrado para alugar.</p>
            )}
        </div>
    );
};