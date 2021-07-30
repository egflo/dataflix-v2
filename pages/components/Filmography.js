
import {useGetFilmography} from '../api/Service'
import ResultRow from '../components/ResultRow'

export default function Filmography({id}) {
    //const { id, title, year, director, poster, plot, runtime, language, background } = movie

    const { data, error } = useGetFilmography(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    return (
        <div className="filmography">
            <h2>Filmography</h2>

            {data.content.map(movie => (
                <ResultRow key={movie.id} content={movie}></ResultRow>
            ))}

        </div>
    );

}