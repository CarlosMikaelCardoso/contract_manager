// src/RentalList.tsx

import { useWriteContract, useAccount } from 'wagmi';
import { stringToHex, type Address } from 'viem';

// Interface para tipar os dados dos imóveis
interface Rental {
    id: number;
    description: string;
    price: number;
    owner: string;
    rented: boolean;
    rented_by?: string;
}

interface RentalListProps {
    rentals: Rental[];
}

// Endereços e ABIs
const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];
const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";

// Sub-componente para cada "card" de imóvel
const RentalCard = ({ rental }: { rental: Rental }) => {
    const { writeContract, isPending } = useWriteContract();
    const { address: currentUserAddress } = useAccount(); // Pega o endereço do usuário conectado

    const handleRent = () => {
        const payload = {
            method: "alugar_imovel",
            data: { id: rental.id }
        };
        const hexInput = stringToHex(JSON.stringify(payload));
        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });
    };

    // LÓGICA DE EXIBIÇÃO CORRIGIDA
    const renderStatus = () => {
        // Se o imóvel já está alugado, mostra por quem.
        if (rental.rented) {
            return <p style={{ color: 'red' }}>Alugado por: {rental.rented_by}</p>;
        }
        // Se o usuário conectado for o dono do imóvel, mostra uma mensagem.
        if (currentUserAddress && currentUserAddress.toLowerCase() === rental.owner.toLowerCase()) {
            return <p style={{ color: 'lightblue' }}>Este é o seu imóvel.</p>;
        }
        // Se estiver livre e não for do usuário, mostra o botão para alugar.
        return (
            <button onClick={handleRent} disabled={isPending}>
                {isPending ? 'Alugando...' : 'Alugar'}
            </button>
        );
    };

    return (
        <div style={{ border: '1px solid #555', borderRadius: '8px', padding: '16px', margin: '16px 0', backgroundColor: '#333' }}>
            <h3>{rental.description}</h3>
            <p>Preço: {rental.price} ETH/mês</p>
            <p>Proprietário: {rental.owner}</p>
            {renderStatus()}
        </div>
    );
};


// Componente principal que renderiza a lista de cards
export const RentalList = ({ rentals }: RentalListProps) => {
    if (rentals.length === 0) {
        return <p>Nenhum imóvel disponível. Clique em "Atualizar Lista" para buscar.</p>;
    }

    return (
        <div>
            <h2>Imóveis Disponíveis</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {rentals.map(rental => <RentalCard key={rental.id} rental={rental} />)}
            </div>
        </div>
    );
};
