import { useRouter } from 'next/router'
import {image} from '../../public/NOPHOTO.svg'
import {useGetMovieCast} from '../../service/Service'
import CastCard from './CastCard'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        //minWidth: '460px',
        //maxWidth: '805px',

        [theme.breakpoints.down('sm')]: {
            height: '100%',
            width: '100vw',
            overflow: 'auto',
            whiteSpace: 'nowrap',
            backgroundColor: 'white',
            paddingLeft: '5px',
        },

        [theme.breakpoints.up('md')]: {
            height: '100%',
            width: '805px',
            overflow: 'auto',
            whiteSpace: 'nowrap',
            backgroundColor: 'white',
            //marginLeft: '10px',
            //marginRight: '10px',
        },
    },
}));



export default function CastRow({id}) {
    const classes = useStyles();
    const { data, error } = useGetMovieCast(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div className="loading-container"><CircularProgress/></div>
    );

    return (
        <div className={classes.container}>
            {data.map((cast,index) => (
                <CastCard key={index} cast={cast}/>
            ))}
        </div>
    );
}