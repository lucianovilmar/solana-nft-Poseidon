'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

export function AddToProfileButton() {
  const { publicKey } = useWallet();

  const handleAddToProfile = () => {
    if (!publicKey) return;

    const walletAddress = publicKey.toBase58();

    // Pega as carteiras pendentes do localStorage
    const pendingWalletsRaw = localStorage.getItem('pendingWallets');
    const pendingWallets = pendingWalletsRaw ? JSON.parse(pendingWalletsRaw) : [];

    // Evita adicionar duplicatas
    if (pendingWallets.includes(walletAddress)) {
      toast.error('Esta carteira já está na lista para ser adicionada.');
      return;
    }

    // Adiciona a nova carteira e salva de volta no localStorage
    const updatedPendingWallets = [...pendingWallets, walletAddress];
    localStorage.setItem('pendingWallets', JSON.stringify(updatedPendingWallets));

    toast.success('Carteira pronta para ser adicionada ao seu perfil!');
  };

  if (!publicKey) return null;

  return (
    <button onClick={handleAddToProfile} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
      +
    </button>
  );
}

