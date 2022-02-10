
import { Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faShoppingCart, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import {useGetUserCart} from '../../service/Service'
import  React, {useRef, useState, useEffect} from 'react';

const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -3,
        top: 5,
        //border: `2px solid ${theme.palette.background.paper}`,
        //padding: '0 4px',
    },
}))(Badge);

export default function CartNotification() {
    const router = useRouter()
    const { data, error } = useGetUserCart("")

    if(!data || error) return (
        <Button
            onClick={() => {
                router.push('/cart')
            }}
            aria-label="cart"
        >
            <FontAwesomeIcon icon={faShoppingCart} size="2x" style={{color: "white"}} />
        </Button>
    );


    const quantity = data.map(li => li.quantity).reduce((sum, val) => sum + val, 0);

    return (
        <Button
            onClick={() => {
                router.push('/cart')
            }}
            aria-label="cart"
        >
            <StyledBadge badgeContent={quantity} color="secondary">
                <FontAwesomeIcon icon={faShoppingCart} size="2x" style={{color: "white"}} />
            </StyledBadge>
        </Button>
    );
}
