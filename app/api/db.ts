import fs from 'fs';
import path from 'path';
import powerData from './data/power.json';
import badgesData from './data/badges.json';

// Interfaces
export interface NftPowerInfo {
  number: number;
  rarity: string;
  power: number;
}

export interface UserProfile {
  id?: string;
  name?: string;
  avatar?: string;
  isHolder?: boolean;
  wallets: string[];
}

export interface Ranking {
  wallet: string;
  totalPower: number;
  totalNfts: number;
  powerShare: number;
  totalInvestment: number;
  trdBurned: number;
  nftBurned: number;
}

export interface DbNftInfo {
  address: string;
  nftMint: string;
  rewardsClaimed: number;
  rewardsAvailable: number;
  power: number;
  trdBurned: number;
  number: number;
  poseidonBurned: number;
  boost: boolean;
}

export interface BackupNftInfo {
  mint: string;
  image: string;
  power: number;
  trdBurned: number;
  nftBurned: number;
  burnedPower: number;
}

// Load power data for fast lookup
const powerMap = new Map<number, NftPowerInfo>(
  (powerData as NftPowerInfo[]).map((item) => [item.number, item])
);

// Set of badges for fast lookup
const badgeSet = new Set<string>(badgesData as string[]);

// Load real poseidon database from message (1).txt in assets
let dbData: DbNftInfo[] = [];
const dbNftMap = new Map<string, DbNftInfo>();

try {
  const dbPath = path.join(process.cwd(), 'public', 'assets', 'message (1).txt');
  if (fs.existsSync(dbPath)) {
    dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    dbData.forEach(item => {
      dbNftMap.set(item.nftMint, item);
    });
    console.log(`Loaded ${dbData.length} real NFTs from message (1).txt`);
  }
} catch (e) {
  console.error("Failed to load message (1).txt database:", e);
}

// Load backup stats from response_1771685438848.json
let backupData: BackupNftInfo[] = [];
const backupNftMap = new Map<string, BackupNftInfo>();

try {
  const backupPath = path.join(process.cwd(), 'public', 'assets', 'response_1771685438848.json');
  if (fs.existsSync(backupPath)) {
    backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    backupData.forEach(item => {
      backupNftMap.set(item.mint, item);
    });
    console.log(`Loaded ${backupData.length} backup NFTs from response_1771685438848.json`);
  }
} catch (e) {
  console.error("Failed to load response_1771685438848.json database:", e);
}

// In-memory fallbacks for local development
const memoryUsers = new Map<string, UserProfile>();
const memoryPrices = new Map<string, number>();
const memoryRankings = new Map<string, Ranking>();

const defaultRankings: Ranking[] = [
  { wallet: "EtPdv1aSMgidVnaxkHhBNHGszXHLe3Z6nG2wpWMMdLDD", totalPower: 450000, totalNfts: 12, powerShare: 0.45, totalInvestment: 2500, trdBurned: 5000, nftBurned: 2 },
  { wallet: "5v8xyWZwHnUvoXr7HaaiF9TarPQ7Mhbjx4WprquWkoHRJ", totalPower: 280000, totalNfts: 8, powerShare: 0.28, totalInvestment: 1500, trdBurned: 2000, nftBurned: 1 },
  { wallet: "9z4wexRK6jW4M5xKxDZwBfdCoHwiWxKQ2Jz7KYNU8Nf", totalPower: 180000, totalNfts: 5, powerShare: 0.18, totalInvestment: 900, trdBurned: 800, nftBurned: 0 },
  { wallet: "3b7cAsbi4Yec6jcKAoZzHxusm8rtj4CDfE9BchmCKkC", totalPower: 90000, totalNfts: 3, powerShare: 0.09, totalInvestment: 450, trdBurned: 0, nftBurned: 0 }
];

defaultRankings.forEach(r => memoryRankings.set(r.wallet, r));

export const kvGet = async <T>(key: string): Promise<T | null> => {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    if (key.startsWith('user:')) {
      const wallet = key.substring(5);
      return (memoryUsers.get(wallet) as T) || null;
    }
    if (key.startsWith('price:')) {
      const mint = key.substring(6);
      return (memoryPrices.get(mint) as T) || null;
    }
    if (key === 'rankings') {
      const list = Array.from(memoryRankings.values());
      return list as T;
    }
    return null;
  }

  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch (e) {
    console.error(`KV GET error for key ${key}:`, e);
    return null;
  }
};

