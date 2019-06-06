
module.exports = function (app, db) {
  var ObjectID = require('mongodb').ObjectID;

  /* welcome page */
  app.get('/', function (req, res) {
    res.sendFile('mySPA.html', { root: __dirname });
  });

  /* get transcript list */
  app.get('/transcriptlist/', async function (req, res) {
    try {
      //console.log('get data');
      var data = await db.collection('Transcripts').find().toArray();
      //console.log('sort data');
      //data.sort(compare);
      //console.log('send failed');
      res.send(data);
      //console.log('data sent');
    }
    catch (err) {
      console.log('get all failed');
      console.error(err);
    }
  });

  function compare(a, b) {
    if (a.Year - b.Year != 0) {
      return a.Year - b.Year;
    }
    else if (a.Term - b.Term != 0) {
      return a.Term - b.Term;
    }
    else if (a.Course - b.Course != 0) {
      return a.Course - b.Course;
    }
    return 0;
  }


  /* add transcript */
  app.post('/addtranscript/', function (req, res) {

    db.collection('Transcripts').insertOne(req.body, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        res.send({ 'success': 'transcript inserted :(' });
      }
    });
  });


  /* Find transcript */
  app.get('/findtranscript/:id', (req, res) => {
    const theCourse = req.params.id;
    db.collection('Transcripts').findOne({ Course: theCourse }, (err, item) => {
      if (err) {
        console.log('error');
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        if (item == null) {
          item = { Year: '', Term: '', Course: "no such transcript", Credits: '', Grade: '' }
        }
        res.send(item);
      }
    });
  });


  /* delete transcript */
  app.delete('/deletetranscript/:id', (req, res) => {
    const theCourse = req.params.id;
    console.log(theCourse + ' to delete');
    const which = { 'Course': theCourse };  // delete by Course
    db.collection('Transcripts').deleteOne(which, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        res.send('transcript ' + theCourse + ' deleted!');
      }
    });
  });


  /* update transcript */
  app.put('/updatetranscript/:id', (req, res) => {
    const oldCourse = req.params.id;
    const transcript = req.body;
    const newYear = transcript.Year;
    const newTerm = transcript.Term;
    const newCourse = transcript.Course;
    const newCredits = transcript.Credits;
    const newGrade = transcript.Grade;

    // updating transcript using Course as key/* GET admin time. */
    db.collection('Transcripts').updateOne({ Course: oldCourse }, {
      $set: {
        "Year": newYear, "Term": newTerm, "Course": newCourse, "Credits": newCredits, "Grade": newGrade
      }
    }, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(transcript);
        res.redirect("/transcriptlist/");
      }
    });
  });

  /* GET admin time. */
  app.get('/admin/gettime', function (req, res) {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + "@"
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    res.render('gettimeJade', {
      "time": datetime
    });
  });
};  // end of mod exportsuserbyname