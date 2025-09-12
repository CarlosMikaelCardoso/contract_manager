// Arquivo: src/RentalList.tsx

import { useWriteContract } from 'wagmi';
import { stringToHex, type Address } from 'viem';

// Interfaces para tipar os dados dos imóveis
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

// Endereços e ABIs (repetidos para o componente ser autônomo)
const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];
const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";

const RentalCard = ({ rental }: { rental: Rental }) => {
    const { writeContract, isPending } = useWriteContract();

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

    return (
        <div style={{ border: '1px solid #555', borderRadius: '8px', padding: '16px', margin: '16px', backgroundColor: '#333' }}>
            <h3>{rental.description}</h3>
            <p>Preço: {rental.price} ETH/mês</p>
            <p>Proprietário: {rental.owner}</p>
            {rental.rented ? (
                <p style={{ color: 'red' }}>Alugado por: {rental.rented_by}</p>
            ) : (
                <button onClick={handleRent} disabled={isPending}>
                    {isPending ? 'Alugando...' : 'Alugar'}
                </button>
            )}
        </div>
    );
};

export const RentalList = ({ rentals }: RentalListProps) => {
    if (rentals.length === 0) {
        return <p>Nenhum imóvel disponível. Clique em "Listar Imóveis" para buscar.</p>;
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
