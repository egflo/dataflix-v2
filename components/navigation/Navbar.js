
import { Button, Navbar, Nav, NavDropdown, Form, FormControl, Dropdown, Container} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faShoppingCart, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import Search from './Search'
import { useRouter } from 'next/router'
import  React, {useRef, useState, useEffect} from 'react';
import {useWindowDimensions} from "../../utils/useWindowDimensions.ts";
import OrderViewMobile from "../order/OrderViewMobile";
import CartNotification from"./CartNotification";
import {removeCookies, setCookies} from "cookies-next";


//https://stackoverflow.com/questions/67540393/next-js-material-ui-warning-prop-classname-did-not-match
//https://stackoverflow.com/questions/36426521/what-does-export-default-do-in-jsx
//https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
//https://github.com/itsfaqih/react-swr-auth

export default function Navigation() {
    const { width, height } = useWindowDimensions();
    const router = useRouter()

    function handleClickHome() {
        router.push({
            pathname: '/'
        })
    }

    function handleLogout() {
        const options = {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            secure: true,
            sameSite: 'lax',
        };

        removeCookies('accessToken', options);
        removeCookies('refreshToken', options);
        removeCookies('username', options);
        removeCookies('id',options);
        removeCookies('isLoggedIn', options);

        router.push({
            pathname: '/login'
        })
    }

    function AccountView() {
        if(width <= 900){
            return <OrderViewMobile></OrderViewMobile>
        }
        else{
            return <FontAwesomeIcon icon={faFilm} size="2x" />;
        }
    }

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#home" onClick={handleClickHome}>
                    <FontAwesomeIcon icon={faFilm} size="2x" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                        <Nav.Item>
                            <div style={{height: '100%',display:'flex', alignContent:'center', alignItems:'center'}}>
                                <Search></Search>
                            </div>
                        </Nav.Item>
                    <Nav className="ml-auto">
                        <NavDropdown
                            title={
                                <Button
                                >
                                    <FontAwesomeIcon icon={faUserCircle} style={{color: "white"}} size="2x" />
                                </Button>
                            }
                        >
                            <NavDropdown.Item href="/account/orders">Orders</NavDropdown.Item>
                            <NavDropdown.Item href="/account/settings">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="">
                                <div onClick={handleLogout}>
                                    Sign Out
                                </div>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Item>
                            <CartNotification></CartNotification>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
