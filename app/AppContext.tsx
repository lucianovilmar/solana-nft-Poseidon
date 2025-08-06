'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
}

interface AppContextType {
  nfts: Nft[];
  setNfts: (nfts: Nft[]) => void;
  totalPower: number;
  viewPage: string;
  setViewPage: (page: string) => void;

  // Aqui você pode adicionar outros dados que desejar compartilhar
  // user?: User;
  // theme?: 'light' | 'dark';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [totalPower, setTotalPower] = useState(0);
  const [viewPage, setViewPage] = useState<string>('');

  useEffect(() => {
    const soma = nfts.reduce((acc, nft) => acc + (nft.totalPower ?? 0), 0);
    setTotalPower(soma);
  }, [nfts]);

  return (
    <AppContext.Provider
      value={{
        nfts,
        setNfts,
        totalPower,
        viewPage,
        setViewPage,
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
