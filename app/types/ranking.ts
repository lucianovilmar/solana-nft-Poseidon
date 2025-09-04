export interface Ranking {
  wallet: string;
  totalPower: number;
  totalNfts: number;
  powerShare: number;
  totalInvestment: number;  
  trdBurned: number;   
  nftBurned: number;
  totalRewards?: number;
}


export interface RankingBurned {
  date: string;
  trdBburned: number;
  nftBurned: number;
  totalPower: number;
}