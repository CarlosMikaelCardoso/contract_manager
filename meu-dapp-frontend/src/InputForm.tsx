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
    const [inputValue, setInputValue] = useState("");
    const { writeContract, isPending, error } = useWriteContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hexInput = stringToHex(inputValue);

        writeContract({
            abi: INPUT_BOX_ABI,
            address: INPUT_BOX_ADDRESS,
            functionName: 'addInput',
            args: [DAPP_ADDRESS, hexInput],
        });
        setInputValue(""); // Limpa o campo após o envio
    };

    return (
        <div>
            <h3>Enviar Mensagem para o DApp</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite algo..."
                    required
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? "Enviando..." : "Enviar"}
                </button>
            </form>
            {error && <p>Erro: {error.message}</p>}
        </div>
    );
};