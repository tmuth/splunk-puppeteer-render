'use strict';

const fs = require('fs');


const findStudentByName = (studentsIn, nameIn) => {
    const key = Object.keys(studentsIn).find(student => studentsIn[student].name === nameIn)
    return studentsIn[key]
  }

fs.readFile('student2.json', (err, data) => {
    if (err) throw err;
    let students = JSON.parse(data);
    console.log(students);
    console.log(findStudentByName(students,'Dave'));

    let theStudent = findStudentByName(students,'Dave');
    console.log('Car: '+theStudent.car)
});

console.log('This is after the read call');
