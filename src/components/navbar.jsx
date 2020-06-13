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
      <div id="custom-bootstrap-menu" className="navbar navbar-default " role="navigation">
        <div className="container-fluid">
          <div className="navbar-header"><a className="navbar-brand" href="#">Brand</a>
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-menubuilder"><span className="sr-only">Toggle navigation</span><span className="icon-bar" /><span className="icon-bar" /><span className="icon-bar" />
            </button>
          </div>
          <div className="collapse navbar-collapse navbar-menubuilder">
            <ul className="nav navbar-nav navbar-left">
              <li><a href="/">Home</a>
              </li>
              <li><a href="/products">Products</a>
              </li>
              <li><a href="/about-us">About Us</a>
              </li>
              <li><a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}

export default Navbar;
