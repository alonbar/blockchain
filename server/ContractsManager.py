
import sys
import time
import pprint
from web3.middleware import geth_poa_middleware
import json
from web3.providers.eth_tester import EthereumTesterProvider
from web3 import Web3
#from eth_tester import PyEVMBackend
from solcx import compile_source

f = open("abi.json",)
ABI = json.loads(f.read())
f.close()
def compile_source_file(file_path):
   with open(file_path, 'r') as f:
      source = f.read()

   return compile_source(source)


def deploy_contract(w3, contract_interface):
    tx_hash = w3.eth.contract(
        abi=ABI,
        bytecode="608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b603d6069565b6040516048919060c2565b60405180910390f35b6067600480360381019060639190608f565b6072565b005b60008054905090565b8060008190555050565b60008135905060898160e5565b92915050565b60006020828403121560a057600080fd5b600060ac84828501607c565b91505092915050565b60bc8160db565b82525050565b600060208201905060d5600083018460b5565b92915050565b6000819050919050565b60ec8160db565b811460f657600080fd5b5056fea2646970667358221220c019e4614043d8adc295c3046ba5142c603ab309adeef171f330c51c38f1498964736f6c63430008040033").constructor().transact()

    address = w3.eth.get_transaction_receipt(tx_hash)['contractAddress']
    return address


#w3 = Web3(EthereumTesterProvider(PyEVMBackend()))
#w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
w3 = Web3(Web3.HTTPProvider("https://eth.ap.idc.ac.il"))
#w3.middleware_onion.inject(geth_poa_middleware, layer=0)
#w3 = Web3(Web3.HTTPProvider("https://eth.ap.idc.ac.il"))
block = w3.eth.get_block('latest')
print(block)
#accounts = w3.eth.account
print(w3.eth.accounts)
#w3.eth.default_account = '0xF751585F7753034D68e68b02B610E7097D10Cb21'

contract_source_path = 'contract.sol'
compiled_sol = compile_source_file('contract.sol')

contract_id, contract_interface = compiled_sol.popitem()

address = deploy_contract(w3, contract_interface)
print(f'Deployed {contract_id} to: {address}\n')

store_var_contract = w3.eth.contract(address=address, abi=contract_interface["abi"])

gas_estimate = store_var_contract.functions.setVar(255).estimateGas()
print(f'Gas estimate to transact with setVar: {gas_estimate}')

if gas_estimate < 100000:
     print("Sending transaction to setVar(255)\n")
     tx_hash = store_var_contract.functions.setVar(255).transact()
     receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
     print("Transaction receipt mined:")
     pprint.pprint(dict(receipt))
     print("\nWas transaction successful?")
     pprint.pprint(receipt["status"])
else:
     print("Gas cost exceeds 100000")