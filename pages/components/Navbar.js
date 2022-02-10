
import React from "react";
import { Button, Navbar, Nav, NavDropdown, Form, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import {useGetMovies} from '../api/Service'
import SearchBox from '../components/AutoComplete'

//https://stackoverflow.com/questions/36426521/what-does-export-default-do-in-jsx

export default function Navigation() {

    function handleInputChange(event, value) {
        console.log(value);
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
                <FontAwesomeIcon icon={faFilm} size="2x" />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <SearchBox></SearchBox>
            </Navbar.Collapse>
        </Navbar>
    );
}
