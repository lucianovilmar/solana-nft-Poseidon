'use client';
import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Nft {
  id: string;
  name: string;
  image: string;
  wallet: string;
  number: string;
  mint: string;
  badge: boolean;
  burned: boolean;
  power: number;
  rarity: string;
  totalPower: number;
  forSale: boolean;
  buyPrice: number;
  priceFormatted: string;
  pricePower: number;
  powerBadge: number;
  rewardsClaimed: number;
  rewardsAvailable: number;
  trdBurned: number;
  nftBurned: number;
  burnedPower: number;
  originalPower: number;
  poseidonBurned: number;
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
  buyPrice: number;
  buyPriceAdd?: number;
  priceFormatted: string;
  pricePower: number;
  powerBadge: number;
  rewardsClaimed: number;
  rewardsAvailable: number;
  trdBurned: number;
  burnedPower: number;
  originalPower: number;
}

export interface NftQueima {
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
  buyPrice: number;
  buyPriceAdd?: number;
  priceFormatted: string;
  pricePower: number;
  powerBadge: number;
  rewardsClaimed: number;
  rewardsAvailable: number;
  trdBurned: number;
  nftBurned: number;
  burnedPower: number;
  originalPower: number;
}

export interface UserProfile {
  id?: string;
  name?: string;
  image?: string;
  wallets: string[];
  isHolder?: boolean;
}


interface AppContextType {
  nfts: Nft[];
  setNfts: (nfts: Nft[]) => void;
  addNfts: (novosNfts: Nft[]) => void;
  nftsMin: NftMin[];
  setNftsMin: (nftsMin: NftMin[]) => void;
  addNftsMin: (novosNftsMin: NftMin[]) => void;
  totalPower: number;
  totalPowerMin: number;
  powerBadge: number;
  viewPage: string;
  setViewPage: (page: string) => void;
  viewHeader: string;
  setViewHeader: (Header: string) => void;
  isWalletConnectOpen: boolean;
  setIsWalletConnectOpen: (connectw: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (profileModal: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: Dispatch<SetStateAction<UserProfile>>;

  // Aqui você pode adicionar outros dados que desejar compartilhar
  // user?: User;
  // theme?: 'light' | 'dark';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [nftsMin, setNftsMin] = useState<NftMin[]>([]);
  const [totalPower, setTotalPower] = useState(0);
  const [totalPowerMin, setTotalPowerMin] = useState(0);
  const [powerBadge, setPowerBadge] = useState(0);
  const [viewPage, setViewPage] = useState<string>('');
  const [viewHeader, setViewHeader] = useState<string>('');
  const [viewHolder, setViewHolder] = useState<string>('');
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    image: '',
    wallets: [],
    isHolder: false,
  });

  const addNfts = (novosNfts: Nft[]) => {
    // Filtra os novos NFTs, mantendo apenas aqueles cujo 'number' não existe no estado atual
    const novosNftsUnicos = novosNfts.filter(novoNft => {
      // Usa .some() para verificar se algum NFT existente tem o mesmo número
      return !nfts.some(existingNft => existingNft.number === novoNft.number);
    });

    // Se houver novos NFTs únicos, atualiza o estado
    if (novosNftsUnicos.length > 0) {
      setNfts(prevNfts => [...prevNfts, ...novosNftsUnicos]);
    }
  };

  const addNftsMin = (novosNftsMin: NftMin[]) => {
    // Filtra os novos NFTs, mantendo apenas aqueles cujo 'number' não existe no estado atual
    const novosNftsUnicos = novosNftsMin.filter(novoNft => {
      // Usa .some() para verificar se algum NFT existente tem o mesmo número
      return !nftsMin.some(existingNft => existingNft.number === novoNft.number);
    });

    // Se houver novos NFTs únicos, atualiza o estado
    if (novosNftsUnicos.length > 0) {
      setNftsMin(prevNftsMin => [...prevNftsMin, ...novosNftsUnicos]);
    }
  };


  useEffect(() => {
    const soma = nfts.reduce((acc, nft) => acc + (nft.totalPower ?? 0), 0);
    setTotalPower(soma);
  }, [nfts]);

  useEffect(() => {
    const soma = nftsMin.reduce((acc, nftMin) => acc + (nftMin.totalPower ?? 0), 0);
    setTotalPowerMin(soma);
  }, [nftsMin]);

  return (
    <AppContext.Provider
      value={{
        nfts,
        setNfts,
        addNfts,
        nftsMin,
        setNftsMin,
        addNftsMin,
        totalPower,
        totalPowerMin,
        powerBadge,
        viewPage,
        setViewPage,
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
