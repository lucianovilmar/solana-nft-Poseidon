# Project Memory: Poseidon NFT Staking & Dashboard

This document serves as the persistent system memory for Google Antigravity (Gemini). It outlines the architecture, data configurations, business rules, and optimizations implemented to run the system serverless without relying on Antonio's old backend.

---

## 1. Project Goal & Overview
*   **Target:** Migrate the Poseidon NFT dashboard to run completely serverless on Next.js / Vercel, replacing Antonio's original external Node.js backend.
*   **Original Code Backup:** In case Antonio returns and you wish to roll back to the old setup, the complete original backend code is backed up in the workspace's Git history and archived in:
    `C:\Users\LVS 06 Dev\.gemini\antigravity\brain\08fcffe6-3d6f-4842-bb39-edd38b08b001\scratch\backend_code/`

---

## 2. Core Architecture & Local Databases
The backend is completely serverless. It uses two static snapshots loaded into memory on build/runtime:
1.  **Staking Database (`message (1).txt`):** Loaded from `public/assets/message (1).txt`. Contains registration history and staking metadata for 999 Poseidon NFTs (claims, current power, trdBurned, number, boost).
2.  **Backup/Boost Metadata (`response_1771685438848.json`):** Loaded from `public/assets/response_1771685438848.json`. Contains custom power boosters for 161 NFTs.

---

## 3. Burn Status & High-Performance Helius Batch Queries
*   **NFT Burn Rule:** An NFT is considered "active" (vivo) only if it exists in the staking database (`dbInfo`) **AND** is physically in the user's wallet on-chain. If it's not in the database (`!dbInfo`) or not in the user's wallet, it is flagged as `burned: true`.
*   **Batch Query Optimization:** 
    Instead of making dozens of slow, sequential Helius RPC calls (`checkAssetBurnt`) for every single database NFT associated with a wallet, the API executes **one single call** per wallet (`getNftsByWalletAddress`) to retrieve all active assets on-chain.
    We convert this active list into a Set (`activeMints`) and match the database NFTs against it in milliseconds. This eliminated page loading delays and RPC rate-limiting errors.

---

## 4. User Profiles & Database Persistence (Redis / Vercel KV)
*   **Profile Save Logic:** Multi-wallet profile saving is implemented. Users can link multiple wallets (e.g. primary wallet, old wallet) into a single profile.
*   **Storage Fallbacks:**
    1.  **Vercel KV REST API:** Used in production (Vercel) via `KV_REST_API_URL` and `KV_REST_API_TOKEN` env variables.
    2.  **Redis Cloud (TCP Client):** Standard TCP fallback using the `REDIS_URL` environment variable.
    3.  **Local Memory Cache (`memoryUsers`):** Fallback used for local development when credentials are not loaded in the shell.

---

## 5. Paywall, License Purchase & VIP Exemptions
*   **Magic Eden Live Feed License:** The live Magic Eden feed is behind a license paywall.
*   **New Plan Prices:**
    *   *Daily Plan (1 Day):* `0.05 SOL`
    *   *Monthly Plan (30 Days):* `0.10 SOL`
    *   Payment is verified on-chain via transaction signature checking against the receiver address (`bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89`).
*   **VIP / Exempt Wallets:** The following wallets are hardcoded to bypass the license paywall (automatic VIP access):
    *   `6q4oj5hhZuXVtct9YaxLAwxL9ufTU5ewQSBbj7BwRuba` (Primary Personal Wallet)
    *   `bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89` (Site Receiver Wallet)
    *   `6KHDRAkDuHdB1VdYqGhUDnsmy9ZwVL5FZmn82tzuS5g` (Cousin's Wallet)

---

## 6. Dashboard Calculations & UI Details
*   **Ranking Power Aggregation:** Staking power of all wallets registered under the same profile is consolidated into a single profile bar in the ranking chart, keeping user identities anonymous.
*   **Collection Efficiency Card:** Formatted to display as a percentage (e.g., `3.92%`) rather than a raw fraction (like `0.04`), calculated as the user's total power divided by the general database power (`326,299,662 SOL`).
*   **Avatar UI:** When a profile is loaded, the circle icon on the top-right header dynamically loads the user's custom profile avatar (or the Poseidon sketch image by default).
