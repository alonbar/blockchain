import React, { Component } from 'react';
import Web3 from 'web3';
import axios from 'axios'


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
				"name": "numberOfSeconds",
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

const rawByteCode = "0x608060405234801561001057600080fd5b506040516040806103bf8339810180604052810190808051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018202420160018190555080600281905550505061031e806100a16000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806388ffe8671461005c578063ac30777314610066578063b2d5ae441461007d575b600080fd5b610064610094565b005b34801561007257600080fd5b5061007b6100f3565b005b34801561008957600080fd5b506100926101e7565b005b600154421015156100a457600080fd5b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b6002543073ffffffffffffffffffffffffffffffffffffffff16311015151561011b57600080fd5b600154421015151561012c57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561018757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156101e4573d6000803e3d6000fd5b50565b60006002543073ffffffffffffffffffffffffffffffffffffffff163110151561021057600080fd5b600154421015151561022157600080fd5b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156102ee573d6000803e3d6000fd5b50505600a165627a7a723058209ece3759ac85718835c241bd6f36d6db2e1b27c2a95b60172dc6ef094aecddc50029"
    

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false};
    this.web3 = new Web3(window.web3.currentProvider);

    this.handleDonateClick = this.handleDonateClick.bind(this);
    this.refreshCampaignsList = this.refreshCampaignsList.bind(this);
    this.deployCampaginToBlockChain = this.deployCampaginToBlockChain.bind(this);
    this.refundNow = this.refundNow.bind(this)
    this.signConstantMessage = this.signConstantMessage.bind(this)
  }

  componentWillMount() {
    if(this.web3) {
      console.log('yay in ')
      window.ethereum.enable();
      console.log('provider: ', window.web3.currentProvider.enable());
      this.setState({isConnected: true});

    this.web3.eth.getAccounts().then((accounts) => {
        console.log('accounts: ', accounts[0])
        this.state.account = accounts[0];
        this.setState(({}));
      })
    }
  }

  refundNow() {
    let myContract = new this.web3.eth.Contract(abi, this.state.contractAddress);
    console.log('refund now', this.state.contractAddress)
  
    console.log('my accounts: ', this.state.account)
    myContract.methods.getRefund().send({
      from: this.state.account
    }).then((refundRes) => {
      
      console.log('donation returned: ', refundRes)
      this.web3.eth.getBalance(this.state.contractAddress).then(balance => 
      {
        console.log('balance returned: ', balance)
        this.state.balance = balance;
        this.setState(({}));
      });
      
    });


  this.state.balance = null;
   this.setState(({}));
  }

  deployCampaginToBlockChain(){
    
    let SampleContract = new this.web3.eth.Contract(abi);
    SampleContract.deploy({from: this.state.account, gas: 1000000, data: rawByteCode, arguments: [this.state.relativeTimeSeconds, this.state.goal]})
    .send({from: this.state.account})
    .then(response => {
      console.log('response deploy: ', response)
      console.log('response deploy address: ', response.options.address)
      console.log('here3') 
      const data = { name: this.state.name, address: response.options.address, relativeTimeSeconds: this.state.relativeTimeSeconds };
      axios.post('http://localhost:5000/startNewCampign', data)
          .then(response =>
             console.log('response post: ', response));
             this.refreshCampaignsList()   

    })
  }

  refreshCampaignsList() {
    console.log('refresh campaigns');
    fetch('http://localhost:5000/getCampigns')
        .then(response => response.json())
        .then(campaigns => {
          console.log('campaigns data: ', campaigns)
          this.state.campaigns = campaigns.map((campaign, idx) => {
            return <li key={idx}>name: {campaign.name}-----campagin address: {campaign.address}</li>;
          });
      
          console.log('capmaigns: ', this.state.campaigns)
          this.setState(({}));
        }
      );
  }

  handleDonateClick() {

    let myContract = new this.web3.eth.Contract(abi, this.state.contractAddress);

    // const amount = 1000000000000000000
    // const amount2 = 10000

    console.log('contract address: ', this.state.contractAddress)
    console.log('donation size: ', this.state.donationSize)
    this.web3.eth.getAccounts().then((accounts) => {
      console.log('my accounts: ', accounts[0])
      myContract.methods.pledge().send({
        from: accounts[0],
        value: this.state.donationSize
      }).then((contributeRes) => {
        
        console.log('donation returned: ', contributeRes)
        this.web3.eth.getBalance(this.state.contractAddress).then(balance => 
        {
          console.log('balance returned: ', balance)
          this.state.balance = balance;
          this.setState(({}));
        });
        
      });
    })

  this.state.balance = null;
   this.setState(({}));
  }

  signConstantMessage() {
    var message = "WITHDRAW! ";
      
    var signature = this.web3.eth.accounts.sign(message, '0xb44e82c13345b6c41d413b3198da1d502bc04a4d823a168fe6ad86919143de86');
    
    console.log("signature :", signature);
    
    var messageHash= this.web3.eth.accounts.hashMessage(message);
    // recover 1
    
    
    
    var recover_1 = this.web3.eth.accounts.recover({
        messageHash: messageHash,
        v: signature.v,
        r: signature.r,
        s: signature.s
    });
    
    console.log("recover 1 :", recover_1);
    
    
    // message, signature
    var recover_2 = this.web3.eth.accounts.recover(message, signature.signature);
    console.log("recover 2 :", recover_2);
    
    // message, v, r, s
    var recover_3 = this.web3.eth.accounts.recover(message, signature.v, signature.r, signature.s);
    console.log("recover 3 :", recover_3);
    
    console.log(Object.assign(signature, {v: this.web3.utils.toDecimal(signature.v)}));
        
  }

  
  render() {
    return (
      <div>
        <h2>Is connected?:</h2><br/>
        {this.state.isConnected? 'Connewcted to idc node':'Not Connected'}
        <br/><br/>
    


        <h2>Campaigns list:</h2>
        <ul> {this.state.campaigns} </ul>,

        <button onClick={this.refreshCampaignsList}>
          refresh campaigns list
        </button>

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

        {'   '}Contract balance after donation:{' '} {this.state.balance}

        <br/>
        <h2>start new campaign:</h2><br/>
        name
        <input onChange={(e) => {
          this.state.name = e.target.value
          }}/>
         <br/>
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
          this.setState(({}));
          }}/>
         <br/>
         goal
         <input onChange={(e) => {
          this.state.goal = Number(e.target.value)
          this.setState(({}));
          }}/>
          <br/>

        <button onClick={this.deployCampaginToBlockChain}>
          publish campaign
        </button>

        <br/><br/>
        <h2>REFUND:</h2>
        Address
        <input onChange={(e) => {
          this.state.contractAddress = e.target.value
          console.log('contract address: ', this.state.contractAddress)
          }}/>
        <button onClick={this.refundNow}>
          refund
        </button>
        {'   '}Contract balance after refund:{' '} {this.state.balance}


      <br/><br/>
      <h2>sign constant message:</h2>

      <button onClick={this.signConstantMessage}>
      sign constant messag
      </button>

      </div>


      
    );
  }
}
export default App;