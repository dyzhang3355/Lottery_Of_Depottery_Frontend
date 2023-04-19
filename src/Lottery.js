import React, {useEffect, useState } from "react";
//import { useEffect, useState } from "react";
import {
	UBCTokenContract,
	connectWallet,
	loadTicketPrice,
  loadPoolBalance,
  loadPrizePercentage,
  loadExpectedPrize,
  loadWinningNumbers,
  loadGameRound,
  loadGameStatus,
  loadPlayerNumbers,
  sendTicketPrice,
  sendPrizePercentage,
  sendEnGame,
  sendPauseGame,
  sendCancelGame,
  sendBuyTicket,
  sendCancelTicket,
  sendDraw,
} from "./util/interact.js";

import "./Lottery.css";

function AccountPage({playerNumbers, playerRound}) {
  console.log("AccountPage: playerNumbers:" + playerNumbers + ", player Round: " + playerRound);
  const stringNumbers = playerNumbers.toString();
  return (
    <div className="page">
      <h2>Account</h2>
      <p>Player Round: {playerRound}</p>
      <p>Player Numbers: {stringNumbers}</p>
    </div>
  );
}

function GameDataPage({gameRound, ticketPrice, poolBalance, prizePercentage, expectedPrize, winningNumbers, gameStatus}) {
  return (
    <div className="page">
      <h2>Game Round</h2>
      <p>{gameRound}</p>
      <h2>Ticket Price</h2>
      <p>{ticketPrice}</p>
      <h2>Pool Balance</h2>
      <p>{poolBalance}</p>
      <h2>Prize Percentage</h2>
      <p>{prizePercentage}%</p>
      <h2>Expected Prize</h2>
      <p>{expectedPrize}</p>
      <h2>Game Status</h2>
      <p>{gameStatus}</p>
      <h2>Last Winning Numbers</h2>
      <p>{winningNumbers}</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page">
      <h2>Settings</h2>
      <p>TODO</p>
    </div>
  );
}

