// src/InputForm.tsx

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { stringToHex, type Address } from 'viem';

// Endereço do DApp e do InputBox
const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";
const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";

// ABI (Interface) do InputBox
const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}];

export const InputForm = () => {
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const { writeContract, isPending, error } = useWriteContract();

    const handleCreateRental = async (e: React.FormEvent) => {
        e.preventDefault();
        // Garante que o preço seja um número antes de enviar
        const priceAsNumber = parseFloat(price);
        if (isNaN(priceAsNumber)) {
            alert("Por favor, insira um preço válido.");
            return;
        }

        const payload = {
            method: "create_rental",
            data: {
                description,
                price: priceAsNumber
            }
        };
        const hexInput = stringToHex(JSON.stringify(payload));

        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });

        // Limpa os campos após o envio
        setDescription("");
        setPrice("");
    };

    return (
        <div>
            {/* O Título agora está no App.tsx, mas podemos mantê-lo aqui para clareza */}
            <h3>Criar Anúncio de Aluguel</h3>
            <form onSubmit={handleCreateRental}>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do imóvel"
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Preço do aluguel"
                    required
                    style={{ marginRight: '10px' }}
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? "Criando..." : "Criar Anúncio"}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
        </div>
    );
};
