#!/bin/bash
besu --data-path=./Node-2/data --genesis-file=./genesis.json --bootnodes=enode://5f2fefe672764af2372dc8dede6ba98c35aac6386a26e11f1e0dce90f478fdadf508dc2af80738b51f07991079e56484f9fce2421bf89faeaa6a8fd1e6dd4ab9@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,QBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546