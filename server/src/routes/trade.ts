import express from 'express';
const router = express.Router();
const lineaTestnet = 'https://linea-goerli.infura.io/v3/7c9a9d50cc0d4012b81b97a82ba1b962';

router.get('/get-deposit-list', async (req, res, next) => {
  const postData = {
    "jsonrpc":"2.0",
    method: "eth_getLogs",
    params: [{
      "address": "0x43fe125d1b742c07bf25008122a0ba8b1a5c1e87",
      "fromBlock": "0x3BCCB3", 
      // "toBlock": "0x3C2CEB", 
      "topics": ["0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"]
    }],
    "id":1
  };

  fetch(lineaTestnet, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
    .then(response => response.json())
    .then(data => {
      const addressAndNft = data.result.map((item: any) => {
        return [item.topics[1], item.data]
      });

      // adding more addresses for demo
      addressAndNft.push([
        '0x000000000000000000000000fa99d3ab33ed6e7ceebb051de33dd24ec72839c4',
        '0x0000000000000000000000000000000000000000000000000000000000000yyy'
      ],)

      addressAndNft.push([
        '0x000000000000000000000000cc99d3ab33ed6e7ceebb051de33dd24ec728abcd',
        '0x000000000000000000000000000000000000000000000000000000000000zzzz'
      ],)

      addressAndNft.push([
        '0x000000000000000000000000789ad3ab33ed6e7ceebb051de33dd24ec728cdef',
        '0x000000000000000000000000000000000000000000000000000000000000abcd'
      ],)

      const nftTokenIdsByAddress = addressAndNft.reduce((acc: any, cur: any) => {
        const addr = '0x' + cur[0].slice(26);
        const nft = cur[1];

        if (acc[addr]) {
          acc[addr].push(nft);
        } else {
          acc[addr] = [nft]
        }

        return acc;
      }, {});

     
      return res
      .status(200)
      .json(nftTokenIdsByAddress);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

export default router;