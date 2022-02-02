

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
    }
};

function storeImages(localStoredImages) {
    let requestOptions =  {
        method: 'put', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ images : localStoredImages })
    }

    fetch(`http://localhost:3000/`, requestOptions)
    .then(response => {
        if(response.ok){
            return response.json()
        }
    })
};

