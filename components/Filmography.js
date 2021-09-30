
import {useGetFilmography} from '../pages/api/Service'
import ResultRow from '../components/ResultRow'
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Filmography({id}) {
    //const { id, title, year, director, poster, plot, runtime, language, background } = movie

    const { data, error } = useGetFilmography(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <div className="loading-container"><CircularProgress/></div>

    return (
        <div className="filmography">
            <h2>Filmography</h2>

            {data.content.map(movie => (
                <ResultRow key={movie.id} content={movie}></ResultRow>
            ))}

        </div>
    );

}