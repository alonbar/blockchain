import React, { Component } from 'react';
import Web3 from 'web3';
import Contract from 'web3-eth-contract'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false};
    this.web3 = new Web3(window.web3.currentProvider);

    this.handleDonateClick = this.handleDonateClick.bind(this);

  }
  componentWillMount() {
    if(this.web3) {
      console.log('yay in ')
      window.ethereum.enable();
      console.log('provider: ', window.web3.currentProvider.enable());
      this.setState({isConnected: true});
    }
  }

  handleDonateClick() {
    // this.web3 = new Web3(window.web3.currentProvider);
    const contractAddress = '0xdAe45773E3213ECFE73401AF4906F23d4Aa06348'

    const abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "relativeVestingTime",
            "type": "uint256"
          }
        ],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "target",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]

    let myContract = new this.web3.eth.Contract(abi, contractAddress);

    const amount = 1000000000000000000
    this.web3.eth.getAccounts().then((accounts) => {
      console.log('accounts: ', accounts[0])
      myContract.methods.contribute().send({
        from: accounts[0],
        value: amount
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

        <button onClick={this.handleDonateClick}>
          Donate money
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      </div>
      
    );
  }
}
export default App;