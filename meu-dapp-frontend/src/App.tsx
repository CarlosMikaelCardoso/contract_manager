import { ConnectButton } from '@rainbow-me/rainbowkit';
import { InputForm } from './InputForm';
import { Notices } from './Notices';
import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { stringToHex, hexToString } from 'viem';
import { RentalList } from './RentalList'; 
import './App.css';

const INSPECT_URL = "http://localhost:8080/inspect";

interface Rental {
    id: number;
    description: string;
    price: number;
    owner: string;
    rented: boolean;
    rented_by?: string;
}

function App() {
  const { isConnected } = useAccount();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRentals = useCallback(async () => {
      setIsLoading(true);
      const payload = { method: "listar_imoveis" };
      const hexPayload = stringToHex(JSON.stringify(payload));
      try {
          const response = await fetch(`${INSPECT_URL}/${hexPayload}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const result = await response.json();
          if (result.reports && result.reports.length > 0) {
              const decodedPayload = hexToString(result.reports[0].payload);
              const reportData = JSON.parse(decodedPayload);
              setRentals(reportData.data || []);
          } else {
              setRentals([]);
          }
      } catch (e) {
          console.error("Erro ao buscar imóveis:", e);
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchRentals();
    }
  }, [isConnected, fetchRentals]);

  return (
    <div>
      <h1>Meu DApp Cartesi - Mercado de Aluguéis</h1>
      <ConnectButton />
      <hr />
      {isConnected && (
        <>
          <div className="layout-container">
            <div className="panel">
              <h2>Área do Cliente</h2>
              <p>Veja os imóveis disponíveis para alugar.</p>
              <button onClick={fetchRentals} disabled={isLoading}>
                  {isLoading ? 'Atualizando...' : 'Atualizar Lista (Grátis)'}
              </button>
              <RentalList rentals={rentals} />
            </div>
            <div className="panel">
              <h2>Área do Vendedor</h2>
              <p>Anuncie seu imóvel na plataforma.</p>
              <InputForm />
              <h3 style={{marginTop: '20px'}}>Imóveis Anunciados</h3>
              <button onClick={fetchRentals} disabled={isLoading}>
                  {isLoading ? 'Atualizando...' : 'Atualizar Lista (Grátis)'}
              </button>
              <RentalList rentals={rentals} />
            </div>
          </div>
          <hr />
          <Notices onNewNotice={fetchRentals} />
        </>
      )}
    </div>
  );
}

export default App;
