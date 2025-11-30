import { create } from 'ipfs-http-client';

let ipfsClient;

export function getIPFSClient() {
  if (!ipfsClient) {
    const ipfsHost = process.env.IPFS_HOST || 'ipfs';
    const ipfsPort = process.env.IPFS_PORT || '5001';
    const ipfsProtocol = process.env.IPFS_PROTOCOL || 'http';

    ipfsClient = create({
      host: ipfsHost,
      port: ipfsPort,
      protocol: ipfsProtocol
    });

    console.log(`📡 Connected to IPFS: ${ipfsProtocol}://${ipfsHost}:${ipfsPort}`);
  }
  return ipfsClient;
}

export async function addFileToIPFS(fileBuffer, filename) {
  try {
    const client = getIPFSClient();
    const result = await client.add({
      path: filename,
      content: fileBuffer
    });

    console.log(`✅ File added to IPFS: ${result.cid.toString()}`);
    return result.cid.toString();
  } catch (error) {
    console.error('❌ IPFS upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

export async function getFileFromIPFS(cid) {
  try {
    const client = getIPFSClient();
    const chunks = [];

    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error('❌ IPFS retrieval error:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
}