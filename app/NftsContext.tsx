import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Nft {
  __id: string;
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

interface NftsContextType {
  nfts: Nft[];
  setNfts: (nfts: Nft[]) => void;
  totalPower: number;
}

const NftsContext = createContext<NftsContextType | undefined>(undefined);

export const NftsProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [totalPower, setTotalPower] = useState(0);

  useEffect(() => {
    const soma = nfts.reduce((accx, nft) => accx + (Number(nft.totalPower) ?? 0), 0);
    setTotalPower(soma);
  }, [nfts]);

  return (
    <NftsContext.Provider value={{ nfts, setNfts, totalPower }}>
      {children}
    </NftsContext.Provider>
  );
};

export const useNfts = (): NftsContextType => {
  const context = useContext(NftsContext);
  if (!context) {
    throw new Error('useNfts must be used within a NftsProvider');
  }
  return context;
};