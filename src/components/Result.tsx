import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TextField from '@material-ui/core/TextField';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { DayData, TripData } from '../types';
import { exportExcel, safeDelete } from '../lib/rule';
import { execFile } from 'child_process';


type Props = {
  dayData: Array<DayData>;
  tripData: TripData;
  onChange: (tripData: TripData) => void;
};


export default function Result(props: Props) {

  const { dayData, tripData, onChange } = props;
  const { tripClass, fundClass, startDate, endDate, destination, reason, remarks } = tripData;
  if (tripClass === "国内") {
    var tripClassNew = "国内 ・ 新規";
  } else {
    var tripClassNew = "国外 ・ 新規";
  }
  const destinationAndReason = destination!=="その他" ? destination + " , " + reason : reason;

  var businessPersonBelong = localStorage.getItem("businessPersonBelong") === null
    ? "" : (String)(localStorage.getItem("businessPersonBelong"));

  var businessPersonStaffNumber = localStorage.getItem("businessPersonStaffNumber") === null
    ? "" : (String)(localStorage.getItem("businessPersonStaffNumber"));

  var businessPersonJobTitle = localStorage.getItem("businessPersonJobTitle") === null
    ? "" : (String)(localStorage.getItem("businessPersonJobTitle"));

  var businessPersonName = localStorage.getItem("businessPersonName") === null
    ? "" : (String)(localStorage.getItem("businessPersonName"));

  var businessPersonExtension = localStorage.getItem("businessPersonExtension") === null
    ? "" : (String)(localStorage.getItem("businessPersonExtension"));

  var businessTravelerBelong = localStorage.getItem("businessTravelerBelong") === null
    ? "" : (String)(localStorage.getItem("businessTravelerBelong"));

  var businessTravelerStaffNumber = localStorage.getItem("businessTravelerStaffNumber") === null
    ? "" : (String)(localStorage.getItem("businessTravelerStaffNumber"));



  var businessTravelerName = localStorage.getItem("businessTravelerName") === null
    ? "" : (String)(localStorage.getItem("businessTravelerName"));

  var businessTravelerExtension = localStorage.getItem("businessTravelerExtension") === null
    ? "" : (String)(localStorage.getItem("businessTravelerExtension"));

  var teikiStart = localStorage.getItem("teikiStart") === null
    ? "" : (String)(localStorage.getItem("teikiStart"));

  var teikiEnd = localStorage.getItem("teikiEnd") === null
    ? "" : (String)(localStorage.getItem("teikiEnd"));

  var businessTravelerJobTitle = ""
  if (localStorage.getItem("businessTravelerJobTitle") === null) {
    if (localStorage.getItem("businessPersonJobTitle") !== null) {
      businessTravelerJobTitle = String(localStorage.getItem("businessPersonJobTitle"))
    }
  } else {
    businessTravelerJobTitle = String(localStorage.getItem("businessTravelerJobTitle"))
  }


  var isResearchPosition = false;
  var documentFileName1 = "";
  var documentFileName2 = "";


  const resultList = generateResult(dayData);
  const { getOnPlane, getOnTrain } = getOn(dayData);
  const documentData = {
    tripClassNew,
    fundClass,
    startDate,
    endDate,
    destinationAndReason,
    teikiStart,
    teikiEnd,
    businessPersonBelong,
    businessPersonStaffNumber,
    businessPersonJobTitle,
    businessPersonName,
    businessPersonExtension,
    businessTravelerBelong,
    businessTravelerStaffNumber,
    businessTravelerJobTitle,
    businessTravelerName,
    businessTravelerExtension,
    remarks,
    resultList,
    isResearchPosition,
    getOnPlane,
    getOnTrain,
  };

  type DeleteFile = {
    fileName1: string;
    fileName2: string;
  }

  return (
    <div style={{ margin: 16 }}>
      <Typography variant="headline">日程表</Typography>
      <Paper style={{ width: '100%', marginTop: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>月</TableCell>
              <TableCell>日</TableCell>
              <TableCell>日程</TableCell>
              <TableCell>運賃(円)</TableCell>
              <TableCell>宿泊料(円)</TableCell>
              <TableCell>日当(円)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultList.map(data => (
              <TableRow key={data.month + data.date + data.body}>
                <TableCell>{data.month}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.body}</TableCell>
                <TableCell>{data.fare}</TableCell>
                <TableCell>{data.accommodation}</TableCell>
                <TableCell>{data.dailyAllowance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <div style={styles.wrapper}> 
        <TextField
          label="備考"
          value={remarks}
          fullWidth
          onChange={e => {
            onChange({ ...tripData, remarks: e.target.value });
          }
          }
        />
      </div>
      <Button
        style={{ marginTop: 16 }}
        variant="contained"
        color="primary"
        onClick={() => {
          exportExcel(documentData)
            .then((documentResult) => {
              var { document, /*documentDescription*/ fileName1, fileName2 } = documentResult;
              var document2 = String(document).split(",");
              var message = ""
              for (var i = 0; i < document2.length; i++) {
                message += document2[i] + "\n"
              }
              message += "を提出してください。"
              // if (documentDescription != null) {
              //   message += "\n"+documentDescription;
              // }
              alert(message)
              localStorage.setItem("fileName1", String(fileName1));
              documentFileName1 = String(fileName1);
              window.open("./doc/" + documentFileName1, "_blank")
              if (fileName2 !== null) {
                localStorage.setItem("fileName2", String(fileName2));
                documentFileName2 = String(fileName2);
                window.open("./doc/" + documentFileName2, "_blank")
              }

            })
        }
        }
        component="a"
      >
        ダウンロード
      </Button>
      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="primary"
          component="a"
          onClick={() => {
            const deleteFile: DeleteFile = { fileName1: documentFileName1, fileName2: documentFileName2 }
            safeDelete(deleteFile)
            alert("サーバ上のファイルを削除しました。")
          }}
        >
          サーバ上のファイルを削除
      </Button>
        &nbsp;&nbsp;※ダウンロードした後必ず削除してください
      </div>
      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="secondary"
          component="a"
          onClick={() => {
            window.open("https://docs.google.com/forms/d/e/1FAIpQLSd_c5XhAYe-vNQcZjEphd_oxGFllHORfjdTdg10qOBcIS_xIA/viewform?usp=sf_link")
          }}
        >
          アンケートへ
      </Button>
        &nbsp;&nbsp;ご回答お願いします！
      </div>
    </div>



  );

}

type Result = {
  month: string;
  date: string;
  body: string;
  fare: number;
  payment: string;
  accommodation: number;
  dailyAllowance: number;
};



const generateResult = (dayData: Array<DayData>): Array<Result> => {
  let resultList: Array<Result> = [];
  dayData.forEach(data => {

    const month = data.date.slice(5, 7);
    const date = data.date.slice(8, 10);
    if (Number.isNaN(Number(data.accommodationAmount))===false && Number.isNaN(Number(data.dailyAllowanceAmount))===false){
    if (data.schedules.length === 0) {
      resultList.push({
        month,
        date,
        body: '日程なし',
        fare: 0,
        payment:'',
        accommodation: Number(data.accommodationAmount),
        dailyAllowance: Number(data.dailyAllowanceAmount),
      });
      return;
    }
    const firstSchedule = data.schedules[0];
    resultList.push({
      month,
      date,
      body: firstSchedule.text,
      fare: firstSchedule.type === 'move' ? Number(firstSchedule.fare) : 0,
      payment: firstSchedule.type === 'move' ? firstSchedule.payment:'',
      accommodation: Number(data.accommodationAmount),
      dailyAllowance: Number(data.dailyAllowanceAmount),
    });
    for (let i = 1; i < data.schedules.length; i++) {
      let schedule = data.schedules[i];
      resultList.push({
        month: '',
        date: '',
        body: schedule.text,
        fare: schedule.type === 'move' ? Number(schedule.fare) : 0,
        payment: schedule.type === 'move' ? schedule.payment:'',
        accommodation: 0,
        dailyAllowance: 0,
      });
    }
  }
  });
  console.log(resultList)
  return resultList
};

const getOn = (dayData: Array<DayData>) => {
  var getOnPlane = false;
  var getOnTrain = false;
  dayData.forEach(data => {
    for (let i = 1; i < data.schedules.length; i++) {
      let schedule = data.schedules[i];
      if (schedule.type === 'move' && schedule.getOnPlane === true) {
        getOnPlane = true;
      }
      if (schedule.type === 'move' && schedule.getOnTrain === true) {
        getOnTrain = true;
      }
    }
  });
  return { getOnPlane, getOnTrain }
};


const styles = {
  form: {
      margin: 16,
  },
  wrapper: {
      marginTop: 16,
  },
};