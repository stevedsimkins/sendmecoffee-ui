import { useWallet } from "use-wallet";

function App() {

  const wallet = useWallet();
  const blockNumber = wallet.getBlockNumber();

  return (
    <div>
      <h1>Wallet</h1>
      {wallet.status === 'connected' ? (
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => wallet.reset()}>disconnect</button>
        </div>
      ) : (
        <div>
          Connect:
          <button onClick={() => wallet.connect()}>MetaMask</button>
          <button onClick={() => wallet.connect('frame')}>Frame</button>
          <button onClick={() => wallet.connect('portis')}>Portis</button>
        </div>
      )}
    </div>
  );
}

export default App;
