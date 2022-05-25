import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import moment from 'moment-timezone';

export const attendanceReport = async (req, res) => {
  const employeeId = req.params.employeeId;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const mandatoryEntryTime = new Date('2022-05-25T08:30').getTime(); // change to milisecond
  const intervalDate = getDifferenceInDays(startDate.getTime(), endDate.getTime()) + 1;

  // count total attendance
  let present = 0;
  let late = 0;
  let leave = 0;
  let leaveApprove = 0;
  let leaveRejected = 0;
  let notPresent = 0; // total day - (present  + leave)

  // get all attendance by using startDate
  const attendances = await Attendance.find({ id: employeeId }, { timeIn: 1, _id: 0, employeeId: 1 });
  const employee = await Employee.find({ _id: employeeId }, { name: 1, _id: 0 });
  const leaveData = await Leave.find({ employeeId: employeeId });

  // check and count if employee present or late
  attendances.forEach((attendance) => {
    if (attendance.timeIn) {
      const timeIn = attendance.timeIn.getTime();
      const checkIfPresent = timeIn - mandatoryEntryTime;
      if (checkIfPresent <= 0) {
        present++;
      } else {
        present++;
        late++;
      }
    }
  });

  // check and count leave approve and leave rejected
  leaveData.forEach((leaves) => {
    if (leaves.isApprove === true) {
      leave += leaves.intervalDateLeave;
      leaveApprove++;
    } else {
      leaveRejected++;
    }
  });

  notPresent = moment().daysInMonth() - (present + leave);

  res.json({ present });

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
};

function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

// const attendance = await Attendance.find({ employeeId: '628c52985781877dc0852853' }, { timeIn: 1, _id: 0 });
// const attendance1 = await Attendance.find({ employeeId: '628c529d5781877dc0852855' });
// const cekparsedTime = moment(new Date(attendance[0].timeIn)).tz('Asia/Jakarta').format('YYYY-MM-DD');
// res.json(attendance1);

// const getId = req.body.id;
// let present = 0;
// let late = 0;
// const leave = 0;
// const notPresent = '';
// const leaveApprove = 5; if(dateAprove && isAprove = true)
// const leaveRejected = 5; if(dateAprove && isAprove = false)
//   {
// 	2022-05-24: {
// 		"in": 2022-05-24 09:00:05,
// 		"out": 2022-05-24 17:59:00
// 	}
// 	2022-05-25: {
// 		"in": 2022-05-25 08:57:05,
// 		"out": 2022-05-25 17:59:00
// 	}
// }
