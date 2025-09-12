import { ConnectButton } from '@rainbow-me/rainbowkit';
import { InputForm } from './InputForm';
import { Notices } from './Notices';
import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { stringToHex, hexToString } from 'viem';
import { RentalList } from './RentalList'; 

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

  // CORREÇÃO: Estabiliza a função fetchRentals com useCallback e um array de dependências vazio.
  // Isso garante que a função seja criada apenas uma vez, quebrando o loop.
  const fetchRentals = useCallback(async () => {
      setIsLoading(true);
      console.log("Buscando lista de imóveis...");
      
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
  }, []); // O array vazio [] é a chave para quebrar o loop.

  // Roda apenas uma vez quando o usuário se conecta
  useEffect(() => {
    if (isConnected) {
      fetchRentals();
    }
  }, [isConnected, fetchRentals]);

  return (
    <div>
      <h1>Meu DApp Cartesi Frontend</h1>
      <ConnectButton />
      <hr />
      {isConnected && (
        <>
          <InputForm />
          <hr />
          
          <div style={{ margin: '20px 0' }}>
              <h3>Ações</h3>
              <button onClick={fetchRentals} disabled={isLoading}>
                  {isLoading ? 'Atualizando...' : 'Atualizar Lista (Grátis)'}
              </button>
          </div>
          
          <RentalList rentals={rentals} />
          <hr />
          
          <Notices onNewNotice={fetchRentals} />
        </>
      )}
    </div>
  );
}

export default App;
