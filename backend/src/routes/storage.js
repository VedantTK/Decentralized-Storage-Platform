// backend/src/routes/storage.js
import express from 'express';
import { upload } from '../middleware/upload.js';
import { addFileToIPFS } from '../services/ipfs.js';
import { pinToNFTStorage } from '../services/nftStorage.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    console.log(`Uploading: ${originalname} (${mimetype})`);

    // 1. Always upload to your local IPFS node → 100% reliable
    const ipfsCid = await addFileToIPFS(buffer, originalname);

    // 2. Try NFT.Storage → if fails, we don't care
    const nftCid = await pinToNFTStorage(buffer, originalname, mimetype);

    // Use NFT.Storage CID if available, otherwise fall back to local IPFS CID
    const finalCid = nftCid || ipfsCid;

    res.json({
      success: true,
      cid: finalCid,
      ipfsCid,
      nftStorage: !!nftCid,
      filename: originalname,
      size: buffer.length,
      mimetype,
      gateways: [
        `https://ipfs.io/ipfs/${finalCid}`,
        `https://cloudflare-ipfs.com/ipfs/${finalCid}`,
        `https://${finalCid}.ipfs.dweb.link`,
        nftCid ? `https://nftstorage.link/ipfs/${finalCid}` : null
      ].filter(Boolean)
    });
  } catch (error) {
    console.error('Unexpected upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ... your other routes (retrieve, status) stay the same ...

export default router;
