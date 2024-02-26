'use client'

declare global {
  interface Window {
    ethereum: any
  }
}

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LendingBorrowingArtifact from '../utils/contracts/LendingBorrowing.json';

export default function Home() {
  const lendingBorrowingContractAddress: string = '0x43Fe125d1b742C07bf25008122A0ba8B1A5C1E87'; // Linea testnet
  const [ethereum, setEthereum] = useState<Window['ethereum']>(undefined);
  const [connectedAccount, setConnectedAccount] = useState<string>('');    // connected wallet account
  const [lendingBorrowingContract, setlLendingBorrowingContract] = useState<ethers.Contract>();
  const [nftTokenId, setNftTokenId] = useState<number | string>('0x');
  const [depositList, setDepositList] = useState<any>({});
  const nftPrice = 1000 //NOTE: To simplify the logic, fix price as 1000 USDC per nft

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (ethereum) {
      handleAccounts();
    }
  }, [ethereum]);

  useEffect(() => {
    setContracts();
  }, [connectedAccount]);

  useEffect(() => {
    getDepoitList();
  }, [lendingBorrowingContract]);

  const init = () => {
    setEthereum(window.ethereum);
  }

  const handleAccounts = async () => {
    if(!ethereum) return;

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length > 0) {
      const account = accounts[0];

      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet. Request accounts.");
      await ethereum.request({ method: 'eth_requestAccounts' });
    }
  };

  const getDepoitList = async() => {
    if (!lendingBorrowingContract) return;

    const response = await fetch(`http://localhost:7777/trade/get-deposit-list`, {
      method: 'GET',
    });

    const res = await response.json();

    setDepositList(res);
  }

  const setContracts = async () => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const lendingBorrowingContract: ethers.Contract = new ethers.Contract(lendingBorrowingContractAddress as string, LendingBorrowingArtifact.abi, signer);

      setlLendingBorrowingContract(lendingBorrowingContract);
    }
  }

  const sendNft = async(nftTokenId: number | string) => {
    if (!lendingBorrowingContract) return;

    lendingBorrowingContract.lendAndBorrow(nftTokenId);
  }

  const updateNftTokenId = (id: number | string) => {
    setNftTokenId(id); 
  } 

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-indigo-950 via-60% to-emerald-900 to-90%">
      <section className="w-full max-w-2xl overflow-hidden">
        {
          Object.entries(depositList).map((item: any, index: number) => {
            const [address, nfts] = item;
            return (
              <div key={index} className="mb-8 bg-slate-300 text-slate-600 rounded-xl divide-y divide-slate-400">
                <p className="truncate p-8">
                  User address: 
                  <a 
                    href={`https://goerli.lineascan.build/address/${address}`} 
                    className="hover:underline text-blue-600 visited:text-purple-600"
                    target="_blank">
                      {address}
                  </a>
                </p>
                <ul className="p-8">
                  Deposited NFT: {nfts.map((nft: any, idx: number) => <li key={idx} className="truncate text-sm">{nft}</li>)}
                </ul>
                <p className="p-8 text-right">Borrowed: {nftPrice * nfts.length} USDC</p>
              </div>
            )
          })
        }
      </section>

      <section className='sticky bottom-2 mb-4'>
        <div id='donationBlock' className='flex rounded-md p-2 overflow-hidden bg-gradient-to-r from-indigo-700 via-60% to-emerald-700 to-90% shadow-lg'>
          <input 
            type="text" 
            value={nftTokenId}
            onChange={e => { updateNftTokenId(e.currentTarget.value); }}
            id="lendNftInput" 
            className='p-4 text-black bg-slate-300' />
          
          <button 
            id='lendNftButton' 
            className='p-6 bg-zinc-700 hover:bg-zinc-900 disabled:bg-gray-700 disabled:cursor-not-allowed'
            disabled={!connectedAccount}
            onClick={_ => {sendNft(nftTokenId)}}>
            Lend my NFT
          </button>
        </div>
      </section>
    </main>
  )
}
