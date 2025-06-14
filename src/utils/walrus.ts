import axios from 'axios';
import { InternalServerError } from './AppError';

const sendToWalrus = async (payload: string | Buffer | Buffer<ArrayBufferLike>) => {
  try {
    const uploadToWalrus = await axios.put(
      'https://wal-publisher-testnet.staketab.org/v1/blobs',
      {
        message: payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return uploadToWalrus.data;
  } catch (error) {
    throw new InternalServerError('Failed to send to Walrus', {
      error,
    });
  }
};

const getFromWalrus = async (blobId: string) => {
  try {
    const fetchFromWalrus = await axios.get(
      `https://wal-aggregator-testnet.staketab.org/v1/blobs/${blobId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return fetchFromWalrus.data;
  } catch (error) {
    throw new InternalServerError('Failed to get from Walrus', {
      error,
    });
  }
};

export { sendToWalrus, getFromWalrus };
