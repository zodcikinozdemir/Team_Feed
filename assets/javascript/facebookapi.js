// Facebook App Token
var token = "627047640810455|45zQTmaJMlTO45dEj2hOqNUtAug";

var teamArr = [];
$(document).ready(function() {
	stattleshipSearch();
});

$(document).on("click", "#dynamicButtons button", function() {
	var page_id = $(this).data("page_id");

	var plugin = "https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/";
	var timeline = $("<iframe></iframe>");
	
	// Page Plugin Configuration
	var tabs = "tabs=timeline";
	var width = "500";
	var height = "500";
	var cover = "hide_cover=true";
	var small_header = "small_header=true";
	var friends = "show_facepile=false";
	var source = buildURL(plugin, page_id, tabs, width, height, cover, small_header, friends);
	
	// Timeline (Posts) 
	timeline.attr("src", source);
	timeline.attr("width", width);
	timeline.attr("height", height);
	timeline.attr("style", "border:none;overflow:hidden");
	timeline.attr("scrolling", "no");
	timeline.attr("frameborder", "0");
	timeline.attr("allowTransparency", "true");
	$("#newsWell").empty();
	timeline.appendTo("#newsWell");

	//Events (Upcoming) 
 	var events = timeline.clone();
 	tabs = "tabs=events";
 	source = buildURL(plugin, page_id, tabs, width, height, cover, small_header, friends);
 	events.attr("src", source);
 	$("#eventsWells").empty();
 	events.appendTo("#eventsWells");

 	//console.log($(this).attr("id"));
 	teamColor($(this).attr("id"));
	 	 	
});

// $(document).on("mouseover", ".glyphicon", function() {
// 	$(this).css("color", "black");
// });

// $(document).on("click", ".glyphicon", function() {
// 	$(this).remove()
// });

$(".form-control").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "https://crossorigin.me/http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});

$("#submitBtn").on("click", function() {
	var team = $(".form-control").val();
	var team_id;

	ajaxFacebook(team);
	teamColor(team);

	var searchTerm = $(".form-control").val().trim();
	
	$.ajax({
	    type: "GET",
	    url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+searchTerm+"&callback=?",
	    contentType: "application/json; charset=utf-8",
	    async: false,
	    dataType: "jsonp",
	    success: function (data, textStatus, jqXHR) {
	    

		var markup = data.parse.text["*"];

		// $('#socialMediaWell').append(markup);

		var i = $('<div></div>').html(markup);
		
		// remove links as they will not work
		i.find('a').each(function() { $(this).replaceWith($(this).html()); });
		
		// remove any references
		i.find('sup').remove();
		
		// remove cite error
		i.find('.mw-ext-cite-error').remove();
		
		$('#wikiWell').append($(i).find('p'));
			
		
	    },
	    error: function (errorMessage) {
	    }

	});
	return false;
});

function teamObj(color, name, id) {
	var team = {
		color: color,
		name: name,
		id: id
	};

	return team;
}

function stattleshipSearch() {

	var urlArr = [];
	var nflTeams = "https://api.stattleship.com/football/nfl/teams";
	var mlbTeams = "https://api.stattleship.com/baseball/mlb/teams";
	var nbaTeams = "https://api.stattleship.com/basketball/nba/teams";
	var nhlTeams = "https://api.stattleship.com/hockey/nhl/teams";

	urlArr.push(nflTeams);
	urlArr.push(mlbTeams);
	urlArr.push(nbaTeams);
	urlArr.push(nhlTeams);

	ajaxStattleship(urlArr);

	console.log(teamArr);

};

function teamColor(team) {
	for(var i = 0; i < teamArr.length; i++) {
		var teamObj = teamArr[i];
		if(team.toLowerCase() == teamObj.name.toLowerCase()) {
			console.log(teamObj.color);
			$('.navbar').css("background-color", "#" + teamObj.color);
			return;
		}
	}
}


