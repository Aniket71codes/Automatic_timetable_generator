const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');  
const User = require('./static/User.js');   
const Timetable = require('./static/timetable.js');  
const { createObjectCsvWriter } = require('csv-writer');  
const app = express();
const port = 80;
const cors = require('cors');
const temp = require('./facultyClassSchedule.js'); 

app.use(cors());
app.use(express.json());
const {readFileSync} = require('fs');





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'view')));

mongoose.connect('mongodb://127.0.0.1:27017/myupes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));







 app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'view', 'landingPage.html')));
app.get('/studentHome', (req, res) => res.sendFile(path.join(__dirname, 'view', 'studentHome.html')));
app.get('/adminHome', (req, res) => res.sendFile(path.join(__dirname, 'view', 'admin_Home.html')));
app.get('/faculty', (req, res) => res.sendFile(path.join(__dirname, 'view', 'teacherHome.html')));
app.get('/viewBatchTT', (req, res) => res.sendFile(path.join(__dirname, 'view', 'viewBatch.html')));
app.get('/modifyTimeTableAdmin' , (req,res) =>res.sendFile(path.join(__dirname, 'view', 'modifyTTAdmin.html')) )
app.get('/modifyTimeTableFaculty', (req, res) => res.sendFile(path.join(__dirname, 'view', 'modifyTTFaculty.html')));
app.get('/facultyClassSchedule' , (req,res) =>{ res.sendFile(path.join(__dirname, 'view', 'facultyClassSchedule.html'))})
app.get('/viewBatchTTs' , (req, res) => res.sendFile(path.join(__dirname, 'view', 'viewBAtchTimeTable.html')))
app.get('/myTimeTable' , (req,res) => res.sendFile(path.join(__dirname, 'view', 'viewBAtchTimeTable.html')) )







app.post('/', async (req, res) => {
  const sapId = Number(req.body.sapId); 
  const password = req.body.password;
  const role = req.body.role;

  try {
    const user = await User.findOne({ sapId: sapId, role: role });
    if (!user || user.password !== password) 
    
    {   
      return res.status(401).json({ message: "Wrong SapId or Password" });
    }

    if (role === "Student") {
      return res.redirect('/studentHome');
    }
    else if (role === "Administrator") {
      return res.redirect('/adminHome');
    }
    else if (role === "Faculty") {
      return res.redirect('/faculty');
    } else 
    {
      return res.status(403).json({ message: "Access denied" });
    }

  } 
 catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});










app.post('/faculty' , (req , res) =>
{
  return res.redirect(`/${req.body}`) ;
})







app.post('/adminHome', (req, res) => {
  return res.redirect(`/${req.body}`);
  console.log(req.body) ;
});











app.post('/modifyTimeTableAdmin', async (req, res) => {
  const { index, batch, teacher, classroom, day, startTime, endTime } = req.body;

  try {
      const timetableEntry = await Timetable.findById(index);

      if (timetableEntry) {
          timetableEntry.batch = batch;
          timetableEntry.teacher = teacher;
          timetableEntry.classroom = classroom;
          timetableEntry.day = day;
          timetableEntry.startTime = parseInt(startTime, 10);
          timetableEntry.endTime = parseInt(endTime, 10);

          await timetableEntry.save();
          console.log("Timetable updated successfully");

          res.redirect('/adminHome');
      } else {
          res.status(404).send("Timetable entry not found");
      }
  } catch (error) {
      console.error("Error updating timetable:", error);
      res.status(500).send("Internal server error");
  }
});











app.post('/modifyTimeTableFaculty' , (req , res) =>
  {
  

    app.post('/modifyTimeTableAdmin', async (req, res) => {
      const { index, batch, teacher, classroom, day, startTime, endTime } = req.body;
  
      try {
           const timetableEntry = await Timetable.findById(index);
  
          if (timetableEntry) {
               timetableEntry.batch = batch;
              timetableEntry.teacher = teacher;
              timetableEntry.classroom = classroom;
              timetableEntry.day = day;
              timetableEntry.startTime = parseInt(startTime, 10);
              timetableEntry.endTime = parseInt(endTime, 10);
  
              await timetableEntry.save();
              console.log("Timetable updated successfully");
  
              res.redirect('/adminHome');
          } else {
              res.status(404).send("Timetable entry not found");
          }
      } catch (error) {
          console.error("Error updating timetable:", error);
          res.status(500).send("Internal server error");
      }
  });

  })

















  app.post('/createTimeTable', async (req, res) => {
    const teachers = [
        'Amar Jindal', 'Kamal Raj Singh', 'Varun Sapra', 'Anand Kumar',
        'Divya Rose', 'Pankaj Rana', 'Pratibha Joshi', 'Mohammad Asif'
    ];

    const classrooms = [
        '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008',
        '1009', '1101', '1102', '1103', '1104'
    ];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const classDurations = [1, 2]; 
    const batches = Array.from({ length: 5 }, (_, i) => `B${i + 1}`);

     const timeSlots = {};
    days.forEach(day => {
        timeSlots[day] = Array.from({ length: 8 }, (_, hour) => [9 + hour, 10 + hour]);  
    });

     function getRandomTimeSlot(day) {
        const slots = timeSlots[day];
        if (slots.length === 0) {
            throw new Error(`No time slots available for ${day}`);
        }
        return slots[Math.floor(Math.random() * slots.length)];
    }

    const timetable = [];
    const classesPerBatch = 25;
    const numClassesPerDay = {};
    
     days.forEach(day => {
        numClassesPerDay[day] = Math.floor(Math.random() * 3) + 3;  
    });

    batches.forEach(batch => {
        let totalClassesScheduled = 0;

        days.forEach(day => {
            let numClasses = numClassesPerDay[day];
            if (totalClassesScheduled + numClasses > classesPerBatch) {
                numClasses = classesPerBatch - totalClassesScheduled;  
            }

            for (let i = 0; i < numClasses; i++) {
                 if (timeSlots[day].length === 0) {
                    break;  
                }

                const [startTime, endTime] = getRandomTimeSlot(day);
                const teacher = teachers[Math.floor(Math.random() * teachers.length)];
                const classroom = classrooms[Math.floor(Math.random() * classrooms.length)];
                const duration = classDurations[Math.floor(Math.random() * classDurations.length)];
                const actualEndTime = Math.min(startTime + duration, 17);  

                timetable.push({ batch, teacher, classroom, day, startTime, endTime: actualEndTime });

                 timeSlots[day] = timeSlots[day].filter(slot => !(slot[0] >= startTime && slot[0] < actualEndTime));

                totalClassesScheduled++;
            }

            if (totalClassesScheduled >= classesPerBatch) {
                return false;   
            }
        });
    });

    try {
        await Timetable.insertMany(timetable);
        console.log("Timetable saved to database");
        return res.status(200).json({ message: "Time Table Created" });
    } catch (error) {
        console.error("Error saving timetable:", error);
        res.status(500).send('Error saving timetable');
    }
});









app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
































