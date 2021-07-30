import { useRouter } from 'next/router'
import {image} from '../../public/no_photo.svg'
import {useGetMovieReviews} from '../api/Service'
import ReviewCard from '../components/ReviewCard'

export default function ReviewRow({id}) {

    const router = useRouter()
    const { data, error } = useGetMovieReviews(id)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    function reviews () {
        const length = data.content.length

        if(length > 0) {
            return (
                <div className="review-container">
                    {data.content.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            );
        }
        else {

            return (
                <div className="review-alert">
                    <h3>No Reviews Posted For This Film</h3>
                </div>
            );
        }
    }

    return reviews()
}