import { useRouter } from 'next/router'
import {image} from '../public/no_photo.svg'
import {useGetMovieCast} from '../pages/api/Service'
import CastCard from '../components/CastCard'
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CastRow({id}) {

    const router = useRouter()
    const { data, error } = useGetMovieCast(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div className="cast-row-container">
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    return (
        <div className="cast-row-container">
            {data.map((cast,index) => (
                <CastCard key={cast.id} cast={cast} />
            ))}
        </div>
    );
}