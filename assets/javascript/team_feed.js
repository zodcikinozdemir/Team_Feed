var config = {
   apiKey: "AIzaSyBfnyqE8RL6yU1kKv0S2g_IAjBCwl68eF8",
   authDomain: "employeesaturday.firebaseapp.com",
   databaseURL: "https://employeesaturday.firebaseio.com",
   storageBucket: "employeesaturday.appspot.com",
   messagingSenderId: "1059478718374"
 };
 firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

// Initial value
var employee = {
	name: "",
	startDate: "",
	role: "",
	rate: "",
	dateAdded: firebase.database.ServerValue.TIMESTAMP
}
var monthsWorked = 0;
var totalBilled = 0;

// Submit Button Click
$("#submitbtn").on("click", function() {

	// Code in the logic for storing and retrieving the most recent employee.
	employee.name = $("#employee-name").val().trim();
	employee.role = $("#employee-role").val().trim();
	employee.startDate = $("#start-date").val().trim();
	employee.rate = $("#monthly-rate").val().trim();

	console.log("employee: " + JSON.stringify(employee));
	
    // Save new value to Firebase
	database.ref().push(employee);

	// Don't refresh the page!
	return false;
});

database.ref().on("child_added", function(childSnapshot) {
	var emp = childSnapshot.val();
	var row = $("<tr>");
	var colName = $("<td>").html(emp.name);
	var colRole = $("<td>").html(emp.role);
	var colstartDate = $("<td>").html(emp.startDate);
	var colRate = $("<td>").html(emp.rate);

	var started = new Date(emp.startDate);
	var todayDate = new Date();

	monthsWorked =  monthDiff(started, todayDate);
	console.log("months worked: " + monthsWorked);

	totalBilled = monthsWorked * parseInt(emp.rate);

	var colMonthsWorked = $("<td>").html(monthsWorked);
	var colTotBilled = $("<td>").html(totalBilled);

	row.append(colName).append(colRole).append(colstartDate).append(colMonthsWorked).append(colRate).append(colTotBilled);
	$("#employee-table").append(row);
});

function monthDiff(d1, d2) {
	var date1 = new moment(d1);
    var date2 = new moment(d2);
    var months = date2.diff(date1, "months");


    console.log ("date1:" + moment(date1).format("MM/DD/YYYY"));
    console.log ("date2:" + moment(date2).format("MM/DD/YYYY"));
    console.log ("diff:" + months);
   return months;
}

// databae.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
// $("namedisplay").html(snapshot.val().name;
// });



