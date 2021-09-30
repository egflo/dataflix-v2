
import { Button, Navbar, Nav, NavDropdown, Form, FormControl, Dropdown} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faShoppingCart, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import {useGetMovies} from '../pages/api/Service'
import Search from '../components/Search'
import { useRouter } from 'next/router'
import ShoppingCartIcon from '@material-ui/icons/Shoppingcart';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import {useGetUserCart} from '../pages/api/Service'
import  React, {useRef, useState, useEffect} from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import  {getUserId} from '../utils/helpers'


const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -3,
        top: 5,
        //border: `2px solid ${theme.palette.background.paper}`,
       // padding: '0 4px',
    },
}))(Badge);

//https://stackoverflow.com/questions/67540393/next-js-material-ui-warning-prop-classname-did-not-match
//https://stackoverflow.com/questions/36426521/what-does-export-default-do-in-jsx
//https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617

//https://github.com/itsfaqih/react-swr-auth


export default function Navigation() {

    const router = useRouter()
    //const [qty, setQty] = useState(0);
    //const { data, error } = useGetUserCart("qty/" + getUserId())
    const { data, error } = useGetUserCart(getUserId())
    var qty = 0;

    if(!data) return  (<h1>Loading</h1>);
    if(data || !error) {
        qty = data.map(li => li.quantity).reduce((sum, val) => sum + val, 0);
        //setQty(data.map(li => li.quantity).reduce((sum, val) => sum + val, 0));
        //qty = data.reduce((acc, item) => acc + item.quantity, 0);
    }

    function handleClickHome() {
        router.push({
            pathname: '/'
        })
    }

    function handleClickCart() {
        router.push({
            pathname: '/cart'
        })
    }

    return (

        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href="#home" onClick={handleClickHome}>
                <FontAwesomeIcon icon={faFilm} size="2x" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Search></Search>

                <Nav className="ml-auto">

                </Nav>

                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/account/orders">Orders</Dropdown.Item>
                        <Dropdown.Item href="/account/settings">Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="/login">Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <NoSsr>
                    <IconButton onClick={handleClickCart} aria-label="cart">
                        <StyledBadge badgeContent={qty} color="secondary">
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" style={{color: "white"}} />
                        </StyledBadge>
                    </IconButton>
                </NoSsr>

            </Navbar.Collapse>
        </Navbar>
    );
}