function ajaxStattleship(urlArr) {
	for(var i = 0; i < urlArr.length; i++) {
		$.ajax({
			url: urlArr[i],
			method: "GET",
			headers: {
		      "Authorization": "Token token=b1ab3c93495c159d440885c2a6a92430",
		      "Accept": "application/vnd.stattleship.com; version=1",
		      'Content-Type': 'application/json',
		    },
		    async: false,
			// data: {'Authorization': 'Token token=b1ab3c93495c159d440885c2a6a92430',
			// 		'Content-Type': 'application/json',
			// 		'Accept': 'application/vnd.stattleship.com; version=1'},
			success: function(data) {
				console.log(data);
				for(var i = 0; i < data.teams.length; i++) {
					var team = data.teams[i];
					var location = team.location;
					var name = team.nickname;
					var full_name = location + " " + name;
					var color = team.color;
					var team_id = team.slug;

					console.log(team_id);

					teamArr.push(teamObj(color, full_name, team_id));

				}
				
			},
			error: function(data){
				console.log(data); // send the error notifications to console
			}

		});
	}

	//console.log(teamArr);
}


function ajaxFacebook(team) {
	var team_id;

	$.ajax({

		url: 'https://graph.facebook.com/search',
		dataType: 'jsonp',
		type: 'GET',
		data: {q: team, type: 'page', 'fields': "name, category, posts", access_token: token},
		success: function(data){
			console.log(data);
			for(i = 0; i < data.data.length; i++) {
				if(data.data[i].category.toLowerCase() == "sports team") {
				console.log(data.data[i].name + " : " + data.data[i].id);
				if(team.toLowerCase().trim() == data.data[i].name.toLowerCase().trim()) {
					team_id = data.data[i].id;
					break;
				}
				}
			}

			if(!team_id) {
				console.log("No team exists");
				return;
			}

			console.log("DONE");

			var teamBtn = $("<button></button>");
	 	 	teamBtn.addClass("btn btn-danger btn-sm");
	 	 	teamBtn.attr("id", team);
	 	 	teamBtn.data("page_id", team_id);
	 	 	teamBtn.appendTo("#dynamicButtons");
	 	 	teamBtn.text(team);
	 	 	// var deleteIcon = $("<span></span>");
	 	 	// deleteIcon.addClass("glyphicon glyphicon-remove");
	 	 	// deleteIcon.attr("aria-hidden", "true");
	 	 	// deleteIcon.appendTo(teamBtn);
	 	 	// deleteIcon.css("padding-left", "7px");

			var plugin = "https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/";
			var timeline = $("<iframe></iframe>");
			
			// Page Plugin Configuration
			var tabs = "tabs=timeline";
			var width = "500";
			var height = "500";
			var cover = "hide_cover=true";
			var small_header = "small_header=true";
			var friends = "show_facepile=false";
			var source = buildURL(plugin, team_id, tabs, width, height, cover, small_header, friends);
			
			// Timeline (Posts) 
			timeline.attr("src", source);
			timeline.attr("width", width);
			timeline.attr("height", height);
			timeline.attr("style", "border:none;overflow:hidden");
			timeline.attr("scrolling", "no");
			timeline.attr("frameborder", "0");
			timeline.attr("allowTransparency", "true");
			$("#newsWell").empty();
			timeline.appendTo("#newsWell");

			//Events (Upcoming) 
	 	 	var events = timeline.clone();
	 	 	tabs = "tabs=events";
	 	 	source = buildURL(plugin, team_id, tabs, width, height, cover, small_header, friends);
	 	 	events.attr("src", source);
	 	 	$("#eventsWells").empty();
	 	 	events.appendTo("#eventsWells");
	 	 	
		},
		error: function(data){
			console.log(data); // send the error notifications to console
		}
	});

}

// Build url with settings for iframe src
function buildURL(plugin, id, tabs, width, height, cover, small_header, friends) {
	var url = "";
	url = plugin + id + '&' + tabs + '&' + 'width=' + width + '&' + 'height=' + height + '&' + cover + '&' + small_header + '&' + friends;
	console.log(url);
	return url;
}