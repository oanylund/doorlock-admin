import React, { PropTypes } from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

const NavBar = ({searchField}) => (
  <Navbar inverse fixedTop>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/lock-status'>Hackerspace UI</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      {!!searchField && searchField}
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavDropdown eventKey={1} title='Medlemmer' id='medlemmer-dropdown'>
          <LinkContainer to='/medlem/liste'>
            <MenuItem eventKey={1.1}>Medlemsliste</MenuItem>
          </LinkContainer>
          <LinkContainer to='/medlem/legg-til'>
            <MenuItem eventKey={1.2}>Legg til medlem</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default NavBar;
