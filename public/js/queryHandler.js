
//LoadMore Function: 
//This function is responsible for supplying the user with another set of cards
//to vote on. In our example, this function is passed the current number of card displayed. 
// Then the function is called from the ejs file and quickly executed 
//when the load more button is clicked. 

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