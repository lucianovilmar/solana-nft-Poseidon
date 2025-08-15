'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Nft {
  id: string;
  name: string;
  image: string;
  wallet: string;
  number: string;
  mint: string;
  badge: boolean;
  power: number;
  rarity: string;
  totalPower: number;
  forSale: boolean;
}

export interface NftMin {
  id: string;
  name: string;
  image: string;
  wallet: string;
  number: string;
  mint: string;
  badge: boolean;
  power: number;
  rarity: string;
  totalPower: number;
  forSale: boolean;
}

export interface UserProfile {
  name: string;
  image: string;
  wallets: string[];
}


interface AppContextType {
  nfts: Nft[];
  setNfts: (nfts: Nft[]) => void;
  addNfts: (novosNfts: Nft[]) => void;
  nftsMin: Nft[];
  setNftsMin: (nftsMin: NftMin[]) => void;
  addNftsMin: (novosNftsMin: NftMin[]) => void;  
  totalPower: number;
  viewPage: string;
  setViewPage: (page: string) => void;
  viewHeader: string;
  setViewHeader: (Header: string) => void;
  isWalletConnectOpen: boolean;
  setIsWalletConnectOpen: (connectw: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (profileModal: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: (userProfile: UserProfile) => void;

  // Aqui você pode adicionar outros dados que desejar compartilhar
  // user?: User;
  // theme?: 'light' | 'dark';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [nftsMin, setNftsMin] = useState<NftMin[]>([]);
  const [totalPower, setTotalPower] = useState(0);
  const [viewPage, setViewPage] = useState<string>('');
  const [viewHeader, setViewHeader] = useState<string>('');
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    image: '',
    wallets: [],
  });

  const addNfts = (novosNfts: Nft[]) => {
    // Usa o setNfts para adicionar os novos NFTs ao array existente
    // A função de callback garante que você sempre use a versão mais recente do estado 'nfts'
    setNfts(prevNfts => [...prevNfts, ...novosNfts]);
  };


  const addNftsMin = (novosNftsMin: Nft[]) => {
    // Usa o setNfts para adicionar os novos NFTs ao array existente
    // A função de callback garante que você sempre use a versão mais recente do estado 'nfts'
    setNftsMin(prevNftsMin => [...prevNftsMin, ...novosNftsMin]);
  };


  useEffect(() => {
    const soma = nfts.reduce((acc, nft) => acc + (nft.totalPower ?? 0), 0);
    setTotalPower(soma);
  }, [nfts]);

  useEffect(() => {
    const soma = nftsMin.reduce((acc, nftMin) => acc + (nftMin.totalPower ?? 0), 0);
    setTotalPower(soma);
  }, [nfts]);

  return (
    <AppContext.Provider
      value={{
        nfts,
        setNfts,
        nftsMin,
        setNftsMin, 
        totalPower,
        viewPage,
        setViewPage,
        addNfts,
        viewHeader,
        setViewHeader,
        isWalletConnectOpen,
        setIsWalletConnectOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
