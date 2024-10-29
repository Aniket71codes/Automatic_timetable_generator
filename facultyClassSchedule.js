const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myupes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000
});

const timetableSchema = new mongoose.Schema({
  id: { type: String, required: true },
  batch: { type: String, required: true },
  teacher: { type: String, required: true },
  classroom: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true }
});

const TimetableModel = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);

app.get('/facultyClassSchedules', async (req, res) => {
  try {
    const timetables = await TimetableModel.find({});
    res.json({ informations: timetables });
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ error: 'Error fetching timetables' });
  }
});




app.get('/viewBatchTTs', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'batchTTView.html'));
});




app.post('/viewBatchTTs', (req, res) => {
  const batchNo = req.body.batchNo;
  res.redirect(`/viewBatchTTs/${batchNo}`);
});





app.get('/viewBatchTTs/:batch', async (req, res) => {
  const batch = req.params.batch;
  try {
    const timetable = await TimetableModel.find({ batch: batch });
    if (timetable.length > 0) {
      res.json(timetable);
    } else {
      res.status(404).json({ message: 'Batch not found' });
    }
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ error: 'Error fetching timetables' });
  }
});

// app.get('/viewBatchAndTeacherTTs', async (req, res) => {
//   const { batch, teacher } = req.query;
//   if (!batch || !teacher) {
//     return res.status(400).json({ error: 'Batch and teacher name are required' });
//   }

//   try {
//     const timetable = await TimetableModel.find({ batch: batch, teacher: teacher });
//     if (timetable.length > 0) {
//       res.json(timetable);
//     } else {
//       res.status(404).json({ message: 'No timetable entries found for the given batch and teacher' });
//     }
//   } catch (error) {
//     console.error('Error fetching timetables:', error);
//     res.status(500).json({ error: 'Error fetching timetables' });
//   }
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

