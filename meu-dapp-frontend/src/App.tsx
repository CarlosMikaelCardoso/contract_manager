// Exemplo de como seu App.tsx poderia ficar
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Exemplo, você pode usar qualquer UI kit
import { InputForm } from './InputForm';
import { Notices } from './Notices';
import { useAccount } from 'wagmi';

function App() {
  const { isConnected } = useAccount();

  return (
    <div>
      <h1>Meu DApp Cartesi Frontend</h1>
      <ConnectButton />
      <hr />
      {isConnected && (
        <>
          <InputForm />
          <hr />
          <Notices />
        </>
      )}
    </div>
  );
}

export default App;