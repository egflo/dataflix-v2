
import { useRouter } from 'next/router'
import {useGetMovieId} from '../api/Service'

export default function MovieCard({ meta }) {

    var { data, error } = useGetMovieId(meta['movieId'])

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    const { title, plot, id, poster, rated, runtime, year } = data

    const router = useRouter()

    function handleClick() {
        console.log(id)
        router.push({
            pathname: '../components/Movie',
            query: { id: id },
        })
    }

    return (
        <div className="movie_card">
            <div className="card-image">
                <img src={poster} alt="Not Found"></img>
            </div>

            <h3 className="card-title">
                {title}
            </h3>

            {/* A JSX comment

            <p className="card-body">
                {year} - {rated} - {runtime}
            </p>

            */}
            <button className="card-button" onClick={handleClick}>
                <h3>View Details</h3>
            </button>
        </div>
    );
}