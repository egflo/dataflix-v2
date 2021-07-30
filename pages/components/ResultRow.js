
import { useRouter } from 'next/router'
import Rating from '@material-ui/lab/Rating';


export default function ResultRow({content}) {

    const { id, title, year, director, poster, plot, runtime, language, background, rated, cast, ratings, genres, writer, production} = content

    const router = useRouter()

    function handleClick() {
        router.push({
            pathname: '../components/Movie',
            query: { id: id },
        })
    }
    
    function numFormatter(num) {
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
        }else if(num > 1000000){
            return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
        }else if(num < 900){
            return num; // if value < 1000, nothing to do
        }
    }

    function rating () {

        try {
            var numVotes = ratings['numVotes'];
            var rating = ratings['rating'];
        } catch (error) {
            console.error(id);
        }
        
        if(numVotes == null) {
            numVotes = 0
            rating = 0
        }

        return (
            <div className="movie_rating-row">
                <Rating
                    name="read-only"
                    value={rating * .5}
                    precision={0.5}
                    size="medium"
                    readOnly />

                <p> ({numFormatter(numVotes)} votes)</p>
            </div>
        );
    }

    return (
        <div onClick={handleClick} className="content-row">
            <div className="movie-row-image">
                <img src={poster} alt="Not Found" width="100%"></img>
            </div>

            <div className="movie-column-1">
                <h2 className="movie-row-title">
                    {title}
                </h2>

                <p className="movie-row-subheadline">
                    {year} - {rated} - {runtime}
                </p>

                {rating()}

                <p className="movie-row-plot">
                    {plot}
                </p>

            </div>

        </div>
    );
}