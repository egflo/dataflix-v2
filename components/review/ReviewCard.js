import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Form from 'react-bootstrap/Form'
import { Formik, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import  React, {useRef, useState, useEffect} from 'react';
import { Button, Row, Col} from 'react-bootstrap';
import useSWR, { mutate } from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faStar } from '@fortawesome/free-regular-svg-icons'
import IconButton from "@material-ui/core/IconButton";
import Rating from '@material-ui/lab/Rating'
import {getUserId} from "../../utils/helpers";
import {
    Box,
    Backdrop,
    Card,
    CardContent,
    CardHeader,
    Divider}
    from "@mui/material";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    card: {
        background: 'white',
        borderRadius: '5px',
        minWidth: '600px',
        maxWidth: '600px',
        padding: '15px',
    },

    rateMovie: {
        '& > *': {
            padding: '0',
        },
    },

}));

const schema = yup.object().shape({
    title: yup.string()
        .required("Title is required."),
    text: yup.string()
        .required("No text was inserted."),
    rating: yup.number()
        .required('Rating is required.')
        //.min(1),
});


export default function ReviewCard(props) {
    const classes = useStyles();
    const formikRef = useRef(null);
    const ref = useRef(null);
    const [rating, setRating] = useState(0);
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

    // useOutsideAlerter(ref, open)
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && open) {
                setOpen(!open);
                handleReset();
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
        const token = localStorage.getItem("token")
        values['movieId'] = props.id;
        values['customerId'] = getUserId();
        const form_object = JSON.stringify(values, null, 2);
        console.log(form_object);
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: form_object
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/review/', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            await mutate("/movie/");
            props.setalert({
                open: true,
                type: 'success',
                message: 'Review Added.'
            })

        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Unable to add review. Try again later.'
            })
        }
    }

    let initalValues = {
        text: "",
        rating: 0,
        title: "",
    }

    function ToggleType() {
        if(props.button) {

            return (
                <Button onClick={handleToggle} className="btn-block" variant="primary" size="md">
                    Write a Review
                </Button>
            );

        }
        else {

            return (
                <div classes={classes.rateMovie}>
                    <IconButton onClick={handleToggle} aria-label="rate" >
                        <FontAwesomeIcon icon={faThumbsUp} size="lg" style={{color: "#0d6efd"}} />
                    </IconButton>
                </div>
            );
        }
    }

    function handleReset() {
        setRating(0);
        formikRef.current.resetForm();
    }
    return (
        <div>
            <ToggleType></ToggleType>
            <Backdrop className={classes.backdrop}  open={open}>
                    <Card className={classes.card} ref={ref}>
                        <CardHeader title="Write a Review" subheader="Information can be edited" />
                        <Divider />
                        <CardContent>
                            <Formik
                                innerRef={formikRef}
                                validationSchema={schema}
                                validateOnChange={false}
                                validateOnBlur={false}
                                initialValues={initalValues}
                                onSubmit={async (values) => {

                                    setLoading(true);
                                    await new Promise((r) => setTimeout(r, 500));
                                    await handleSubmit(values);
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
                                        <Form.Group as={Col} md="12" controlId="validationFormik01">
                                            <Form.Label><b>Overall rating</b></Form.Label>
                                            {<br></br>}
                                            <Rating
                                                max={10}
                                                value={rating}
                                                onChange={(event, newValue) => {
                                                    setRating(newValue);
                                                    values.rating = newValue;
                                                }}
                                                onBlur={handleBlur}
                                                name={'rating'}
                                            />

                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.rating}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="justify-content-center">
                                        <Form.Group as={Col} md="12" controlId="validationFormik02">
                                            <Form.Label><b>Add a headline</b></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                placeholder="What's most important to know?"
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
                                        <Form.Group as={Col} md="12" controlId="validationFormik03">
                                            <Form.Label><b>Add a written review</b></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                type="textarea"
                                                name="text"
                                                placeholder="What did you like or dislike?"
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
                                        <Form.Group as={Col} md="12">
                                            <div style={{width: '100%'}}>
                                                <Button className="btn-block" variant="primary" type="submit" disabled={loading}>
                                                    Submit
                                                </Button>
                                                <Button className="btn-block" onClick={handleReset} variant="primary" type="reset">
                                                    Reset
                                                </Button>
                                            </div>
                                        </Form.Group>
                                    </Row>
                                </Form>
                            )}
                            </Formik>
                        </CardContent>
                    </Card>
            </Backdrop>
        </div>
    );
}