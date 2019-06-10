$(document).on('pagebeforeshow ', '#home', function () {   // see: https://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events
    var info_view = "";      //string to put HTML in
    $('#transcripts').empty();     // since I do this everytime the page is redone, I need to remove existing before apending them all again
    $.getJSON('/transcriptlist/')  //Send an AJAX request
        .done(function (data) {
            //console.log("json received");
            $.each(data, function (index, record) {   // make up each li as an <a> to the details-page
                $('#transcripts').append('<li><a data-parm=' + record.Course + ' href="#details-page">' +
                    record.Course + '</a></li>');
            });
            //console.log("load lines");
            $("#transcripts").listview('refresh');  // need this so jquery mobile will apply the styling to the newly added li's
            $("a").on("click", function (event) {  // set up an event, if user clicks any, it writes that items data-parm into the details page's html so I can get it there
                var parm = $(this).attr("data-parm");
                //do something here with parameter on  details page
                $("#detailParmHere").html(parm);
                $("#updateCourseHere").html(parm);
            });
        }); // end of .done
});


$(document).on('pagebeforeshow', '#details-page', function () {
    var textString = 'fix me';
    var id = $('#detailParmHere').text();
    $.getJSON('/findtranscript/' + id)
        .done(function (item) {
            textString = "Year: " + item.Year + "     Term: " + item.Term + "     Course: " + item.Course +
                "     Credits: " + item.Credits + "     Grade: " + item.Grade;
            //console.log(textString)
            $('#showText').text(textString);
            })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#showData').text(textString);
        })
});

$(document).on('pagebeforeshow', '#update-page', function () {
    var textString = 'fix me';
    var id = $('#updateCourseHere').text();
    $.getJSON('/findtranscript/' + id)
        .done(function (item) {
            $('#updateYear').val(item.Year);
            $('#updateTerm').val(item.Term);
            $('#updateCourse').val(item.Course);
            $('#updateCredits').val(item.Credits);
            $('#updateGrade').val(item.Grade);
        })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#updateCourse').text(textString);
        })
});


$(document).on('pagebeforeshow', '#deletepage', function () {
    $('#transcriptToDelete').val('');
});


// clears the fields
$(document).on('pagebeforeshow', '#addpage', function () {
    $('#newYear').val('');
    $('#newTerm').val('');
    $('#newCourse').val('');
    $('#newCredits').val('');
    $('#newGrade').val('');
});


function addtranscript() {
    const year = $('#newYear').val();
    const term = $('#newTerm').val();
    const course = $('#newCourse').val();
    const credits = $('#newCredits').val();
    const grade = $('#newGrade').val();
    const newtranscript = { Year: year, Term: term, Course: course, Credits: credits, Grade: grade };
    //console.log(course);

    $.ajax({
        url: '/addtranscript/',
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newtranscript),
        success: function (result) {
            
            alert("success");
            window.location.href = '#home';
        }
    });
}


function updatetranscript() {
    const oldCourse = $('#updateCourseHere').html();
    const year = $('#updateYear').val();
    const term = $('#updateTerm').val();
    const course = $('#updateCourse').val();
    const credits = $('#updateCredits').val();
    const grade = $('#updateGrade').val();
    // sending all 5 values for the course in json object 
    const updatedTranscript = { Year: year, Term: term, Course: course, Credits: credits, Grade: grade };
    $.ajax({
        url: '/updatetranscript/' + oldCourse,  // putting the transcript Course in the URL for the PUT method
        //method: "PUT",
        type:'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedTranscript), 
        success: function (result) {
            alert("Row updated!");
            window.location.href = '#details-page';
        }
    });
}


function deletetranscript() {
    var course = document.getElementById('detailParmHere').innerHTML;
    $.ajax({
        url: "/deletetranscript/" + course,
        method: "DELETE",
        success: function (result) {
            window.location.href = '#home';
        }
    })
}
