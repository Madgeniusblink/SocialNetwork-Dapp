import React, { Component } from 'react'
import Web3 from 'web3'
import Identicon from 'identicon.js'
import './App.css';
import SocialNetwork from './abis/SocialNetwork.json'

import Header from './components/Header'
import Main from './components/Main'


// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
export class App extends Component {

	loadWeb3 = async () => {
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable()
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	};

	loadBlockchainData = async () => {
		const web3 = window.web3
		// load account
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		// Network ID
		const networkId = await web3.eth.net.getId()
		const networkData = SocialNetwork.networks[networkId]
		if (networkData) {
			const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
			this.setState({ socialNetwork })

			const postCount = await socialNetwork.methods.postCount().call()
			this.setState({ postCount })

			for (var i = 1; i <= postCount; i++) {
				const post = await socialNetwork.methods.posts(i).call()
				this.setState({
					posts: [...this.state.posts, post]
				})
			}
			// Sort posts. Show highest tipped posts first
			this.setState({
				posts: this.state.posts.sort((a,b) => {
					return b.tipAmount - a.tipAmount
				})
			})
			this.setState({ isloading: false })
		} else {
			window.alert('Social network contract has not been deploy to the blockchain')
		}
	};

	componentWillMount = async () => {
		await this.loadWeb3()
		await this.loadBlockchainData()

	}

	createPost = (content) => {
		this.setState({ isloading: true })
		this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
		.once('receipt', (receipt) => { 
			this.setState({ isloading: false })
		 })
	}

	tipPost = (id, tipAmount) => {
		this.setState({ isloading: true })
		this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
		.once('receipt', (receipt) => {
			this.setState({ isloading: false })
		})
	}

	constructor(props) {
		super(props)
		this.state = {
			account: '',
			socialNetwork: null,
			postCount: 0,
			posts: [],
			isloading: true
		}
	}


	render() {
		const generateIcon = (userId) => 
			`data:image/png;base64, ${new Identicon(userId, 30).toString()}`
		return (
			<div>
				<Header generateIcon={generateIcon} account={this.state.account} />
				{
					this.state.isloading ? (
						<div id="loader" className="text-center mt-5">
							<p>Loading...</p>
						</div> 
					) : (
						<Main 
							createPost={this.createPost} 
							generateIcon={generateIcon} 
							posts={this.state.posts} 
							tipPost={this.tipPost}
							
						/>
					) 
				}
			</div>
		)
	}
}

export default App