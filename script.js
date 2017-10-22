// Initialize Firebase
var config = {
    apiKey: "AIzaSyB-yfv8klOPl_yaf0QmI2_4ZmB2brmgbig",
    authDomain: "uiucfreestuff.firebaseapp.com",
    databaseURL: "https://uiucfreestuff.firebaseio.com",
    projectId: "uiucfreestuff",
    storageBucket: "uiucfreestuff.appspot.com",
    messagingSenderId: "946860562831"
};
firebase.initializeApp(config);

//Code for documentation on how to use firebase

//Link the attribute to change to an actual html id from html
//var changAble = document.getElementById('testFirebase');
//Reference the "test" directory in the firebase database
//var dbRef = firebase.database().ref().child('testDataBaseValue');
//dbRef.on('value', snap => changAble.innerText = snap.val());

readData();

var ref = firebase.database().ref();
function readData(){


    var playersRef = firebase.database().ref("eventsNew");
    var i =1;
    playersRef.orderByChild("Start Time").on("child_added", function(data) {
        var title, res, date, time, location, description;
        title = data.val().Summary;
        res = data.val()["Start Time"].split("T");
        date = res[0];
        time = res[1].split("-")[0];
        location = data.val().Location;
        description = data.val().Description;
        var table = document.getElementById("tab_logic");

        var eventRow = table.insertRow(i);
        var cell1 = eventRow.insertCell(0);
        var cell2 = eventRow.insertCell(1);
        var cell3 = eventRow.insertCell(2);
        var cell4 = eventRow.insertCell(3);
        var cell5 = eventRow.insertCell(4);
        cell1.innerHTML = title;
        cell2.innerHTML = date;
        cell3.innerHTML = time;
        cell4.innerHTML = location;
        cell5.innerHTML = description;
        i++;
    });

}

function writeUserData(title, date, time, location, description) {
    firebase.database().ref("eventsNew").push({
        Title: title,
        Date: date,
        Time: time,
        Location: location,
        Description: description
    });
}


//var eventRef = firebase.database.ref().child('eventsNew');
//eventRef.on('value', snap => changAble.innerText = snap.val());

// submit the row to the online database
function confirmAdding() {
    var title, date, time, location, description, tempI;
    tempI = i-1;
    title = document.getElementById("title"+tempI).value;
    date = document.getElementById("date"+tempI).value;
    time = document.getElementById("time"+tempI).value;
    location = document.getElementById("location"+tempI).value;
    description = document.getElementById("description"+tempI).value;
    writeUserData(title, date, time, location, description);
}

var i=0;
$(document).ready(function(){
    $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

$('.filterable .filters input').keyup(function(e){
    /* Ignore tab key */
    var code = e.keyCode || e.which;
    if (code == '9') return;
    /* Useful DOM data and selectors */
    var $input = $(this),
    inputContent = $input.val().toLowerCase(),
    $panel = $input.parents('.filterable'),
    column = $panel.find('.filters th').index($input.parents('th')),
    $table = $panel.find('.table'),
    $rows = $table.find('tbody tr');
    /* Dirtiest filter function ever ;) */
    var $filteredRows = $rows.filter(function(){
        var value = $(this).find('td').eq(column).text().toLowerCase();
        return value.indexOf(inputContent) === -1;
    });
    /* Clean previous no-result if exist */
    $table.find('tbody .no-result').remove();
    /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
    $rows.show();
    $filteredRows.hide();
    /* Prepend no-result row if all rows are filtered */
    if ($filteredRows.length === $rows.length) {
        $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">No result found</td></tr>'));
    }
});

/*
// add rows to the table
$("#add_row").click(function(){
    $('#addr'+i).html("<td><input name='title"+i+"' type='text' id = 'title"+i+"' placeholder='Title' class='form-control input-md'  /> </td><td><input name='date"+i+"' type='text' placeholder='Date' id = 'date"+i+"' class='form-control input-md'  /> </td><td><input name='time"+i+"' type='text' id = 'time"+i+"' placeholder='Time' class='form-control input-md'  /> </td><td><input  name='location"+i+"' type='text' id = 'location"+i+"' placeholder='Location'  class='form-control input-md'></td><td><input  name='description"+i+"' type='text' id = 'description"+i+"' placeholder='Description'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
    i++;
});
*/

});
