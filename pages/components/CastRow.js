import { useRouter } from 'next/router'
import {image} from '../../public/no_photo.svg'
import {useGetMovieCast} from '../api/Service'
import CastCard from '../components/CastCard'

export default function CastRow({id}) {

    const router = useRouter()
    const { data, error } = useGetMovieCast(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    return (
        <div className="cast-row-container">
            {data.map(cast => (
                <CastCard key={cast.id} cast={cast} />
            ))}
        </div>
    );
}