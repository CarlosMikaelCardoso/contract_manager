// Arquivo: src/main.tsx
// Comentário: Este arquivo configura os "provedores" que permitem
// que o RainbowKit e o Wagmi funcionem em toda a sua aplicação.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Importações necessárias do RainbowKit, Wagmi e TanStack Query
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // Escolha as redes que seu DApp usará
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { defineChain } from 'viem';

// 2. Configuração do Wagmi
const localhost = defineChain({
  id: 31337, // O Chain ID padrão do ambiente Cartesi (Anvil/Hardhat)
  name: 'Localhost 8545',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
});

const config = getDefaultConfig({
  appName: 'Meu DApp Cartesi',
  projectId: '491654d3f9a393f018b8d888f5bc5937', // Obtenha um em https://cloud.walletconnect.com
  chains: [mainnet, sepolia, localhost], // Adicione as redes que precisar
});


// 3. Cliente para o TanStack Query
const queryClient = new QueryClient();

// 4. Renderização da aplicação "envolvida" pelos provedores
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);