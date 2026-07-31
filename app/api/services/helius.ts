const getHeliusKeys = (customKey?: string) => {
    const keys = [
        customKey,
        process.env.HELIUS_API_KEY,
        "4803b13b-13a1-4b1d-a845-d74d77c4368b",
        "b43e21d0-3dc1-4f47-92da-6557f7b215ed",
        "a3496de1-5fb1-42bc-9004-fe1fae336752",
        "f7dd9a38-451b-4fdf-82a8-f12fce11a103"
    ].filter((k): k is string => !!k && k.trim() !== "");
    
    return Array.from(new Set(keys));
};

let currentKeyIndex = 0;
const getNextApiKey = (customKey?: string): string | undefined => {
    const keys = getHeliusKeys(customKey);
    if (keys.length === 0) return undefined;
    const key = keys[currentKeyIndex % keys.length];
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    return key;
};

const callHeliusRPC = async (customKey: string | undefined, method: string, params: any, retries = 5): Promise<any> => {
    let lastError: any = null;
    const keys = getHeliusKeys(customKey);
    
    for (let attempt = 0; attempt < Math.min(retries, keys.length); attempt++) {
        const apiKey = getNextApiKey(customKey);
        if (!apiKey) {
            throw new Error("No Helius API key configured");
        }
        
        try {
            const baseUrl = "https://mainnet.helius-rpc.com";
            const response = await fetch(`${baseUrl}/?api-key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: `helius-req-${Date.now()}-${Math.random()}`,
                    method,
                    params
                }),
            });

            const data = await response.json();
            
            if (data.error) {
                if (data.error.code === 429 || data.error.message?.includes("limit") || data.error.message?.includes("Limit")) {
                    console.warn(`Helius key ${apiKey.slice(0, 6)}... rate limited. Retrying with next key...`);
                    lastError = data.error;
                    continue;
                }
                return data;
            }

            return data;
        } catch (error: any) {
            console.error(`Fetch error with Helius key ${apiKey.slice(0, 6)}...:`, error.message || error);
            lastError = error;
            continue;
        }
    }
    
    return { error: lastError || { message: "All Helius keys failed or rate-limited" } };
};

export const getNftsByWalletAddress = async (apiKey: string | undefined, ownerAddress: string, limit = 100) => {
    try {
        const data = await callHeliusRPC(apiKey, "searchAssets", {
            ownerAddress,
            grouping: ["collection", "69CLccefLRmvDSAJP7Er632dvn878qkpdcnvq5ZUspSm"],
            page: 1,
            limit                   
        });

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.result;
    } catch (error: any) {
        console.error("Error fetching NFTs from Helius:", error.message || error);
        throw error;
    }
};

export const checkAssetBurnt = async (apiKey: string | undefined, mint: string): Promise<boolean> => {
    try {
        const data = await callHeliusRPC(apiKey, "getAsset", { id: mint });
        
        if (data.error) {
            console.error(`Helius getAsset error for mint ${mint}:`, data.error);
            return false;
        }

        const result = data.result;
        if (!result) {
            return true;
        }

        return result.burnt === true;
    } catch (error) {
        console.error(`Error checking if mint ${mint} is burnt:`, error);
        return false;
    }
};
