var token = "627047640810455|45zQTmaJMlTO45dEj2hOqNUtAug";

$("#submitBtn").on("click", function() {
	var team = $(".form-control").val();
	var team_id;

	ajaxCall(team);
});

function ajaxCall(team) {
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