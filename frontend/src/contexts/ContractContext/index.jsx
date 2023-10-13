import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobal } from '../GlobalContext';
import { useCustomWallet } from '../WalletContext';
import { networkConfig } from '../WalletContext/config';
import { updateChainId, updateExplorerUrl, updateRpcUrl} from '../ReduxContext/reducers/network';
import * as BountyHunter from '../../../bountyhunter_module';
import * as SorobanClient from 'soroban-client';

export { BountyStatus, WorkStatus } from '../../../bountyhunter_module';


export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const { chainId } = useGlobal();
    const network = useSelector(state => state.network);
    const { walletAddress, walletObj } = useCustomWallet();
    
    const dispatch = useDispatch();

    const [reloadCounter, setReloadCounter] = useState(0);

    const CONTRACT_ID = BountyHunter.networks.futurenet.contractId;
    const DEF_PAY_TOKEN = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT';

    const contract = new SorobanClient.Contract(CONTRACT_ID);

    useEffect(() => {
        let ac = new AbortController();

        const reload = () => {
            setReloadCounter((t) => {
                return t + 1
            });
        }

        let tmr = setInterval(() => {
            if (ac.signal.aborted === false) {
                reload();
            }
        }, 50000);

        return () => {
            ac.abort();
            clearInterval(tmr);
        }
    }, []);

    useEffect(() => {
        setReloadCounter((t) => {
            return t + 1;
        });
    }, [walletAddress]);

    const refreshPages = () => {
        setTimeout(() => {
            setReloadCounter((t) => {
                return t + 1;
            });
        }, 2000);
    };

	function parseResultXdr(xdr) {
        console.log('xdr:', xdr);
        if ('resultXdr' in xdr) {
            console.log('value:', xdr.returnValue._value);
            return [xdr.returnValue._value, xdr.ledger];
        }

        return [-5, 0];
    };

    async function executeTransaction(operation, baseFee) {

        const server = new SorobanClient.Server(network.rpcUrl);

        const pubKey = await walletObj.getUserInfo();
        // console.log('pubKey:', pubKey);

        const sourceAcc = await server.getAccount(pubKey);

        const transaction0 = new SorobanClient.TransactionBuilder(sourceAcc, {
            fee: (baseFee === undefined || baseFee === '') ? SorobanClient.BASE_FEE : baseFee,
            networkPassphrase: SorobanClient.Networks.FUTURENET,
        })
            .addOperation(operation)
            .setTimeout(SorobanClient.TimeoutInfinite /* 30 */)
            .build();

        const simulated = await server.simulateTransaction(transaction0);
        // console.log('simulated:', simulated);
        if (SorobanClient.SorobanRpc.isSimulationError(simulated)) {
            console.error(simulated.error);
            return [-1, 0];
        }

        const transaction = await server.prepareTransaction(transaction0);
        const txXDR = transaction.toXDR();
        // console.log('txXDR:', txXDR);
        const {signedXDR} = await walletObj.signTransaction(txXDR, {
            network: 'FUTURENET',
            networkPassphrase: SorobanClient.Networks.FUTURENET,
            accountToSign: pubKey,
        });
        const txEnvelope = SorobanClient.xdr.TransactionEnvelope.fromXDR(signedXDR, 'base64');
        const tx = new SorobanClient.Transaction(txEnvelope, SorobanClient.Networks.FUTURENET);

        try {
            const response = await server.sendTransaction(tx);

            console.log('Sent! Transaction Hash:', response.hash);
            // Poll this until the status is not 'pending'
            if (response.status !== 'PENDING') {
                console.log('Transaction status:', response.status);
                // console.log('response:', response);
                if (response.status === 'ERROR') {
                    return [-2, 0];
                }
                return parseResultXdr(response);
            } else {
                let response2;

                do {
                    // Wait a second
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // See if the transaction is complete
                    response2 = await server.getTransaction(response.hash);
                } while (response2.status !== 'SUCCESS' && response2.status !== 'FAILED');

                console.log('Transaction2 status:', response2.status);
                // console.log('response2:', response2);
                if (response2.status === 'FAILED') {
                    return [-3, 0];
                }
                return parseResultXdr(response2);
            }
        } catch (e) {
            console.error('An error has occured:', e);
            return [-4, 0];
        }

        return [0, 0];
    };

    const approveToken = async (from, spender, payAmount) => {
        const tokenContract = new SorobanClient.Contract(DEF_PAY_TOKEN);
        const res = await executeTransaction(
            tokenContract.call('approve', 
                new SorobanClient.Address(from).toScVal(), // from
                new SorobanClient.Address(spender).toScVal(), // spender
                SorobanClient.nativeToScVal(Number(payAmount * 2), { type: 'i128' }), // double payAmount for fee
                SorobanClient.xdr.ScVal.scvU32(535680) // expiration_ledger
            ),
        );

        console.log('res:', res);
        return res[0];
    };

	// non_used - maybe used in the future
    const receiveEvent = async() => {
        let requestObject = {
            'jsonrpc': '2.0',
            'id': 8675309,
            'method': 'getEvents',
            'params': {
              'startLedger': '227000',
              'filters': [
                {
                  'type': 'contract',
                  'contractIds': [
                    CONTRACT_ID
                  ],
                  'topics': [
                    [
                      'AAAABQAAAAh0cmFuc2Zlcg==',
                      '*',
                      '*'
                    ]
                  ]
                }
              ],
              'pagination': {
                'limit': 100
              }
            }
        };

        let res = await fetch('https://soroban-futurenet.stellar.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestObject),
        });
        let json = await res.json()
        console.log(json)
    };

    const createBounty = async (creator, name, reward, payToken, deadline) => {
        const res = await executeTransaction(
            contract.call('create_bounty', 
                new SorobanClient.Address(creator).toScVal(), 
                SorobanClient.xdr.ScVal.scvString(name), 
                SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(reward)), 
                new SorobanClient.Address(payToken).toScVal(), 
                SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(deadline))
            ),
            '1000000'
        );

        // const res = await BountyHunter.invoke({
        //     method: 'create_bounty', 
        //     args: [
        //         new SorobanClient.Address(creator).toScVal(), 
        //         SorobanClient.xdr.ScVal.scvString(name), 
        //         SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(reward)), 
        //         new SorobanClient.Address(payToken).toScVal(), 
        //         SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(deadline))
        //     ],
        //     fee: 100, // fee
        //     responseType: 'full', // responseType
        //     parseResultXdr: parseResultXdr, 
        //     secondsToWait: 10, // secondsToWait
        //     rpcUrl: chainId === 169 ? 'https://rpc-mainnet.stellar.org' : 'https://rpc-futurenet.stellar.org', // rpcUrl
        //     networkPassphrase: SorobanClient.Networks.FUTURENET, 
        //     contractId: CONTRACT_ID, 
        //     wallet: walletObj
        // });

        // const contract3 = new BountyHunter.Contract({contractId: CONTRACT_ID, 
        //     networkPassphrase: BountyHunter.networks.futurenet.networkPassphrase, 
        //     rpcUrl: chainId === 169 ? 'https://rpc-mainnet.stellar.org' : 'https://rpc-futurenet.stellar.org', 
        //     wallet: walletObj
        // });
        // const res = await contract3.createBounty({
        //     creator, 
        //     name, 
        //     reward, 
        //     pay_token: payToken, 
        //     deadline
        // });

        console.log('res:', res);
            return res;
    };

    const applyBounty = async (participant, bountyId) => {
        const res = await executeTransaction(
            contract.call('apply_bounty', 
                new SorobanClient.Address(participant).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(bountyId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const submitWork = async (participant, workId) => {
        const res = await executeTransaction(
            contract.call('submit_work', 
                new SorobanClient.Address(participant).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(workId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const approveWork = async (creator, workId) => {
        const res = await executeTransaction(
            contract.call('approve_work', 
                new SorobanClient.Address(creator).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(workId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const rejectWork = async (creator, workId) => {
        const res = await executeTransaction(
            contract.call('reject_work', 
                new SorobanClient.Address(creator).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(workId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const cancelBounty = async (creator, bountyId) => {
        const res = await executeTransaction(
            contract.call('cancel_bounty', 
                new SorobanClient.Address(creator).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(bountyId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const closeBounty =  async (creator, bountyId) => {
        const res = await executeTransaction(
            contract.call('close_bounty', 
                new SorobanClient.Address(creator).toScVal(), 
                SorobanClient.xdr.ScVal.scvU32(bountyId)
            )
        );

        console.log('res:', res);
        return res[0];
    };

    const tokenBalances = async (account, token) => {
		const contract2 = new BountyHunter.Contract({contractId: CONTRACT_ID, 
            networkPassphrase: BountyHunter.networks.futurenet.networkPassphrase, 
            rpcUrl: network.rpcUrl, 
            wallet: walletObj
        });
        return await contract2.tokenBalances(account, token);
    };

    useEffect(() => {
        dispatch(updateChainId(networkConfig[chainId].chainId));
        dispatch(updateExplorerUrl(networkConfig[chainId].explorerUrl));
        dispatch(updateRpcUrl(networkConfig[chainId].rpcUrl));
    }, [dispatch, chainId]);

    return (
        <ContractContext.Provider value={{
            reloadCounter,
            refreshPages,

            CONTRACT_ID,
            DEF_PAY_TOKEN,
            
            approveToken,

            createBounty,
            applyBounty,
            cancelBounty,
            closeBounty,

            submitWork,
            approveWork,
            rejectWork,
            
            tokenBalances
        }}>
            {children}
        </ContractContext.Provider>
    );
}

export const useContract = () => {
    const contractManager = useContext(ContractContext);
    return contractManager || [{}];
}
