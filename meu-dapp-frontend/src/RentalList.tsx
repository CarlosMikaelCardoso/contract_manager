// Arquivo: meu-dapp-frontend/src/RentalList.tsx
import { useWriteContract, useAccount } from 'wagmi';
import { stringToHex, type Address } from 'viem';

// Interface definida localmente
interface Rental {
    id: number;
    description: string;
    price: number;
    owner: string;
    rented: boolean;
    rented_by?: string;
    comments?: string; // Campo de comentários
}

interface RentalListProps {
    rentals: Rental[];
}

// Endereços e ABI definidos localmente
const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];
const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";

const RentalCard = ({ rental }: { rental: Rental }) => {
    const { writeContract, isPending } = useWriteContract();
    const { address: currentUserAddress } = useAccount();

    const handleRent = () => {
        const payload = { method: "alugar_imovel", data: { id: rental.id } };
        const hexInput = stringToHex(JSON.stringify(payload));
        writeContract({
            abi: INPUT_BOX_ABI, address: INPUT_BOX_ADDRESS,
            functionName: 'addInput', args: [DAPP_ADDRESS, hexInput],
        });
    };

    const renderStatus = () => {
        if (rental.rented) {
            return <p style={{ color: 'red' }}>Alugado por: {rental.rented_by}</p>;
        }
        if (currentUserAddress && currentUserAddress.toLowerCase() === rental.owner.toLowerCase()) {
            return <p style={{ color: 'lightblue' }}>Este é o seu imóvel.</p>;
        }
        return (
            <button onClick={handleRent} disabled={isPending}>
                {isPending ? 'Alugando...' : 'Alugar'}
            </button>
        );
    };

    return (
        <div style={{ border: '1px solid #555', borderRadius: '8px', padding: '16px', margin: '16px 0', backgroundColor: '#333' }}>
            <h3>{rental.description}</h3>
            {/* Exibe os comentários se eles existirem */}
            {rental.comments && <p><strong>Observações:</strong> {rental.comments}</p>}
            <p><strong>Preço:</strong> {rental.price} ETH/mês</p>
            <p><strong>Proprietário:</strong> {rental.owner}</p>
            {renderStatus()}
        </div>
    );
};

export const RentalList = ({ rentals }: RentalListProps) => {
    if (rentals.length === 0) {
        return <p>Nenhum imóvel para exibir nesta categoria.</p>;
    }

    return (
        <div>
            {rentals.map(rental => <RentalCard key={rental.id} rental={rental} />)}
        </div>
    );
};