'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import React from 'react';

interface AddToProfileButtonProps {
  onClick?: () => void;
}

export function AddToProfileButton({ onClick }: AddToProfileButtonProps) {
  const { publicKey } = useWallet();

  const handleAddToProfile = () => {
    if (onClick) {
      // Se veio um onClick externo, chama ele
      onClick();
      return;
    }

    // Lógica interna (fallback)
    if (!publicKey) return;

    const walletAddress = publicKey.toBase58();
    const pendingWalletsRaw = localStorage.getItem('pendingWallets');
    const pendingWallets = pendingWalletsRaw ? JSON.parse(pendingWalletsRaw) : [];

    if (pendingWallets.includes(walletAddress)) {
      toast.error('Esta carteira já está na lista para ser adicionada.');
      return;
    }

    const updatedPendingWallets = [...pendingWallets, walletAddress];
    localStorage.setItem('pendingWallets', JSON.stringify(updatedPendingWallets));
    toast.success('Carteira pronta para ser adicionada ao seu perfil!');
  };

  if (!publicKey) return null;

  return (
    <button
      onClick={handleAddToProfile}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
    >
      +
    </button>
  );
}

