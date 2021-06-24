import React, { Component } from 'react';
import Web3 from 'web3';
import Contract from 'web3-eth-contract'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false};
    this.web3 = new Web3(window.web3.currentProvider);

    this.handleDonateClick = this.handleDonateClick.bind(this);
    this.handleDonationSizeChange = this.handleDonationSizeChange(this)

  }
  componentWillMount() {
    if(this.web3) {
      console.log('yay in ')
      window.ethereum.enable();
      console.log('provider: ', window.web3.currentProvider.enable());
      this.setState({isConnected: true});
    }
  }

  handleDonationSizeChange(text) {
    console.log(text)
  }

  handleDonateClick() {
    // this.web3 = new Web3(window.web3.currentProvider);
    const contractAddress = '0x87D45fD0FCD430bf1c0a2d6a596C83B74df814A4'

    const abi = [
      {
        "constant": false,
        "inputs": [],
        "name": "pledge",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "claimFunds",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getRefund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "numberOfDays",
            "type": "uint256"
          },
          {
            "name": "_goal",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      }
    ]

    let myContract = new this.web3.eth.Contract(abi, this.state.contractAddress);

    // const amount = 1000000000000000000
    // const amount2 = 10000

    console.log('contract address: ', this.state.contractAddress)
    console.log('donation size: ', this.state.donationSize)
    this.web3.eth.getAccounts().then((accounts) => {
      console.log('accounts: ', accounts[0])
      myContract.methods.pledge().send({
        from: accounts[0],
        value: this.state.donationSize
      }).then((contributeRes) => {
        console.log('aaa')
        console.log('res', contributeRes)
      });
    })

  // console.log("response: ", response);


    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }


  render() {
    return (
      <div>
        <h2>Is connected?:</h2><br/>
        {this.state.isConnected?'Connewcted to local n3ode':'Not Connected'}
        <br/><br/>

        <h2>Donate Money:</h2><br/>


        Donation size
        <input  onChange={(e) => {
          this.state.donationSize = Number(e.target.value)
          console.log('donation size: ', this.state.donationSize)
          }}/>

         <br/>
         
        Address
        <input  onChange={(e) => {
          this.state.contractAddress = e.target.value
          console.log('contract address: ', this.state.contractAddress)
          }}/>
         <br/>
         

        <button onClick={this.handleDonateClick}>
          Donate money
        </button>
      </div>
      
    );
  }
}
export default App;