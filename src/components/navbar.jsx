import React, { useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer
} from 'mdbreact';
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
<MDBContainer>
          <MDBNavbar
            color='light-blue lighten-4'
            style={{ marginTop: '20px' }}
            light
          >
            <MDBContainer>
              <MDBNavbarBrand>Navbar</MDBNavbarBrand>
              <MDBNavbarToggler
                onClick={this.toggleCollapse('navbarCollapse1')}
              />
              <MDBCollapse
                id='navbarCollapse1'
                isOpen={this.state.collapseID}
                navbar
              >
                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <MDBNavLink to='#!'>Home</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to='#!'>Link</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to='#!'>Profile</MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>
        </MDBContainer>
    );
}

export default Navbar;
