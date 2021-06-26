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

const rawByteCode = "0x608060405234801561001057600080fd5b5060405160a0806109b18339810180604052810190808051906020019092919080519060200190929190919050506001830242016000819055508160018190555080600390600361006292919061006b565b5050505061012b565b82600381019282156100d7579160200282015b828111156100d65782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509160200191906001019061007e565b5b5090506100e491906100e8565b5090565b61012891905b8082111561012457600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055506001016100ee565b5090565b90565b6108778061013a6000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806388ffe86714610067578063b2d5ae4414610071578063cb90ff4b14610088578063cc7d675c14610146575b600080fd5b61006f6101d8565b005b34801561007d57600080fd5b506100866102a0565b005b34801561009457600080fd5b5061014460048036038101908080356000191690602001909291908060400190600280602002604051908101604052809291908260026020028082843782019150505050509192919290806040019060028060200260405190810160405280929190826002602002808284378201915050505050919291929080604001906002806020026040519081016040528092919082600260200280828437820191505050505091929192905050506104a3565b005b34801561015257600080fd5b506101be6004803603810190808035600019169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061078f565b604051808215151515815260200191505060405180910390f35b60005442101515610251576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b34600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60006001543073ffffffffffffffffffffffffffffffffffffffff1631101515610358576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001807f66756e64696e672072656163686564206c696d69742c2063616e206e6f74206781526020017f657420726566756e64000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b60005442101515156103d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561049f573d6000803e3d6000fd5b5050565b60008060006001543073ffffffffffffffffffffffffffffffffffffffff163110151515610539576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f676f616c206e6f7420726561636865640000000000000000000000000000000081525060200191505060405180910390fd5b60005442101515156105b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f646561646c696e65206e6f74207265616368656400000000000000000000000081525060200191505060405180910390fd5b60009250600091505b60028260ff16101561068757600090505b60038160ff16101561067a576001151561065c88888560ff166002811015156105f257fe5b6020020151888660ff1660028110151561060857fe5b6020020151888760ff1660028110151561061e57fe5b602002015160038760ff1660038110151561063557fe5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661078f565b1515141561066d5782806001019350505b80806001019150506105cd565b81806001019250506105bc565b60018360ff16111515610728576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001807f646964206e6f742067657420656e6f75676820636f7272656374207369676e6181526020017f747572657300000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610785573d6000803e3d6000fd5b5050505050505050565b60008173ffffffffffffffffffffffffffffffffffffffff16600187878787604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af115801561081f573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff16149050959450505050505600a165627a7a723058202653d901643a87c3f87e53157c237cc33cc50dc2cdfdfde17345fe277838eb590029"
    

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
      const data = { name: this.state.name, address: response.options.address, relativeTimeSeconds: this.state.relativeTimeSeconds };
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
