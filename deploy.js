const wallet_provider = require ('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//host account and rinkeby address
const provider = new wallet_provider (
	'puzzle bone remain sorry endless gorilla board urge until summer morning almost',
	'https://rinkeby.infura.io/v3/908add77ea8648aba72f390d126b0c98'
);

const web3 = new Web3(provider);

//deploy with the host account
const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode})
		.send({ gas: 1000000, from: accounts[0]});

	//retrieve the address it deployed to
	console.log('deployed from ', accounts[0], ' to address ', result.options.address);

};

deploy();