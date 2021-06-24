import React, { Component } from 'react';
import Web3 from 'web3';
import axios from 'axios'




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false};
    this.web3 = new Web3(window.web3.currentProvider);

    this.handleDonateClick = this.handleDonateClick.bind(this);
    this.refreshCampaignsList = this.refreshCampaignsList.bind(this)
  }

  componentWillMount() {
    if(this.web3) {
      console.log('yay in ')
      window.ethereum.enable();
      console.log('provider: ', window.web3.currentProvider.enable());
      this.setState({isConnected: true});

      const words = [{address: '0x280ef036EE3193703c2aFb315619d1D4daD3216E', name: 'test campagin', start_date: '04/12/2012', end_date: '04/12/2020' }];
      this.state.campaigns = words.map((word, idx) => {
          return <li key={idx}>name: {word.name}----state_date: {word.start_date}----end_date {word.end_date}----address: {word.address} </li>;
      });

      this.web3.eth.getAccounts().then((accounts) => {
        console.log('accounts: ', accounts[0])
        this.state.account = accounts[0];
        this.setState(({}));
      })
    }
  }

  deployCampaginToBlockChain(pks, goal, relativeTimeSeconds){
    const rawByteCode = "0x60806040526040516040806103b48339810180604052810190808051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620151808202420160018190555080600281905550505061031e806100966000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806388ffe8671461005c578063ac30777314610066578063b2d5ae441461007d575b600080fd5b610064610094565b005b34801561007257600080fd5b5061007b6100f3565b005b34801561008957600080fd5b506100926101e7565b005b600154421015156100a457600080fd5b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b6002543073ffffffffffffffffffffffffffffffffffffffff16311015151561011b57600080fd5b600154421015151561012c57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561018757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156101e4573d6000803e3d6000fd5b50565b60006002543073ffffffffffffffffffffffffffffffffffffffff163110151561021057600080fd5b600154421015151561022157600080fd5b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156102ee573d6000803e3d6000fd5b50505600a165627a7a723058208c2fdc568b40750397f91ccbd3f763a146d261d5d7b59a146398305cce6376de0029"
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
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
      }
    ]
    
    let SampleContract = new this.web3.eth.Contract(abi);
    SampleContract.deploy({from: this.state.account, gas: 1000000, data: rawByteCode, arguments: [relativeTimeSeconds,goal]})
    .send({from: this.state.account})
    .then(response => {
      console.log('response deploy: ', response)
      console.log('response deploy address: ', response['_address'])
      console.log('here3') 
      const data = { name: 'my Name', address: '0x280ef036EE3193703c2aFb315619d1D4daD3216E', relativeTimeSeconds: relativeTimeSeconds };
      axios.post('http://localhost:5000/startNewCampign', data)
          .then(response =>
             console.log('response post: ', response));   

    })
    console.log('here3')


  }

  refreshCampaignsList() {
    console.log("asdffffsafd")
    fetch('https://api.npms.io/v2/search?q=react')
        .then(response => response.json())
        .then(data => {
          console.log('my-data: ', data)
          const words = ['sfffffsdfasdf', 'asdfasdf'];
          this.state.campaigns = words.map((word, idx) => {
            return <li key={idx}>{word}</li>;
          });
      
          console.log('capmaigns: ', this.state.campaigns)
          this.setState(({}));
          
          this.deployCampaginToBlockChain(['0x1111'], 111, 3)
        }
      );


  }

  handleDonateClick() {
    // this.web3 = new Web3(window.web3.currentProvider);
    const words = ['sfffffsdfasdf', 'asdfasdf'];
    this.state.campaigns = words.map((word, idx) => {
      return <li key={idx}>{word}</li>;
    });
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


   this.setState(({}));
  }
  
  
  render() {
    return (
      <div>
        <h2>Is connected?:</h2><br/>
        {this.state.isConnected?'Connewcted to local n3ode':'Not Connected'}
        <br/><br/>
    
       <button onClick={this.refreshCampaignsList}>
          refresh campaigns list
        </button>

        <h2>Campaigns list:</h2>
        <ul> {this.state.campaigns} </ul>,



        <br/><br/>

        <h2>Donate Money:</h2><br/>


        Donation size
        <input onChange={(e) => {
          this.state.donationSize = Number(e.target.value)
          console.log('donation size: ', this.state.donationSize)
          }}/>

         <br/>
         
        Address
        <input onChange={(e) => {
          this.state.contractAddress = e.target.value
          console.log('contract address: ', this.state.contractAddress)
          }}/>
         <br/>
         
        <button onClick={this.handleDonateClick}>
          Donate money
        </button>

        <br/>
        <h2>start new campaign:</h2><br/>
        public key 1
        <input onChange={(e) => {
          this.state.publicKey1 = e.target.value
          }}/>
         <br/>
        public key 2
        <input onChange={(e) => {
          this.state.publicKey2 = e.target.value
          }}/>
         <br/>
        public key 3
        <input onChange={(e) => {
          this.state.publicKey3 = e.target.value
          }}/>
         <br/>
         relative time in seconds for campaign to finish                             
         <input onChange={(e) => {
          this.state.relativeTimeSeconds = Number(e.target.value)
          }}/>
         <br/>
         goal
         <input onChange={(e) => {
          this.state.goal = Number(e.target.goal)
          }}/>
          <br/>





      </div>

      
      
    );
  }
}
export default App;