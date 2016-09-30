










    // Clicking team Buttons
    function displayGifs() {
        var team = $(".form-control").val().trim();
        var queryURL = " https://api.giphy.com/v1/gifs/search?q=" + team + "&api_key=dc6zaTOxFJmzC&limit=4";

        // Creates AJAX call for the specific team 
        $.ajax({
            url: queryURL,
            method: 'GET'
        })

        .done(function(response) {
            console.log(response);

            var results = response.data;
            for (var i = 0; i < results.length; i++) {
                var teamDiv = $('<div>');
                teamDiv.addClass('col-lg-3');
    
                var teamImage = $('<img>');
                teamImage.attr('src', results[i].images.fixed_height_still.url);
                teamImage.addClass('teamGif');
                teamImage.attr('data-state', "still");
                teamImage.attr('data-still', results[i].images.fixed_height_still.url);
                teamImage.attr('data-animate', results[i].images.fixed_height.url);

                $('#gifsWell').empty();
                teamDiv.append(teamImage);
                $('#gifsWell').prepend(teamDiv);
            }

        });
    }

    // // Generic function for displaying team data
    // function renderButtons() {
    //     // Deletes the teams prior to adding new teams (this is necessary otherwise you will have repeat buttons)
    //     $('#dynamicButtons').empty();
    //     // Loops through the array of teams
    //     for (var i = 0; i < teams.length; i++) {
    //         // Then dynamicaly generates buttons for each team in the array
    //         // Note the jQUery syntax here...
    //         var a = $('<button>'); // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
    //         a.addClass('team'); // Added a class
    //         a.addClass('btn btn-default');
    //         a.attr('data-name', teams[i]); // Added a data-attribute
    //         a.text(teams[i]); // Provided the initial button text
    //         $('#dynamicButtons').append(a); // Added the button to the HTML
    //     }
    // }

    function pauseGifs() {
        var state = $(this).attr('data-state');

        if (state == "still") {
            $(this).attr('src', $(this).data('animate'));
            $(this).attr('data-state', 'animate');

        } else {
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }

    }

    // // ========================================================
    // // This function handles events where one button is clicked
    // $('#submitBtn').on('click', function() {
    //     // This line of code will grab the input from the textbox
    //     var team = $('.form-control').val().trim();
    //     // The team from the textbox is then added to our array
    //     teams.push(team);
    //     // Our array then runs which handles the processing of our team array
    //     renderButtons();

    //     // We have this line so that users can hit "enter" instead of clicking on ht button and it won't move to the next page
    //     return false;


    // });
    
    // ========================================================
    // This calls the renderButtons() function
    // $(document).on('click', '#submitBtn', displayGifs);
    $(document).on('click', '#dynamicButtons button', displayGifs);
    // renderButtons();
    $(document).on('click', '.teamGif', pauseGifs);