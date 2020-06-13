import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinkProps = (path, animationDelay) => ({
    className: `${window.location.pathname === path ? 'focused' : ''}`,
    style: {
        animationDelay: `${animationDelay}s`,
    },
});

function Navbar({pages}) {
    const [expand, setExpand] = useState(false);
    return (  
<nav className="navbar navbar-light light-blue lighten-4">
        <a className="navbar-brand" href="#">PANDEMIC2020</a>
        <button className="navbar-toggler toggler-example" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"><span className="dark-blue-text"><i className="fas fa-bars fa-1x" /></span></button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent1">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;