function LotteryDApp() {
  const [balance, setBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState("Account");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  // from tokenTransfer.js
  const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");
	const [percentStatus, setPercentStatus] = useState("");

	const [gameRound, setgameGameRound] = useState("");
	const [ticketPrice, setTicketPrice] = useState("");
  const [poolBalance, setPoolBalance] = useState("");
  const [prizePercentage, setPrizePercentage] = useState("");
	const [expectedPrize, setExpectedPrize] = useState("");
	const [gameStatus, setGameStatus] = useState("");
	const [nums2Buy, setNumbers2Buy] = useState("");
  const [winningNumbers, setWinningNumbers] = useState("");

  const [playerRound, setPlayerRound] = useState("");
  const [playerNumbers, setPlayerNumbers] = useState("");

  async function fetchGameData() {
    const tempGameRound = await loadGameRound();
    setgameGameRound(tempGameRound);

    const tempTicketPrice = await loadTicketPrice();
    setTicketPrice(tempTicketPrice);

    const tempPoolBalance = await loadPoolBalance();
    setPoolBalance(tempPoolBalance);

    const tempPrizePercentage = await loadPrizePercentage();
    setPrizePercentage(tempPrizePercentage);

    const tempExpectedPrize = await loadExpectedPrize();
    setExpectedPrize(tempExpectedPrize);

    const tempWinningNumbers = await loadWinningNumbers();
    setWinningNumbers(tempWinningNumbers);

    const tempGameStatus = await loadGameStatus();
    setGameStatus(tempGameStatus);
  }

  async function fetchPlayerData(walletAddress) {
    const {round, numbers} = await loadPlayerNumbers(walletAddress);
    console.log("fetchPlayerData: round: " + round + ", numbers: " + numbers);
    setPlayerRound(round);
    setPlayerNumbers(numbers);
  }
  const handleMenuClick = async (page) => {
    setCurrentPage(page);
  };
  const handlePlayerDataClick = async (page, walletAddress) => {
    await fetchPlayerData(walletAddress);
    setCurrentPage(page);
  };

  const handleTicketPriceClick = async (page) => {
    console.log("Now in handleTicketPriceClick().");
    await fetchGameData();
    console.log("ticket price printed in function handleTicketPriceClick: " + ticketPrice);
    setCurrentPage(page);
  };

  const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

  let pageContent;
  switch (currentPage) {
    case "Account":
      pageContent = <AccountPage playerNumbers={playerNumbers} playerRound={playerRound} />;
      break;
    case "Game Data":
      console.log("Entering 'Ticket Price' page in switch and the ticketPrice is " + ticketPrice);
      pageContent = <GameDataPage gameRound={gameRound} ticketPrice={ticketPrice} poolBalance={poolBalance} prizePercentage={prizePercentage} expectedPrize={expectedPrize} gameStatus={gameStatus} winningNumbers={winningNumbers}/>;
      break;
    case "History":
      pageContent = <HistoryPage />;
      break;
    case "Settings":
      pageContent = <SettingsPage />;
      break;
  }

  useEffect(() => {
		async function fetchNewData() {
			//if (walletAddress !== "") {
			//	//const tokenBalance = await loadTokenAccountBalance(walletAddress);
			//	const tokenBalance = await loadTicketPrice();
			//	settokenBalance(tokenBalance);
			//}
			//const tokenName = await loadTokenName();
			//setTokenName(tokenName);
			//const { address, status } = await getCurrentWalletConnected();
			//setWallet(address);
			//setStatus(status);
			//addWalletListener();
			//addSmartContractListener();
			//const newPrice = await loadTicketPrice();
			//setTicketPrice(newPrice);
      //TODO: bring back? handleTicketPriceClick("Game Data");
		}
		fetchNewData();
	//}, [ticketPrice]);
	}, [status]);

  const clickSetTicketPrice = async (newPrice) => {
    const {status} = await sendTicketPrice(walletAddress, newPrice);
    setStatus(status);
    console.log("set ticket price status: " + status);
	};

  const clickSetPrizePercenage = async (newPercentage) => {
    const {status} = await sendPrizePercentage(walletAddress, newPercentage);
    setPercentStatus(status);
    setStatus(status);
    console.log("set prize percentage status: " + percentStatus);
	};

  const clickEnGame = async () => {
    const {status} = await sendEnGame(walletAddress);
    setStatus(status);
	};

  const clickPauseGame = async () => {
    const {status} = await sendPauseGame(walletAddress);
    setStatus(status);
	};

  const clickCancelGame = async () => {
    const {status} = await sendCancelGame(walletAddress);
    setStatus(status);
	};

  const clickDraw = async () => {
    const {status} = await sendDraw(walletAddress);
    setStatus(status);
    console.log("draw status: " + status);
	};

  // price2Pay should be equal to ticketPrice.
  const clickBuyTicket = async (num2ConvertBuy, price2Pay) => {
    const convertedNums = num2ConvertBuy.split(" ").map(Number);
    console.log("user input numbers are converted to a list: " + convertedNums);
    const {status} = await sendBuyTicket(walletAddress, convertedNums, price2Pay);
    setStatus(status);
	};

  const clickCancelTicket = async () => {
    const {status} = await sendCancelTicket(walletAddress);
    setStatus(status);
	};

  function HistoryPage() {
    return (
      <div className="body">

				  <my_button id="publish" onClick={() => clickSetTicketPrice(ticketPrice)}>
				  	Set Ticket Price
				  </my_button>

				  <my_button id="publish" onClick={() => clickSetPrizePercenage(prizePercentage)}>
				  	Set Percentage
				  </my_button>

				  <my_button id="publish" onClick={() => clickEnGame()}>
				  	Enable Game
				  </my_button>

				  <my_button id="publish" onClick={() => clickPauseGame()}>
				  	Pause Game
				  </my_button>

				  <my_button id="publish" onClick={() => clickCancelGame()}>
				  	Cancel Game
				  </my_button>

				  <my_button id="publish" onClick={() => clickDraw()}>
				  	Draw Winning Numbers
				  </my_button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="menu">
        <h1>LotteryDApp</h1>

          <input
				  	type="text"
            id="prize percentage id"
				  	placeholder="new percentage:"
				  	onChange={(e) => setPrizePercentage(e.target.value)}
				  />

          <input
				  	type="ticket price text"
            id="ticket price id"
				  	placeholder="new ticket price:"
				  	onChange={(e) => setTicketPrice(e.target.value)}
				  />

        <ul>
          <li onClick={() => handleMenuClick("History")}>Admin</li>
          <li 
            onClick={() => handleTicketPriceClick("Game Data")}
          >
            Game Data
          </li>
          <li
            className={currentPage === "Account" ? "active" : null}
            onClick={() => handlePlayerDataClick("Account", walletAddress)}
          >
            Player Account
          </li>
        </ul>
        <div className="form-container">
          <label htmlFor="number-input">Enter 6 Different Numbers between 1~49</label>
          <input type="text" 
                 id="number-input"
                 placeholder="6 different numbers (between 1~49) to buy:"
                 onChange={(e) => setNumbers2Buy(e.target.value)}
          />
          <button onClick={() => clickBuyTicket(nums2Buy, ticketPrice)}>Buy Ticket</button>

          <button onClick={() => clickCancelTicket()}>Cancel Ticket</button>

			  <button id="walletButton" onClick={connectWalletPressed}>
			  	{walletAddress.length > 0 ? (
			  		"Connected: " +
			  		String(walletAddress).substring(0, 6) +
			  		"..." +
			  		String(walletAddress).substring(38)
			  	) : (
			  		<span>Connect Wallet</span>
			  	)}
			  </button>


				<p id="status">{status}</p>
        </div>
      </div>
      <div style={{ width: '80%' }}>{pageContent}</div>
    </div>
  );
}

export default LotteryDApp;
