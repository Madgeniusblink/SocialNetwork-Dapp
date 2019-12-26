// Test Tools
// https://mochajs.org/
// https://www.chaijs.com/
// https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript

//  tells truffle which contract we want to interact with
const SocialNetwork = artifacts.require("SocialNetwork");


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork

    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })
    describe('deployment', () => {
        it('deploys successfully', async () => {
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'Madgeniusblink Dapp Social Network')
        })
    })



    describe('posts', async () => {
        let result, postCount
        before(async () => {
            result = await socialNetwork.createPost('this is my first post', { from: author });
            postCount = await socialNetwork.postCount();
        })

        it('creates posts', async () => {
            // success
            assert.equal(postCount, 1);
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'this is my first post')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')
            // Failure: post must have content
            await socialNetwork.createPost('', { from: author }).should.be.rejected;
        })

        it('lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'this is my first post')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })

        it('allows users to tip posts', async () => {
             // Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

            // Success
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'this is my first post')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')
           
            // Check that author received funds
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipAmount
            tipAmount = await web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            // Failure: tries to tip a post that does not exist
            const notExistingId = 99
            await socialNetwork.tipPost(notExistingId, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })
})