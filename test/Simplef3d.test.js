const assert = require ('assert');
const ganache = require ('ganache-cli');
const Web3 = require ('web3');

const web3 = new Web3(ganache.provider());
const {interface, bytecode } = require ('../compile');

let accounts;
let simplef3d;

beforeEach ( async () => {
	//load accounts
	accounts = await web3.eth.getAccounts();

	//deploy
	simplef3d = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode})
		.send({from: accounts[0], gas: '1000000'});

});

describe('Simplef3d', () => {
	//check if deploy successfully
	it ('deployment', () => {
		assert.ok(simplef3d.options.address);
	});

	it ('buy function', async () => {
		await simplef3d.methods.buy().send({
			from: accounts[0],
			value: web3.utils.toWei('.1', 'ether')
		});

		const key_holder = await simplef3d.methods.getKeyHolder().call({
			from: accounts[0]
		})

		//check if key holder is the one who just bought key
		assert.equal(accounts[0], key_holder);
	});

	//check if one can duplicate buy (which shouldn't)
	it ('duplicate buy', async () => {
		await simplef3d.methods.buy().send({
			from: accounts[0],
			value: web3.utils.toWei('.1', 'ether')
		});

		try{
			await simplef3d.methods.buy().send({
				from: accounts[0],
				value: web3.utils.toWei('.1', 'ether')
			});
			assert(false);
		}catch (err) {
			assert(err);
		}
	});

	//check if one can buy with insufficient funds
	it ('insufficient fund', async () => {
		try {
			await simplef3d.methods.buy().send({
				from: accounts[0],
				value: web3.utils.toWei('.01', 'ether')
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	//check if one can end the round before the timer reachs end
	it ('distribute before round end', async () => {
		await simplef3d.methods.buy().send({
			from: accounts[0],
			value: web3.utils.toWei('.1', 'ether')
		});

		try {
			await simplef3d.methods.endOfRound().call({
				from: accounts[0]
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});
});