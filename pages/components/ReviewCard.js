import { useRouter } from 'next/router'
import {image} from '../../public/no_photo.svg'

export default function ReviewCard({ review }) {
    const { id, movieId, customerId, text, rating, sentiment,title} = review

    const router = useRouter()

    function reviewRating() {
        var style = {backgroundColor: "lightgray"}

        if (rating > 6) {
            style = {backgroundColor: "#6c3"}
        } else if (rating <= 6 && rating >= 5) {
            style = {backgroundColor: "#fc3"}
        } else {
            style = {backgroundColor: "#f00"}
        }

        return (
            <div style={style} className="review-score">
                <span className="score">{rating}</span>
            </div>
        );
    }

    return (
        <div className="review-card">
            
            <div className="review-header">

                <div className="reviw-title-header">
                    
                    <h4 className="review-title">
                        {title}
                    </h4>

                    <p>By {customerId}</p>

                </div>

                {reviewRating()}
                
            </div>
            
            <hr className="header-review-line"></hr>

            <div className="review-body">
               <p>{text}</p> 
            </div>

        </div>
    );
}