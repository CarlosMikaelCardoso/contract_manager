// src/InputForm.tsx
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { stringToHex } from 'viem';

// Endereço do seu DApp (você obtém ao rodar `cartesi run`)
const DAPP_ADDRESS = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";

// ABI (Interface) do InputBox, necessária para a interação
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];
const INPUT_BOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768"; // Endereço do InputBox no localhost

export const InputForm = () => {
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const { writeContract, isPending, error } = useWriteContract();

    const handleCreateRental = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            method: "create_rental",
            data: {
                description,
                price: parseFloat(price)
            }
        };
        const hexInput = stringToHex(JSON.stringify(payload));

        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });
        setDescription(""); // Limpa o campo após o envio
        setPrice(""); // Limpa o campo após o envio
    };
    
    const handleListRentals = () => {
        const payload = {
            method: "list_rentals",
        };
        const hexInput = stringToHex(JSON.stringify(payload));

        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });
    }

    return (
        <div>
            <h3>Criar Anúncio de Aluguel</h3>
            <form onSubmit={handleCreateRental}>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do imóvel"
                    required
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Preço do aluguel"
                    required
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? "Criando..." : "Criar Anúncio"}
                </button>
            </form>
            <hr />
            <h3>Ações</h3>
            <button onClick={handleListRentals} disabled={isPending}>
                {isPending ? "Carregando..." : "Listar Imóveis"}
            </button>
            {error && <p>Erro: {error.message}</p>}
        </div>
    );
};