import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';

import { useRouter } from 'next/router'
import {useGetCast} from '../api/Service'
import Navigation from '../components/Navbar'
import ResultRow from '../components/ResultRow'
import {useGetFilmography} from '../api/Service'
import Filmography from '../components/Filmography'

export default function Cast() {
    //const { id, title, year, director, poster, plot, runtime, language, background } = movie
    const router = useRouter()
    console.log(router.query['id'])

    const { data, error } = useGetCast(router.query['id'])
    // const { data, error } = useGetMovieId("tt0468569")

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>
    

    const { starId, name, birthYear, photo, bio, birthName, birthDetails, dob, place_of_birth, dod, movies} = data


    return (
        <body>

            <Navigation></Navigation>

            <div className="cast-container">
                <div className="cast-row-1">

                    <div className="cast-image-row">
                        <img
                            id="cast-photo"
                            src='/no_photo.svg'
                            alt="Not Found"
                        >
                        </img>
                    </div>

                    <div className="cast-information">
                        <h2 className="cast-name">
                            {name}  <small>({birthYear})</small>
                        </h2>

                        <p className="cast-headline-row1">
                            Born {birthDetails}
                        </p>

                        <p className="cast-headline-row2">
                            {bio}
                        </p>

                    </div>
                </div>

                <div className="cast-row-2">
                    <Filmography id={starId}> </Filmography>
                </div>
            </div>


        </body>

    );
}