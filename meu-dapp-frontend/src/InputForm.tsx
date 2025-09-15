// Arquivo: meu-dapp-frontend/src/InputForm.tsx
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { stringToHex, type Address } from 'viem';

// Endereços e ABI definidos localmente
const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";
const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];

export const InputForm = () => {
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [comments, setComments] = useState(""); // Estado para os comentários
    const { writeContract, isPending, error } = useWriteContract();

    const handleCreateRental = async (e: React.FormEvent) => {
        e.preventDefault();
        const priceAsNumber = parseFloat(price);
        if (isNaN(priceAsNumber)) {
            alert("Por favor, insira um preço válido.");
            return;
        }

        const payload = {
            method: "create_rental",
            data: {
                description,
                price: priceAsNumber,
                comments // Envia o comentário
            }
        };
        const hexInput = stringToHex(JSON.stringify(payload));

        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });

        setDescription("");
        setPrice("");
        setComments(""); // Limpa o campo
    };

    return (
        <div>
            <h3>Criar Anúncio de Aluguel</h3>
            <form onSubmit={handleCreateRental}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição do imóvel (ex: Casa na praia)"
                        required
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Preço do aluguel (ETH)"
                        required
                    />
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Comentários adicionais (ex: Aceita pets, 2 quartos)"
                        rows={3}
                    />
                    <button type="submit" disabled={isPending}>
                        {isPending ? "Criando..." : "Criar Anúncio"}
                    </button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
        </div>
    );
};