export const kvSet = async (key: string, value: any): Promise<void> => {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  if (!url || !token) {
    if (key.startsWith('user:')) {
      const wallet = key.substring(5);
      memoryUsers.set(wallet, value);
    }
    if (key.startsWith('price:')) {
      const mint = key.substring(6);
      memoryPrices.set(mint, value);
    }
    if (key === 'rankings') {
      memoryRankings.clear();
      (value as Ranking[]).forEach(r => memoryRankings.set(r.wallet, r));
    }
    return;
  }

  try {
    await fetch(`${url}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(value)
    });
  } catch (e) {
    console.error(`KV SET error for key ${key}:`, e);
  }
};

export const updateWalletRanking = async (wallet: string, totalPower: number, totalNfts: number) => {
  try {
    let rankings = await kvGet<Ranking[]>('rankings') || [];
    if (rankings.length === 0) {
      rankings = [...defaultRankings];
    }
    
    const index = rankings.findIndex(r => r.wallet === wallet);
    const newRankItem: Ranking = {
      wallet,
      totalPower,
      totalNfts,
      powerShare: 0,
      totalInvestment: 0,
      trdBurned: 0,
      nftBurned: 0
    };

    if (index !== -1) {
      rankings[index] = {
        ...rankings[index],
        totalPower,
        totalNfts
      };
    } else {
      rankings.push(newRankItem);
    }

    const sumPower = rankings.reduce((acc, r) => acc + r.totalPower, 0);
    rankings = rankings.map(r => ({
      ...r,
      powerShare: sumPower > 0 ? parseFloat((r.totalPower / sumPower).toFixed(4)) : 0
    }));

    rankings.sort((a, b) => b.totalPower - a.totalPower);
    await kvSet('rankings', rankings);
  } catch (e) {
    console.error("Error updating wallet ranking:", e);
  }
};

export const getSvgImage = (number: number, rarity: string): string => {
  const colors: Record<string, { from: string; to: string; text: string; border: string }> = {
    'Mythic': { from: '#2a0845', to: '#6441a5', text: '#ecf0f1', border: '#8e44ad' },
    'Legendary': { from: '#f12711', to: '#f5af19', text: '#ffffff', border: '#e67e22' },
    'Epic': { from: '#8e2de2', to: '#4a00e0', text: '#ffffff', border: '#9b59b6' },
    'Rare': { from: '#00c6ff', to: '#0072ff', text: '#ffffff', border: '#3498db' },
    'Uncommon': { from: '#11998e', to: '#38ef7d', text: '#ffffff', border: '#2ecc71' },
    'Common': { from: '#bdc3c7', to: '#2c3e50', text: '#ffffff', border: '#95a5a6' }
  };
  const theme = colors[rarity] || colors['Common'];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="grad-${number}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${theme.to};stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="380" height="380" x="10" y="10" rx="30" fill="url(#grad-${number})" stroke="${theme.border}" stroke-width="6" />
      <circle cx="200" cy="200" r="130" fill="none" stroke="white" stroke-opacity="0.05" stroke-dasharray="10 5" stroke-width="4" />
      <g transform="translate(140, 100) scale(0.6)" filter="url(#glow)">
        <path d="M 30 0 C 30 120 170 120 170 0" fill="none" stroke="white" stroke-width="12" stroke-linecap="round" />
        <path d="M 100 -30 L 100 250" fill="none" stroke="white" stroke-width="12" stroke-linecap="round" />
        <path d="M 15 -10 L 30 -30 L 45 -10 Z" fill="white" />
        <path d="M 155 -10 L 170 -30 L 185 -10 Z" fill="white" />
        <path d="M 85 -40 L 100 -65 L 115 -40 Z" fill="white" />
        <rect x="75" y="150" width="50" height="15" rx="5" fill="white" />
      </g>
      <text x="200" y="310" text-anchor="middle" fill="${theme.text}" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">POSEIDON #${number}</text>
      <g transform="translate(120, 328)">
        <rect x="0" y="0" width="160" height="30" rx="15" fill="black" fill-opacity="0.4" stroke="${theme.border}" stroke-width="1.5" />
        <text x="80" y="20" text-anchor="middle" fill="${theme.border}" font-family="system-ui, sans-serif" font-size="14" font-weight="800">${rarity.toUpperCase()}</text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Main function to get real NFT stats mapping both Helius data and message (1).txt database
export const getNftStats = async (mint: string, fallbackNumber: number, fallbackImage?: string, isBurntOnChain: boolean = false) => {
  const backupInfo = backupNftMap.get(mint);
  const dbInfo = dbNftMap.get(mint);
  const isBurned = !dbInfo || isBurntOnChain;
  
  // Rarity badge check
  const badge = dbInfo ? dbInfo.boost : badgeSet.has(mint);
  
  // Prioritize real database number over hashed fallback numbers
  const nftNumberForImage = (dbInfo && dbInfo.number > 0) ? dbInfo.number : (fallbackNumber > 0 ? fallbackNumber : 1);
  const image = `https://prod-image-cdn.tensor.trade/images/slug=8ccb22e9-71e1-49dc-8437-b9d2791c6359/400x400/freeze=false/https%3A%2F%2Fshdw-drive.genesysgo.net%2FDRRe9dZkP199W6GLrySn2xj2ayfr8gin8iaBt1YVMN9M%2F${nftNumberForImage}.png`;

  const price = await kvGet<number>(`price:${mint}`) || 0;

  if (backupInfo) {
    const totalPower = backupInfo.power;
    const burnedPower = backupInfo.burnedPower;
    
    // Reverse engineer original power
    const originalPower = badge ? Math.round((totalPower / 3) - burnedPower) : Math.round(totalPower - burnedPower);
    
    // Find matching rarity in power.json using originalPower
    const matchedPowerInfo = (powerData as NftPowerInfo[]).find(p => p.power === originalPower);
    const rarity = matchedPowerInfo ? matchedPowerInfo.rarity : 'Common';
    const rarityNumber = matchedPowerInfo ? matchedPowerInfo.number : fallbackNumber;

    return {
      id: mint,
      mintAddress: mint,
      mint,
      name: `Poseidon #${nftNumberForImage}`,
      image,
      number: String(rarityNumber),
      badge,
      power: badge ? Math.round(totalPower / 3) : totalPower,
      rarity,
      totalPower,
      powerBadge: badge ? totalPower : 0,
      trdBurned: backupInfo.trdBurned,
      nftBurned: backupInfo.nftBurned,
      burnedPower,
      rewardsClaimed: dbInfo ? dbInfo.rewardsClaimed : 0,
      rewardsAvailable: dbInfo ? dbInfo.rewardsAvailable : 0,
      forSale: price > 0,
      buyPrice: price,
      priceFormatted: price > 0 ? `${price} SOL` : '0',
      pricePower: price > 0 ? parseFloat((price / totalPower).toFixed(8)) : 0,
      burned: isBurned,
      poseidonBurned: backupInfo.nftBurned,
      stakingAddress: dbInfo ? dbInfo.address : null
    };
  }

  if (dbInfo) {
    const basePower = dbInfo.power;
    const totalPower = badge ? basePower * 3 : basePower;
    const nftInfo = powerMap.get(dbInfo.number);
    const originalPower = nftInfo ? nftInfo.power : 100;
    const rarity = nftInfo ? nftInfo.rarity : 'Common';
    const burnedPower = Math.max(0, basePower - originalPower);

    return {
      id: mint,
      mintAddress: mint,
      mint,
      name: `Poseidon #${nftNumberForImage}`,
      image,
      number: String(dbInfo.number),
      badge,
      power: basePower,
      rarity,
      totalPower,
      powerBadge: badge ? totalPower : 0,
      trdBurned: dbInfo.trdBurned,
      nftBurned: dbInfo.poseidonBurned,
      burnedPower,
      rewardsClaimed: dbInfo.rewardsClaimed,
      rewardsAvailable: dbInfo.rewardsAvailable,
      forSale: price > 0,
      buyPrice: price,
      priceFormatted: price > 0 ? `${price} SOL` : '0',
      pricePower: price > 0 ? parseFloat((price / totalPower).toFixed(8)) : 0,
      burned: isBurned,
      poseidonBurned: dbInfo.poseidonBurned,
      stakingAddress: dbInfo.address
    };
  }

  // Fallback for new or mocked blockchain NFTs
  const nftInfo = powerMap.get(fallbackNumber);
  const originalPower = nftInfo ? nftInfo.power : 100;
  const rarity = nftInfo ? nftInfo.rarity : 'Common';
  const totalPower = badge ? originalPower * 3 : originalPower;

  return {
    id: mint,
    mintAddress: mint,
    mint,
    name: `Poseidon #${nftNumberForImage}`,
    image,
    number: String(fallbackNumber),
    badge,
    power: originalPower,
    rarity,
    totalPower,
    powerBadge: badge ? totalPower : 0,
    trdBurned: 0,
    nftBurned: 0,
    burnedPower: 0,
    rewardsClaimed: 0,
    rewardsAvailable: 0,
    forSale: false,
    buyPrice: 0,
    priceFormatted: '0',
    pricePower: 0,
    burned: isBurned,
    poseidonBurned: 0,
    stakingAddress: null
  };
};

export const getNftByNumber = async (number: number) => {
  const backupInfo = backupData.find(item => 
    item.image.includes(`/${number}.png`) || 
    item.image.includes(`%2F${number}.png`)
  );
  
  const dbInfo = dbData.find(d => d.number === number);
  const mint = backupInfo ? backupInfo.mint : (dbInfo ? dbInfo.nftMint : `MockMintPoseidon${number}xXxXXxXxxXxX${number * 7}`);
  
  return getNftStats(mint, number);
};

// Deterministic NFT Mock Generator for Local Dev
export function generateMockNftsForWallet(wallet: string): any[] {
  let hash = 0;
  for (let i = 0; i < wallet.length; i++) {
    hash = wallet.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const nfts = [];
  for (let j = 0; j < 3; j++) {
    const num = Math.abs((hash + j * 347) % 1273) + 1;
    const dbInfo = dbData.find(d => d.number === num);
    const backupInfo = backupData.find(item => 
      item.image.includes(`/${num}.png`) || 
      item.image.includes(`%2F${num}.png`)
    );
    
    const mint = backupInfo ? backupInfo.mint : (dbInfo ? dbInfo.nftMint : `MockMintPoseidon${num}xXxXXxXxxXxX${num * 7}`);
    
    const badge = dbInfo ? dbInfo.boost : (badgeSet.has(mint) || (num % 8 === 0));
    const image = `https://prod-image-cdn.tensor.trade/images/slug=8ccb22e9-71e1-49dc-8437-b9d2791c6359/400x400/freeze=false/https%3A%2F%2Fshdw-drive.genesysgo.net%2FDRRe9dZkP199W6GLrySn2xj2ayfr8gin8iaBt1YVMN9M%2F${num}.png`;
    
    if (backupInfo) {
      const totalPower = backupInfo.power;
      const burnedPower = backupInfo.burnedPower;
      const originalPower = badge ? Math.round((totalPower / 3) - burnedPower) : Math.round(totalPower - burnedPower);
      
      const matchedPowerInfo = (powerData as NftPowerInfo[]).find(p => p.power === originalPower);
      const rarity = matchedPowerInfo ? matchedPowerInfo.rarity : 'Common';
      const rarityNumber = matchedPowerInfo ? matchedPowerInfo.number : num;

      nfts.push({
        id: mint,
        mintAddress: mint,
        mint,
        name: `Poseidon #${num}`,
        image,
        number: String(rarityNumber),
        badge,
        power: badge ? Math.round(totalPower / 3) : totalPower,
        rarity,
        totalPower,
        powerBadge: badge ? totalPower : 0,
        trdBurned: backupInfo.trdBurned,
        nftBurned: backupInfo.nftBurned,
        burnedPower,
        rewardsClaimed: dbInfo ? dbInfo.rewardsClaimed : 0,
        rewardsAvailable: dbInfo ? dbInfo.rewardsAvailable : 0,
        forSale: false,
        buyPrice: 0,
        priceFormatted: '0',
        pricePower: 0,
        burned: false,
        poseidonBurned: backupInfo.nftBurned,
        wallet
      });
    } else if (dbInfo) {
      const basePower = dbInfo.power;
      const totalPower = badge ? basePower * 3 : basePower;
      const nftInfo = powerMap.get(dbInfo.number);
      const originalPower = nftInfo ? nftInfo.power : 100;
      const rarity = nftInfo ? nftInfo.rarity : 'Common';
      const burnedPower = Math.max(0, basePower - originalPower);
      nfts.push({
        id: mint,
        mintAddress: mint,
        mint,
        name: `Poseidon #${num}`,
        image,
        number: String(dbInfo.number),
        badge,
        power: basePower,
        rarity,
        totalPower,
        powerBadge: badge ? totalPower : 0,
        trdBurned: dbInfo.trdBurned,
        nftBurned: dbInfo.poseidonBurned,
        burnedPower,
        rewardsClaimed: dbInfo.rewardsClaimed,
        rewardsAvailable: dbInfo.rewardsAvailable,
        forSale: false,
        buyPrice: 0,
        priceFormatted: '0',
        pricePower: 0,
        burned: false,
        poseidonBurned: dbInfo.poseidonBurned,
        wallet
      });
    } else {
      const nftInfo = powerMap.get(num);
      const originalPower = nftInfo ? nftInfo.power : 100;
      const rarity = nftInfo ? nftInfo.rarity : 'Common';
      const totalPower = badge ? originalPower * 3 : originalPower;
      nfts.push({
        id: mint,
        mintAddress: mint,
        mint,
        name: `Poseidon #${num}`,
        image,
        number: String(num),
        badge,
        power: originalPower,
        rarity,
        totalPower,
        powerBadge: badge ? totalPower : 0,
        trdBurned: 0,
        nftBurned: 0,
        burnedPower: 0,
        rewardsClaimed: 0,
        rewardsAvailable: 0,
        forSale: false,
        buyPrice: 0,
        priceFormatted: '0',
        pricePower: 0,
        burned: false,
        poseidonBurned: 0,
        wallet
      });
    }
  }
  return nfts;
}

export const getRealRankings = async (): Promise<Ranking[]> => {
  const walletGroups = new Map<string, {
    totalPower: number;
    totalNfts: number;
    trdBurned: number;
    nftBurned: number;
  }>();

  dbData.forEach(item => {
    const address = item.address;
    if (!address) return;

    const backupInfo = backupNftMap.get(item.nftMint);
    const badge = item.boost;
    
    // Calculate total power
    let totalPower = 0;
    let trdBurned = item.trdBurned;
    let nftBurned = item.poseidonBurned;
    
    if (backupInfo) {
      totalPower = backupInfo.power;
      trdBurned = backupInfo.trdBurned;
      nftBurned = backupInfo.nftBurned;
    } else {
      const basePower = item.power;
      totalPower = badge ? basePower * 3 : basePower;
    }

    const current = walletGroups.get(address) || { totalPower: 0, totalNfts: 0, trdBurned: 0, nftBurned: 0 };
    walletGroups.set(address, {
      totalPower: current.totalPower + totalPower,
      totalNfts: current.totalNfts + 1,
      trdBurned: current.trdBurned + trdBurned,
      nftBurned: current.nftBurned + nftBurned
    });
  });

  const sumTotalPower = Array.from(walletGroups.values()).reduce((sum, w) => sum + w.totalPower, 0);

  const rankings: Ranking[] = Array.from(walletGroups.entries()).map(([wallet, stats]) => {
    return {
      wallet,
      totalPower: stats.totalPower,
      totalNfts: stats.totalNfts,
      powerShare: sumTotalPower > 0 ? parseFloat((stats.totalPower / sumTotalPower).toFixed(6)) : 0,
      totalInvestment: 0,
      trdBurned: stats.trdBurned,
      nftBurned: stats.nftBurned
    };
  });

  rankings.sort((a, b) => b.totalPower - a.totalPower);
  
  return rankings;
};

export { powerMap, badgeSet, dbData, dbNftMap, backupData, backupNftMap };
