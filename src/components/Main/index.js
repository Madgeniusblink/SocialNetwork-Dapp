import React, { useState } from 'react'

const index = ({ posts, generateIcon, createPost, tipPost }) => {
    const [input, setInput] = useState('')
    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                    <div className="content mr-auto ml-auto">
                        <p>&nbsp;</p>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            createPost(input)
                            }}
                        >
                            <div className="form-group mr-sm-2">
                                <input 
                                    id="postCount"
                                    type="text"
                                    value={input}
                                    onChange={e => { setInput(e.target.value) }}
                                    className="form-control"
                                    placeholder="What's on your mind?"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-block"
                            >
                                Share
                            </button>
                        </form>
                        {
                            posts.map((post, key) => {
                                return (
                                    <div className="card mb-4 mt-4" key={key}>
                                        <div className="card-header">
                                            <img
                                                className="mr-4"
                                                width="30"
                                                height="30"
                                                src={generateIcon(post.author)}
                                                alt="ethereum user icon"
                                            />
                                            <small className="text-muted" >{post.author}</small>
                                        </div>
                                        <ul id="postList" className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <p>{post.content}</p>
                                            </li>
                                            <li key={key} className="list-group-item py-2">
                                                <small className="float-left mt-1 text-muted">
                                                    TIP: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
														</small>
                                                <button 
                                                    value={post.id}
                                                    onClick={event => {
                                                        let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                                                        console.log(event.currentTarget.value, tipAmount)
                                                        tipPost(event.currentTarget.value, tipAmount)

                                                    }}
                                                    className="btn btn-link btn-sm float-right pt-0"
                                                >
                                                    <span>
                                                        TIP 0.1 ETH
													</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default index
