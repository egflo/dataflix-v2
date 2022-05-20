
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import useSWR, { mutate } from 'swr'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faStar } from '@fortawesome/free-regular-svg-icons'
import Rating from '@material-ui/lab/Rating'
import {axiosInstance} from "../../service/Service";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    card: {
        background: 'white',
        borderRadius: '5px',
        minWidth: '600px',
        maxWidth: '600px',
        padding: '15px',
        zIndex: theme.zIndex.drawer + 1,
    },

    rateMovie: {
        zIndex: theme.zIndex.drawer + 1,
        '& > *': {
            padding: '0',
        },
    },

}));

const schema = yup.object().shape({
    movie: yup.string()
        .required("Movie is required."),
    title: yup.string()
        .required("Title is required."),
    text: yup.string()
        .required("No text was inserted."),
    rating: yup.number()
        .required('Rating is required.')
    //.min(1),
});


export default function ReviewCardDetailed({items}) {
    const classes = useStyles();
    const ref = useRef(null);
    const [type, setType] = useState("Dictamen");
    const [rating, setRating] = useState(0);
    const [state, setState] = useState({
        openSnack: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, openSnack } = state;
    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Review Added'
    });

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setState({ ...state, openSnack: false });
    };

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && open) {
                setOpen(!open);

            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, open]);

    async function handleSubmit(values) {
        const userId = localStorage.getItem("id");
        values['movieId'] = id;
        values['customerId'] = userId;

        const form_object = JSON.stringify(values, null, 2);
        console.log(form_object);

        axiosInstance.put('/review/', values)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    setState({ ...state, openSnack: true });
                    mutate("/movie/" + id);
                    setAlert({
                        type: 'success',
                        message: 'Review Added.'
                    })
                }
                else {
                    setAlert({
                        type: 'error',
                        message: 'Review not added.'
                    })
                }
            }) .catch(err => {
                setAlert({
                    type: 'error',
                    message: err.message
                })
            });
        }

    let initalValues = {
        text: "",
        rating: 0,
        title: "",
        movie: "",
    }

    return (
        <>
            <Button onClick={handleToggle} className="btn-block" variant="primary" size="md">
                Write a Review
            </Button>

            <Backdrop className={classes.backdrop}  open={open}>
                <div className={classes.card} ref={ref}>
                    <Formik
                        validationSchema={schema}
                        initialValues={initalValues}
                        onSubmit={async (values) => {

                            setLoading(true);
                            await new Promise((r) => setTimeout(r, 500));
                            handleSubmit(values);
                            setLoading(false);
                        }}
                    >{({
                           handleSubmit,
                           handleChange,
                           handleBlur,
                           values,
                           touched,
                           isValid,
                           errors,
                       }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="justify-content-center">
                                <Row className="justify-content-center">
                                    <Form.Group as={Col} md="11" controlId="formBasicSelect">
                                        <Form.Control
                                            as="select"
                                            name="movie"
                                            value={type}
                                            isValid={touched.movie && !errors.movie}
                                            isInvalid={!!errors.movie}
                                            feedback={errors.movie}
                                            onChange={e => {
                                                console.log("e.target.value", e.target.value);
                                                setType(e.target.value);
                                            }}
                                        >
                                            <option value="">Select a item</option>
                                            {items.map(item => (
                                                <option value={item.movieId} key={item.movieId}>{item.movieId}</option>
                                            ))}

                                        </Form.Control>

                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.movie}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Form.Group as={Col} md="11" controlId="validationFormik02">
                                    <Rating
                                        placeholderRating={0}
                                        max={10}
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue);
                                            values.rating = newValue;
                                        }}
                                        emptySymbol={<FontAwesomeIcon icon={faStar} size="lg" style={{color:"#aaa"}} />}
                                        fullSymbol={<FontAwesomeIcon icon={faStar} size="lg" style={{color:"#ffd200"}} />}
                                        placeholderSymbol={<FontAwesomeIcon icon={faStar} size="lg" style={{color:"#aaa"}} />}
                                        isValid={touched.rating && !errors.rating}
                                        isInvalid={!!errors.rating}
                                        feedback={errors.rating}
                                    />

                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.rating}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="justify-content-center">
                                <Form.Group as={Col} md="11" controlId="validationFormik03">
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Title.."
                                        value={values.title}
                                        onChange={handleChange}
                                        isValid={touched.title && !errors.title}
                                        isInvalid={!!errors.title}
                                        feedback={errors.title}

                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="justify-content-center">
                                <Form.Group as={Col} md="11" controlId="validationFormik04">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        type="textarea"
                                        name="text"
                                        placeholder="Text.."
                                        value={values.text}
                                        onChange={handleChange}
                                        isValid={touched.text && !errors.text}
                                        isInvalid={!!errors.text}
                                        feedback={errors.text}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.text}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="justify-content-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                {loading ? <CircularProgress/> : null}
                            </Row>
                        </Form>
                    )}
                    </Formik>
                </div>
            </Backdrop>

            <Snackbar
                open={openSnack}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                key={vertical + horizontal}
                onClose={handleClose}>

                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}