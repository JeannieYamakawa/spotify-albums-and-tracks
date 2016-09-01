( function() {
    $( document ).ready( function() {
        bootstrapSpotifySearch();
    } )
} )();


var artistIdNumber;
var outputArea;

function bootstrapSpotifySearch() {
    var userInput, searchUrl, results;
    outputArea = $( "#q-results" ); //div of artist name results

    $( '#spotify-q-button' ).on( "click", function() {
        var spotifyQueryRequest;
        spotifyQueryString = $( '#spotify-q' ).val(); //ARTIST NAME from user input box value
        searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

        spotifyQueryRequest = $.ajax( {
            type: "GET",
            dataType: 'json',
            url: searchUrl
        } ); //this returns the entire object for the artist.


        spotifyQueryRequest.done( function( data ) {
            var artists = data.artists; // huge object with all artists of that search term.
            outputArea.html( '' );

            artists.items.forEach( function( artist ) { //for each artist, make an li for them and make them clickable.
                artistIdNumber = artist.id
                console.log( artistIdNumber )
                var artistLi = $( "<li>" + artist.name + "</li>" )
                artistLi.attr( 'data-spotify-id', artistIdNumber );
                outputArea.append( artistLi );
                artistLi.click( displayAlbumsAndTracks ); // when user clicks the artist name, function to display all artists' albums runs.
            } )
        } );
        spotifyQueryRequest.fail( function( error ) {
            console.log( "Something Failed During Spotify Q Request:" )
            console.log( error );
        } );
    } );
}


// fetches all albums using artist ID in the querystring

function displayAlbumsAndTracks( event ) {
    var albumsRequest = $.ajax( {
        type: "GET",
        dataType: 'json',
        url: "https://api.spotify.com/v1/artists/" + artistIdNumber + "/albums" //will return all info for albums related to that artist
    } );

    albumsRequest.done( function( data ) {
        outputArea.html( '' ); //clears all the bogus artists out of the previous container
        var albums = data.items //returns an array with all albums contained

        albums.forEach( function( item ) {
            var albumName = item.name;
            var albumId = item.id //grabs the album id to use in the release year search
            var albumArt = item.images[ 0 ].url

            //need to do another ajax call with that albumId variable as part of the query string to get the album release date
            var albumDateCall = $.ajax( {
                type: "GET",
                dataType: 'json',
                url: "https://api.spotify.com/v1/albums/" + albumId
            } );

            albumDateCall.done( function( data ) {
                var releaseDate = data.release_date
                var allAlbumsTracks = data.tracks //this returns an object for each album containing an array of tracks(.items)
                var tracks = allAlbumsTracks.items //this returns the array of all the tracks for all the albums
                console.log( tracks )
                var albumInfo = $( "<div>" + albumName + " <div></div>" + releaseDate + "</div>" )
                var imageTag = $( "<div><img src =" + albumArt + " height = '200' width = '200' float = 'right'></div>" )
                albumInfo.attr( 'albums-and-tracks', albumName );
                var albumsDiv = $( "#albums-and-tracks" )
                albumInfo.append( imageTag )
                albumsDiv.append( albumInfo );
                var ol = $( "<ol>" )
                albumsDiv.append( ol )

                for ( var i = 0; i < tracks.length; i++ ) {
                    var trackName = tracks[ i ].name
                    var newLi = $( "<li>" )
                    newLi.text( trackName )
                    console.log( newLi )
                    ol.append( newLi )
                }
            } )


        } )


        //Another ajax call fetches the release date from the album ID


    } )



}
