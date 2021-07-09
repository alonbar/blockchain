import React, { Component } from 'react';
import Web3 from 'web3';
import axios from 'axios'


const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "msgHash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "recoverAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
		"name": "getRefund",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_msgHash",
				"type": "bytes32"
			},
			{
				"name": "_v",
				"type": "uint8[2]"
			},
			{
				"name": "_r",
				"type": "bytes32[2]"
			},
			{
				"name": "_s",
				"type": "bytes32[2]"
			}
		],
		"name": "claimFunds",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "msgHash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			},
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
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
			},
			{
				"name": "_addresses",
				"type": "address[3]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]

const rawByteCode = "608060405234801561001057600080fd5b5060405160a080610f0b83398101806040528101908080519060200190929190805190602001909291909190505060018302420160008190555081600181905550806003906003610062929190610086565b506000600660006101000a81548160ff021916908315150217905550505050610146565b82600381019282156100f2579160200282015b828111156100f15782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190610099565b5b5090506100ff9190610103565b5090565b61014391905b8082111561013f57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101610109565b5090565b90565b610db6806101556000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680638428cf831461007257806388ffe8671461010c578063b2d5ae4414610116578063cb90ff4b1461012d578063cc7d675c146101eb575b600080fd5b34801561007e57600080fd5b506100ca6004803603810190808035600019169060200190929190803560ff1690602001909291908035600019169060200190929190803560001916906020019092919050505061027d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61011461030a565b005b34801561012257600080fd5b5061012b6103d2565b005b34801561013957600080fd5b506101e960048036038101908080356000191690602001909291908060400190600280602002604051908101604052809291908260026020028082843782019150505050509192919290806040019060028060200260405190810160405280929190826002602002808284378201915050505050919291929080604001906002806020026040519081016040528092919082600260200280828437820191505050505091929192905050506105d5565b005b3480156101f757600080fd5b506102636004803603810190808035600019169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d43565b604051808215151515815260200191505060405180910390f35b6000600185858585604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af11580156102f6573d6000803e3d6000fd5b505050602060405103519050949350505050565b60005442101515610383576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b34600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60006001543073ffffffffffffffffffffffffffffffffffffffff163110151561048a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001807f66756e64696e672072656163686564206c696d69742c2063616e206e6f74206781526020017f657420726566756e64000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6000544210151515610504576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156105d1573d6000803e3d6000fd5b5050565b600080600080600080600660009054906101000a900460ff16151515610663576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260198152602001807f6d6f6e65792077617320616c726561647920636c61696d65640000000000000081525060200191505060405180910390fd5b6001543073ffffffffffffffffffffffffffffffffffffffff1631101515156106f4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f676f616c206e6f7420726561636865640000000000000000000000000000000081525060200191505060405180910390fd5b600054421015151561076e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b60009550600094505b60028560ff161015610835576107ce8a8a8760ff1660028110151561079857fe5b60200201518a8860ff166002811015156107ae57fe5b60200201518a8960ff166002811015156107c457fe5b602002015161027d565b93506000600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508480600101955050610777565b6000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600092505b60028360ff161015610a7557600091505b60038260ff161015610a6857600115156109328b8b8660ff166002811015156108c857fe5b60200201518b8760ff166002811015156108de57fe5b60200201518b8860ff166002811015156108f457fe5b602002015160038860ff1660038110151561090b57fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610d43565b15151415610a5b57600015156007600060038560ff1660038110151561095457fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415610a5a57858060010196505060016007600060038560ff166003811015156109e657fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5b81806001019250506108a3565b8280600101935050610892565b600090505b60038160ff161015610c1d5760038160ff16600381101515610a9857fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610b775750600015156007600060038460ff16600381101515610b0957fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515145b15610c1057858060010196505060016007600060038460ff16600381101515610b9c57fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b8080600101915050610a7a565b60028660ff16111515610cbe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001807f646964206e6f742067657420656e6f75676820636f7272656374207369676e6181526020017f747572657300000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610d1b573d6000803e3d6000fd5b506001600660006101000a81548160ff02191690831515021790555050505050505050505050565b60008173ffffffffffffffffffffffffffffffffffffffff16610d688787878761027d565b73ffffffffffffffffffffffffffffffffffffffff16149050959450505050505600a165627a7a72305820ec9c269d0e401f4862b89bd1bb7b8d32994a0a8bab2a77eadd2d14fa3c6a1b210029"
    

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
    this.withdraw = this.withdraw.bind(this)
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

  withdraw() {

    console.log('here333')
    let myContract = new this.web3.eth.Contract(abi, this.state.contractAddress);
    console.log('withdraw now', this.state.contractAddress)
    
    const message = "WITHDRAW!";
    const messageHash= this.web3.eth.accounts.hashMessage(message);

    const vs = [this.state.v1, this.state.v2]
    const rs = [this.state.r1, this.state.r2]
    const ss = [this.state.s1, this.state.s2]
  
    console.log('my accounts: ', this.state.account)
    myContract.methods.claimFunds(messageHash, vs, rs, ss).send({
      from: this.state.account
    }).then((claimFundsRes) => {
      
      console.log('donation returned: ', claimFundsRes)
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
    const pks = [this.state.publicKey1, this.state.publicKey2, this.state.publicKey3]
    SampleContract.deploy({from: this.state.account, gas: 1000000, data: rawByteCode, arguments: [this.state.relativeTimeSeconds, this.state.goal, pks]})
    .send({from: this.state.account})
    .then(response => {
      console.log('response deploy: ', response)
      console.log('response deploy address: ', response.options.address)
      console.log('here3') 
      const data = { name: this.state.name, address: response.options.address, relativeTimeSeconds: this.state.relativeTimeSeconds, endTime: Date.now() + 1000 * this.state.relativeTimeSeconds, goal: this.state.goal };
      axios.post('http://localhost:5000/startNewCampaign', data)
          .then(response =>
             console.log('response post: ', response));
          setTimeout(function(f){
            f();
          }, 1000, this.refreshCampaignsList);
             

    })
  }

  refreshCampaignsList() {
    console.log('refresh campaigns');
    fetch('http://localhost:5000/getCampaigns')
        .then(response => response.json())
        .then(campaigns => {
          console.log('campaigns data: ', campaigns)
          this.state.campaigns = campaigns.map((campaign, idx) => {
            return <li key={idx}>name: {campaign.name}-----campagin address: {campaign.address}-----campaign goal: {campaign.goal}-----end time: {new Date(campaign.endTime).toLocaleDateString() + ' ' + new Date(campaign.endTime).toLocaleTimeString()}</li>;
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
    const message = "WITHDRAW!";
      
    const signature1 = this.web3.eth.accounts.sign(message, this.state.private_key1);
    const signature2 = this.web3.eth.accounts.sign(message, this.state.private_key2);
    
    console.log("signature1 :", signature1);
    console.log("signature2 :", signature2);


    this.state.r1_from_test = signature1.r;
    this.state.v1_from_test = signature1.v;
    this.state.s1_from_test = signature1.s;

    this.state.r2_from_test = signature2.r;
    this.state.v2_from_test = signature2.v;
    this.state.s2_from_test = signature2.s;  
    this.setState(({}));
        
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
        address 1
        <input onChange={(e) => {
          this.state.publicKey1 = e.target.value
          }}/>
         <br/>
        address 2
        <input onChange={(e) => {
          this.state.publicKey2 = e.target.value
          }}/>
         <br/>
         address 3
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
        <h2>WITHDRAW:</h2>
        Address
        <input onChange={(e) => {
          this.state.contractAddress = e.target.value
          console.log('contract address: ', this.state.contractAddress)
          }}/>
        <br/>

        r1
        <input onChange={(e) => {
          this.state.r1 = e.target.value
          }}/>
        <br/>
        
        s1
        <input onChange={(e) => {
          this.state.s1 = e.target.value
          }}/>  
        <br/>
          
        v1
        <input onChange={(e) => {
          this.state.v1 = e.target.value
          }}/>  
        <br/>
        r2
        <input onChange={(e) => {
          this.state.r2 = e.target.value
          }}/>
        <br/>
        s2
        <input onChange={(e) => {
          this.state.s2 = e.target.value
          }}/>  
        <br/> 
        v2
        <input onChange={(e) => {
          this.state.v2 = e.target.value
          }}/>          
        <br/>
        <button onClick={this.withdraw}>
        WITHDRAW
        </button>
        {'   '}Contract balance after refund:{' '} {this.state.balance}


      <br/><br/>
      <h2>test withdraw:</h2> <br/>for dev reasons<br/>
      This acts as if you are passing the values of v,r,s (the seperation of the signature to three parts via some communication that is not ethereum and blockchain )
      <br/>
      test private key1 (without leading 0x)
        <input onChange={(e) => {
          this.state.private_key1 = e.target.value
          }}/>  
        <br/>
     
          
        test private key2 (without leading 0x)
        <input onChange={(e) => {
          this.state.private_key2 = e.target.value
          }}/>  
        <br/>
        <br/>
        {'r1: '} {this.state.r1_from_test}
        <br/>
        {'rs: '} {this.state.s1_from_test}
        <br/>
        {'v1: '} {this.web3.utils.toDecimal(this.state.v1_from_test)}
        <br/>
        {'r2: '} {this.state.r2_from_test}
        <br/>
        {'s2: '} {this.state.s2_from_test}
        <br/>
        {'v2: '} {this.web3.utils.toDecimal(this.state.v2_from_test)}

        <br/>

      <button onClick={this.signConstantMessage}>
      sign constant messag
      </button>

      </div>


      
    );
  }
}
export default App;
