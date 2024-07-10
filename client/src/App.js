import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingAndFunding from './contracts/VotingAndFunding.json';
import AddCandidate from './components/AddCandidate';
import CandidateList from './components/CandidateList';

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        async function load() {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);
            
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VotingAndFunding.networks[networkId];
            const instance = new web3.eth.Contract(
                VotingAndFunding.abi,
                deployedNetwork && deployedNetwork.address,
            );
            setContract(instance);
        }
        load();
    }, []);

    const addCandidate = async (name) => {
        await contract.methods.addCandidate(name, account).send({ from: account });
        loadCandidates();
    };

    const vote = async (candidateId) => {
        await contract.methods.vote(candidateId).send({ from: account });
        loadCandidates();
    };

    const fundCandidate = async (candidateId, amount) => {
        await contract.methods.fundCandidate(candidateId).send({ from: account, value: Web3.utils.toWei(amount, 'ether') });
        loadCandidates();
    };

    const loadCandidates = async () => {
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidates = [];
        for (let i = 0; i < candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            candidates.push(candidate);
        }
        setCandidates(candidates);
    };

    return (
        <div className="container">
            <h1>Voting and Funding Platform</h1>
            <p>Account: {account}</p>
            <AddCandidate addCandidate={addCandidate} />
            <CandidateList candidates={candidates} vote={vote} fundCandidate={fundCandidate} />
        </div>
    );
}

export default App;
