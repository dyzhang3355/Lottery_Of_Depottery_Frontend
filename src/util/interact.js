const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const Web3 = require('web3');
//const web3 = new Web3("wss://polygon-mumbai.g.alchemy.com/v2/"+alchemyKey);
const web3 = new Web3("wss://polygon-mumbai.g.alchemy.com/v2/your_api_key");
//const contractABI = require("../UBCToken-abi.json");
const contractABI = require("../abi/MyToken.json")
//const contractAddress = "0xc30835bbb6EAA1bc90F2e12bd227fBA2B9d95635";
//const contractAddress = "0xB83798E0359EfaAfDabDBe46E2BC09Eab1d6147d";
//const contractAddress = "0xb72C6d9524C21AFdE652093AA4C46C1CBCdC7e29"
//const contractAddress = "0x69c1E8bCdc474D01FDDd5A9c333244A54fD24dF9" // correct one. TODO: bring back.
//const contractAddress = "0x4f4b3b6Ca225F5636E53C530ac7A43BEfC1795A2" // default percentage 90%.
//const contractAddress = "0x37EBA5f34Eb44CfFb6a255655b70a518a55d0cb6" // without price check.
// 0x4202B4d0A767bfd8FBD779Dd41387bC5338c7169

// final version without Pool.
//const contractAddress = "0x7738D97BB396D958919D85ec23F2addcf028f9e8" // bug fix for cancelling tickets after draw().
// final version with Pool.
const contractAddress = "0x674C355E04e4e357d9F03C0Bde71F0c19A35b5A9"


export const UBCTokenContract = new web3.eth.Contract(
	contractABI,
	contractAddress
);

export const loadTokenName = async () => {
	const tokenName = "Depottery";
	return tokenName;
};

export const loadTicketPrice = async () => {
	const tokenName = await UBCTokenContract.methods.getTicketPrice().call();
	return tokenName;
};

export const loadPoolBalance = async () => {
	const poolBalance = await UBCTokenContract.methods.getPoolBalance().call();
	return poolBalance;
};

export const loadPrizePercentage = async () => {
	const prizePrecentage = await UBCTokenContract.methods.getPrizePercentage().call();
	return prizePrecentage;
};

export const loadExpectedPrize = async () => {
	const tokenName = await UBCTokenContract.methods.getExpectedPrize().call();
	return tokenName;
};

export const loadWinningNumbers = async () => {
	const roundWinningNumbersPair = await UBCTokenContract.methods.getWinningNumber().call();
	const {0: round, 1: numbers} = roundWinningNumbersPair;
	console.log("Round: " + round + ", winningNumbers: " + numbers);
	return ("Round: " + round + "\n WinningNumbers: " + numbers);
};
export const loadGameRound = async () => {
	const gameRound = await UBCTokenContract.methods.getGameRound().call();
	return gameRound;
};
export const loadGameStatus = async () => {
	const gameStatus = await UBCTokenContract.methods.getGameStatus().call();
	return gameStatus;
};

export const loadPlayerNumbers = async (walletAddress) => {
	const roundPlayerNumbersPair = await UBCTokenContract.methods.getPlayerNumber().call({from: walletAddress});
	const {0: round, 1: numbers} = roundPlayerNumbersPair;
	console.log("Player Round: " + round + ", playerNumbers: " + numbers);
	return {round: round, numbers: numbers};
};

export const sendTicketPrice = async (fromAddress, newPrice) => {
	console.log("calling smart contract function to set new price:" + newPrice);
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.setTicketPrice(newPrice).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, the ticket price
					will be updated automatically.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendPrizePercentage = async (fromAddress, newPercentage) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		//data: UBCTokenContract.methods.transfer(toAddress, value).encodeABI(),
		data: UBCTokenContract.methods.setPrizePercentage(newPercentage).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, the prize percentage
					will be updated automatically.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendEnGame = async (fromAddress) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.enableGame().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, game will start.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendPauseGame = async (fromAddress) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.pauseGame().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, game will be paused.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendCancelGame = async (fromAddress) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.adminCancelGame().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, game will be cancelled.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendDraw = async (fromAddress) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.draw().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, winning numbers will be drawed.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendBuyTicket = async (fromAddress, nums2Buy, price2PayInWei) => {
	console.log("price to pay: " + price2PayInWei);
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		value:price2PayInWei,
		data: UBCTokenContract.methods.buyTicket(nums2Buy).encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, your order will be placed.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const sendCancelTicket = async (fromAddress) => {
	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: fromAddress, // must match user's active address.
		data: UBCTokenContract.methods.playerCancelTicket().encodeABI(),
	};

	//sign the transaction
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			status: (
				<span>
					✅{" "}
					<a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
						View the status of your transaction on Etherscan!
					</a>
					<br />
					ℹ️ Once the transaction is verified by the network, your order will be cancelled and money will be returned.
				</span>
			),
		};
	} catch (error) {
		return {
			status: "😥 " + error.message,
		};
	}

};

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				//status: "👆🏽 input the transfer to addresst in the text-field above.",
				status: "Connected.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
					address: addressArray[0],
					status: "👆🏽 input the transfer to addresst in the text-field above.",
				};
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};
