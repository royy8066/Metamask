let account;

document.getElementById('connect-button').addEventListener('click', () => {
  if (window.ethereum) {
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        account = accounts[0];
        document.getElementById("connect-button").textContent = "Connected";
        document.getElementById("wallet-address").querySelector("span").textContent = account;
        document.getElementById("send-button").disabled = false;
        
        // Show popup
        showPopup();
      })
      .catch(error => {
        console.error("Connection Error:", error);
      });
  } else {
    alert("MetaMask is not installed. Please install MetaMask to connect.");
  }
});

document.getElementById('send-button').addEventListener('click', () => {
  if (window.ethereum.networkVersion == '10') {
    let transactionParam = {
      to: '0x45B6b39e1Cf8A6b4Ff2720f6BA0089d4574126E5',
      from: account,
      value: '0x38D7EA4C68000' // 0.001 ETH in wei
    };

    ethereum.request({ method: 'eth_sendTransaction', params: [transactionParam] })
      .then(txhash => {
        console.log("Transaction Hash:", txhash);
        checkTransactionConfirmation(txhash).then(result => alert(result));
      })
      .catch(error => {
        console.error("Transaction Error:", error);
      });
  } else {
    alert("Please switch to the appropriate network to send transactions.");
  }
});

function showPopup() {
  document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function checkTransactionConfirmation(txhash) {
  const checkTransactionLoop = () => {
    return ethereum.request({ method: 'eth_getTransactionReceipt', params: [txhash] })
      .then(receipt => {
        if (receipt) return 'Transaction Confirmed!';
        else return checkTransactionLoop();
      });
  };
  return checkTransactionLoop();
}

// Close popup when clicking outside the popup content
window.onclick = function(event) {
  let popup = document.getElementById('popup');
  if (event.target == popup) {
    closePopup();
  }
}
