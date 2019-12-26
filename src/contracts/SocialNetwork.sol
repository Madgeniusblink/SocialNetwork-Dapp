pragma solidity >=0.4.21 <0.7.0;

contract SocialNetwork {
    // state variable
    string public name;
    // local _Veriable
    uint public postCount = 0;
    // store data - writes info to the blockchain
    mapping(uint => Post) public posts;

    // data structure (model)
    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;

    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

     constructor() public {
         name = "Madgeniusblink Dapp Social Network";
     }

     function createPost(string memory _content) public {
        //  require valid content
        require(bytes(_content).length > 0, 'content is required');
        //  Increment the post count
         postCount ++;
        //  Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // trigger event
        emit PostCreated(postCount, _content, 0, msg.sender);

     }

    function tipPost(uint _id) public payable {
        // require valid id
        require(_id > 0 && _id <= postCount, 'id is require');
        // fetch post
        Post memory _post = posts[_id];
        // fetch the author
        address payable _author = _post.author;
        // pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // incremet the tip amount;
        // wei value 1Ether === 1000000000000000000 Wei
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
     }
}

