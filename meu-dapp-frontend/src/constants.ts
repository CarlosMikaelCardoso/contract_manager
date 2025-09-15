// Arquivo: meu-dapp-frontend/src/constants.ts
// Objetivo: Centralizar todos os endereços e ABIs do projeto.

import { type Address } from 'viem';

// Endereço do seu DApp na rede de teste
export const DAPP_ADDRESS: Address = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";

// Endereço do contrato InputBox da Cartesi
export const INPUT_BOX_ADDRESS: Address = "0x59b22D57D4f067708AB0c00552767405926dc768";

// ABI (Interface) da função 'addInput' do InputBox
export const INPUT_BOX_ABI = [{
    "type": "function", "name": "addInput",
    "inputs": [{"name": "dapp", "type": "address"}, {"name": "input", "type": "bytes"}],
    "outputs": [{"name": "", "type": "bytes32"}], "stateMutability": "nonpayable"
}] as const; // 'as const' melhora a inferência de tipos do wagmi