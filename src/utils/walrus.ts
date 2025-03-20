
const sendToWalrus = async (payload: string) => {

    const uploadToWalrus = await fetch("https://wal-publisher-testnet.staketab.org/v1/blobs", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "message": payload,
        })
    })
    
    const walrusBlob = await uploadToWalrus.json();
    console.log(walrusBlob);
    return walrusBlob;
}

const getFromWalrus = async (blobId: string) => {
    const fetchFromWalrus = await fetch(`https://wal-aggregator-testnet.staketab.org/v1/blobs/${blobId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const payload = await fetchFromWalrus.json()
    console.log(payload.message);
    return payload;
}

export {sendToWalrus, getFromWalrus};
