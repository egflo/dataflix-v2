
import {useGetMovieMeta} from '../api/Service'
import MovieCard from '../components/MovieCard'

export default function CardRow({meta}) {

    const {path,title} = meta

   // const { data, error } = useGetMovieMeta("/order/sellers")
    const { data, error } = useGetMovieMeta(path)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    return (
        <div className="card-row">
            <h1 className="card-row-title">{title}</h1>
            <div className="card_container">
                {data.content.map(meta => (
                    <MovieCard key={meta.movieId} meta={meta} />
                ))}
            </div>

        </div>
    )
}