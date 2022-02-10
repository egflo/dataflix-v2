import { useRouter } from 'next/router'
import {image} from '../../public/no_photo.svg'

export default function CastCard({ cast }) {
    const { starId, category, characters, name, photo} = cast

    const router = useRouter()

    function handleError(event) {
        console.log("error")
        var img = document.getElementById("cast-photo")
        console.log(img)
    }

    function handleClick() {
        console.log(starId)
        router.push({
            pathname: '../components/Cast',
            query: { id: starId },
        })
    }


    function castCategory() {
        if(category != null) {
            let cast_category = category.charAt(0).toUpperCase() + category.slice(1);
            return cast_category;
        }

        else {
            return " "
        }
    }

    function castCharacter() {
        if(characters != null && characters.length != 0) {
            var object = JSON.parse(characters)
            return  object[0]
        }
        else {
            return " "
        }
    }

    return (
        <div onClick={handleClick} className="cast-card">
            <div className="cast-image">
                <img
                    id="cast-photo"
                    src='/no_photo.svg'
                    alt="Not Found"
                    width="100%">
                </img>
            </div>

            <h4 className="cast-title">
                {name}
            </h4>

            <class className="cast-body">
                <p>{castCategory()}</p>
                <p>{castCharacter()}</p>
            </class>

        </div>
    );
}