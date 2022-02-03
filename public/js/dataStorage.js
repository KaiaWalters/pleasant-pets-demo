
import ejs from '../../node_modules/ejs/ejs'

window.onload = (event) => { saveImages() };

function saveImages() {

    const storageContents = localStorage.length < 1

    if(storageContents) {
        fetch(`http://localhost:3000/images`, {
            method: 'get', 
            headers: {'Content-Type': 'application/json'},
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            localStorage.setItem('images', JSON.stringify(data))
            let localStoredImages = localStorage.getItem('images')
            storeImages(localStoredImages)
        })
        .catch((err) => {
            console.log(err)
        })

    }else if (!storageContents) {
        console.log("no data needed")
        storeImages(localStorage.getItem('images'))

    }
};

function storeImages(localStoredImages) {
    console.log("I am here")
    ejs.render("index", {array: localStoredImages})

    // let requestOptions =  {
    //     method: 'put', 
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({ images : localStoredImages })
    // }
    // fetch(`http://localhost:3000/`, requestOptions)
    // .then(response => {
    //     if(response.ok){
    //         ejs.render("index", {array: localStoredImages})
    //         return response.json()
    //     }
    // })
};

