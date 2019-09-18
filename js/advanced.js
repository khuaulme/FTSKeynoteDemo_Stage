// Get movie titles from STITCH DATA API
//const getTitles = async () => {
    // CALLING get-movies-titles SERVICE  -- to be used for autocomplete
    //const res = await fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/fts-advanced-gpwko/service/getTitles/incoming_webhook/getTitles');
   //const titles = await res.json();
//    console.log("Number of titles: " + titles.length);

//    autocomplete(document.getElementById("myInput"), titles);

//};

//autocomplete set to false by default.
//If user selects a typed-ahead title, ac_selected flag set to true in autocomplete.js line 36
let ac_selected = false;
// ADDED 9/18 ---------------------
autocomplete(document.getElementById("myInput"), titles);

const userActionAll = async () =>
{
    console.log("IN USER ACTION ALL");
    //   console.log("Movie titles: " + movie_titles.length);
    let searchString = document.getElementById('myInput').value;
    let txt = "";
    let webhook_url = "";
    console.log(searchString);

    if (ac_selected) {
        // CALLING movies-titles-FTS SERVICE
        webhook_url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/advancedftsdemo-wstfr/service/movies-titles-FTS/incoming_webhook/movies-titles-FTS";
    } else {
        // CALLING movies_fuzzy_FTS SERVICE
         webhook_url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/advancedftsdemo-wstfr/service/movies-fuzzy-FTS/incoming_webhook/movies-fuzzy-FTS";
    }
    let url = webhook_url + "?arg=" + searchString;

    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (moviesJSON) {
        console.log("My AC value is: " + ac_selected + "!");
        if (moviesJSON["$undefined"] === true) {
            console.log('NO FETCH RESULT');
            txt += `<br><br><br><b><h3>IMPLEMENT FULL TEXT SEARCH AGGREGATION TO SEARCH MOVIE COLLECTION</h3></b>`;
        } else {
            if (moviesJSON.length !== 0) {
                txt = buildMoviesDisplay(moviesJSON);
            }
        }  // end of ELSE

        document.getElementById("movieResults").innerHTML = txt;
    });
}


function buildMoviesDisplay(movieList){

    console.log("IN BUILDMOVIESDISPLAY");

    // CREATE BEST MATCH ENTRY
    buildBestMatch(movieList[0]);

    // BUILDING OUT CARDS FOR OTHER MOVIE MATCHES

    let poster;

    let txt=   `<hr><div class="row">`;                     // BEGINNING OF TXT DEFINITION

    for (let i= 1; i < movieList.length; i++) {

        if (movieList[i].poster){
            poster =movieList[i].poster;
        } else {
            poster="public/noposter.jpg";
        }


        let txt_plot = buildTextPlot(movieList[i]);

        txt +=   `<div class="col-lg-3 col-md-6 mb-lg-0 mb-4">
        <!-- Card -->
        <div class="card card-cascade narrower card-ecommerce">
        <!-- Card image -->
        <div class="view view-cascade overlay">
            <img src=${poster} alt="Card image cap" class="card-img-top"
            alt="sample photo">
            <a>
            <div class="mask rgba-white-slight"></div>
            </a>
        </div>
        <!-- Card image -->
        <!-- Card content -->
        <div class="card-body card-body-cascade text-center">
            <!-- Category & Title -->
            <a href="" class="grey-text">
            <h5 style="color: green;">Score: ${movieList[i].score["$numberDouble"]}</h5>
            </a>
            <h4 class="card-title">
            <strong>
                <a href="" style="color:black;">${movieList[i].title}</a>
            </strong>
            </h4>
        
            <!-- Description -->
            <p class="card-text">${txt_plot} </p>
            <!-- Card footer -->
            <div class="card-footer px-1">
            <span class="float-left font-weight-bold">
                <strong>9$</strong>
            </span>
            <span class="float-right">
                <a data-toggle="tooltip" data-placement="top" title="Add to Cart">
                <i class="fas fa-shopping-cart grey-text ml-3"></i>
                </a>
                <a data-toggle="tooltip" data-placement="top" title="Share">
                <i class="fas fa-share-alt grey-text ml-3"></i>
                </a>
                <a class="active" data-toggle="tooltip" data-placement="top" title="Added to Wishlist">
                <i class="fas fa-heart ml-3"></i>
                </a>
            </span>
            </div>
        </div>
        <!-- Card content -->
        </div>
        <!-- Card -->                
    </div>`;                // END OF TXT DEFINITION
    }                       // END OF FOR LOOP

    return txt;
}

// helper function for buildMoviesDisplay(). Builds the card for the best matched movie.
function buildBestMatch (bestMatchedMovie) {
    let first_plot =  buildTextPlot(bestMatchedMovie);

    let poster;
    if (bestMatchedMovie.poster == null) {
        poster = "public/noposter.jpg";
    } else
        poster = bestMatchedMovie.poster;
    document.getElementById("first-image").innerHTML = `<img src=${poster} class="img-fluid " height:300px;>`;

    let first_txt = `<b><h2>BEST MATCH</h2><br><h4 style="color: green;">Score:  ${bestMatchedMovie.score["$numberDouble"]} </h4></b><br>
        <b>${bestMatchedMovie.title }</b><br>
        Year: ${bestMatchedMovie.year["$numberInt"]} <br><br>
        ${first_plot}<br><br>`;
    document.getElementById("first-description").innerHTML = first_txt;
}

// helper function for buildMoviesDisplay() and buildBestMatch. Builds the plot field with the HIGHLIGHTS
function buildTextPlot (moviePlot){
    console.log("IN BUILD TEXT PLOT!");

    let j;
    let k = 0;

    let txt = "";
    let highlight_length = moviePlot.highlight.length;

    if (ac_selected || (highlight_length === 0))    // NO NEED FOR HIGHLIGHTS SINCE IT IS MATCHED THROUGH AUTOCOMPLETE
    {
        if (moviePlot.fullplot == null) {               // FULLPLOT IS UNDEFINED
            if (moviePlot.plot == null){
                return `NO PLOT PROVIDED`;
            } else {
                return `<br>${moviePlot.plot}`;
            }
        }
        else                                          // FULL PLOT IS DEFINED
            txt += `<br>${moviePlot.fullplot}`;
    }
    else {                                          // BUILD HIGHLIGHTS -- NOT AUTO-COMPLETED SO BUILD HIGHLIGHTS
        for (j = 0; j < highlight_length; j++) {
            for (k = 0; k < moviePlot.highlight[j].texts.length; k++) {
                if (moviePlot.highlight[j].texts[k].type === "hit") {
                     txt += `<b><mark> ${moviePlot.highlight[j].texts[k].value} </mark></b>`;
                } else {
                    txt += moviePlot.highlight[j].texts[k].value;
                }
            } // end of k
        }  // end of j
    }
    return txt;
}


//window.addEventListener('DOMContentLoaded', getTitles);



