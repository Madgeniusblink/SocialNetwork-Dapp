import React from 'react'

const Header = ({ account, generateIcon }) => {
       
    return (
        <header>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="http://www.madgeniusblink.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Social Network
                        </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-secondary">
                            <small id="account">{account}</small>
                        </small>
                        { account ? (
                            <img 
                                className="ml-2" 
                                width="30" 
                                height="30" 
                                src={generateIcon(account)} 
                                alt="ethereum user icon"
                                />
                            ) : null
                        }
                        
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
