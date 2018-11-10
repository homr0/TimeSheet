// Initialize Firebase
var config = {
    apiKey: "AIzaSyCDDScA5oWY69O8VlFgyXxCa0L5I_ZCp38",
    authDomain: "timesheet-3598e.firebaseapp.com",
    databaseURL: "https://timesheet-3598e.firebaseio.com",
    projectId: "timesheet-3598e",
    storageBucket: "timesheet-3598e.appspot.com",
    messagingSenderId: "155916013814"
};

firebase.initializeApp(config);

var database = firebase.database();

// Function for getting the months worked
function getMonths(startDate) {
    // Get the current date
    var now = moment();
    var start = moment(startDate, "YYYY-MM-DD");

    // Gets the number of years between the two dates
    let years = now.year() - start.year();
    let months = (now.month() - start.month()) + (years * 12);

    // If the start day is earlier than the current day, then subtract a month
    if(now.date() < start.date()) {
        return months - 1;
    } else {
        return months;
    }
}

// Capture Button Click
$("#click-button").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    var employee = $("#employee").val().trim();
    var role = $("#role").val().trim();
    var startDate = $("#date").val().trim();
    var monthlyRate = $("#rate").val().trim();

    // Code for "Setting values in the database"
    database.ref().push({
        employee: employee,
        role: role,
        startDate: startDate,
        monthlyRate: monthlyRate
    });

    //Clear Input Fields
    $("#employee").val("");
    $("#role").val("");
    $("#date").val("");
    $("#rate").val("");
    
});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function (snapshot) {

    // Log everything that's coming out of snapshot
    /*
    console.log(snapshot.val());
    console.log(snapshot.val().employee);
    console.log(snapshot.val().role);
    console.log(snapshot.val().startDate);
    console.log(snapshot.val().monthlyRate);
    */

    //Data for New Child in Database
    var addedEmployee = snapshot.val().employee;        //Newly Added Employee's Name
    var addedRole = snapshot.val().role;        //Newly Added Employee's Role
    var addedDate = snapshot.val().startDate;   //Newly Added Employee's Start Date
    var addedRate = snapshot.val().monthlyRate; //Newly Added Employee's Monthly Rate
    var months = getMonths(addedDate);      //Use Get Months Function to get how Many Months Since New Employee Start Date
    var pay= months*addedRate;              //Times Months Worked by Rate to get Total Billed

    //New Row in the Output Table
    var newRow=$("<tr>");

    //Append Each Piece of Data to Row in Same Order as the Table Headers in HTML File
    $(newRow).append("<td>"+addedEmployee+"</td>");
    $(newRow).append("<td>"+addedRole+"</td>");
    $(newRow).append("<td>"+addedDate+"</td>");
    $(newRow).append("<td>"+months+"</td>");
    $(newRow).append("<td>"+addedRate+"</td>");
    $(newRow).append("<td>"+pay+"</td>");

    //Append New Row to Table Body
    $("#timeTableRows").append(newRow);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});