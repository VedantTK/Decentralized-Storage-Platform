// backend/src/services/nftStorage.js
import { NFTStorage, File } from 'nft.storage';

let client = null;
const API_KEY = process.env.NFT_STORAGE_API_KEY?.trim();

// Only initialize if we have a real-looking key
if (API_KEY && API_KEY.length > 50 && API_KEY.startsWith('ey')) {
  try {
    client = new NFTStorage({ token: API_KEY });
    console.log('NFT.Storage client initialized (pinning enabled)');
  } catch (err) {
    console.log('Invalid NFT.Storage key → pinning disabled');
    client = null;
  }
} else {
  console.log('No valid NFT.Storage key → pinning skipped (this is OK)');
}

// This function will NEVER throw
export async function pinToNFTStorage(fileBuffer, filename, mimetype) {
  if (!client) {
    console.log('Skipping NFT.Storage (no valid key)');
    return null; // caller will fall back to local IPFS CID
  }

  try {
    const file = new File([fileBuffer], filename, { type: mimetype || 'application/octet-stream' });
    const cid = await client.storeBlob(file);
    console.log(`File pinned to NFT.Storage: ${cid}`);
    return cid;
  } catch (error) {
    console.warn('NFT.Storage failed (continuing with local IPFS only):', error.message);
    return null; // don't crash the whole upload
  }
}

export async function checkNFTStorageStatus(cid) {
  if (!client) return null;
  try {
    return await client.check(cid);
  } catch {
    return null;
  }
}
