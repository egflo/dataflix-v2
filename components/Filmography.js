
import {useGetFilmography} from '../pages/api/Service'
import ResultRow from '../components/ResultRow'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    filmography: {
        width: 0,
        marginTop: '15px',
        marginLeft: '25px',
    },

}));

export default function Filmography({id}) {
    //const { id, title, year, director, poster, plot, runtime, language, background } = movie

    const classes = useStyles();
    const { data, error } = useGetFilmography(id);

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <div className="loading-container"><CircularProgress/></div>

    return (
        <div className={classes.filmography}>
            <h2>Filmography</h2>

            {data.content.map(movie => (
                <ResultRow key={movie.id} content={movie}></ResultRow>
            ))}

        </div>
    );

}