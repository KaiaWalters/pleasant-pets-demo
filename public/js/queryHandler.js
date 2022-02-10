// loadMoreButton = document.getElementsByClassName("body_load-more") 
// cards = document.getElementsByClassName()


// loadMoreButton.addEventListener('click', (event) => {
//     //check number of results in array

//     //add 5 to number of results
//     //add number to query param in url
    
// })


function loadMore(count) {
    count+=5
    let QueryString = window.location.href;
    let modifiedQueryString

    if(QueryString.includes("?limit=")){
        var regex = "limit=[0-9]+";
        var match = QueryString.match(regex).toString() //should return limit=10
        modifiedQueryString = QueryString.replace(`?${match}`,`?limit=${count}`)

        console.log(modifiedQueryString)
    } else {
        modifiedQueryString = QueryString.concat(`?limit=${count}`)
    }
   
    window.location.href = modifiedQueryString
}