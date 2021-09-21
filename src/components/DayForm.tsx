import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DayData, TripData, Result } from '../types';

import { checkAccommodation, checkDailyAllowance } from '../lib/rule';
import BusinessScheduleFormDialog from '../components/BusinessScheduleFormDialog';
import MoveScheduleFormDialog from '../components/MoveScheduleFormDialog';
import { Grid, RadioGroup, FormControlLabel, Radio, FormLabel, TextField, createMuiTheme } from '@material-ui/core';
import { type } from 'os';

type Props = {
  tripData: TripData;
  dayData: DayData;
  // dayDatas: Array<DayData>
  onChange: (dayData: DayData) => void;
  onSubmit: (e: React.MouseEvent) => void;
};

type State = {
  loading: boolean;
  showBusinessForm: boolean;
  showMoveForm: boolean;
  isInFlightNight: boolean;
  // check1: boolean;
  // accommodationAmountString: string;
  // dailyAllowanceAmountString: string;
};

export default class DayForm extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    showBusinessForm: false,
    showMoveForm: false,
    isInFlightNight: false,
    // check1:true
    // accommodationAmountString: "",
    // dailyAllowanceAmountString: "",
    
  };

  calcAmount = () => {
    this.setState({ loading: true });
    const { tripData, dayData, onChange } = this.props;
    const {
      tripClass,
      fundClass,
      startDate,
      endDate,
      destination,
      maxDistance,
    } = tripData;
    const { isInFlightNight } = this.state;
    const { date, schedules } = dayData;
    const jobTitle = localStorage.getItem("businessTravelerJobTitle") === null
      ? (String)(localStorage.getItem("businessPersonJobTitle"))
      : (String)(localStorage.getItem("businessTravelerJobTitle"));

    const isOnMove = schedules.some(schedule => schedule.type === 'move');
    const isOnBusiness = schedules.some(
      schedule => schedule.type === 'business'
    );
    const oneWayDistanceFromDayData = schedules.reduce((accommodationDistance, schedule) => {
      if (schedule.type !== 'move') return accommodationDistance;
      return schedule.accommodationDistance + accommodationDistance;
    }, 0); // 移動日程のdistanceを合計したものを使う
    const oneWayDistance =
      oneWayDistanceFromDayData > maxDistance
        ? oneWayDistanceFromDayData
        : maxDistance; // これまでの移動距離で最大のものをルール実行では使う
    const roundTripDistance = oneWayDistance * 2;
    const stayClass = (() => {
      if (startDate === endDate) return '日帰り';
      if (date === startDate) return '宿泊(出発日)';
      if (date === endDate) return '宿泊(帰着日)';
      return '宿泊(滞在日)';
    })();
    const firstMoveData = schedules.find(schedule => schedule.type === 'move');
    const departureHour =
      firstMoveData != null && firstMoveData.type === 'move'
        ? firstMoveData.startHour
        : 0;
    const returnHour = schedules.reduce((hour, schedule) => {
      if (schedule.type !== 'move') return hour;
      return schedule.endHour;
    }, 24); // 最後の移動日程のendHourをセットする

    // const isInFlightNight = false; 移動データからチェックしたい
    const transportation = '鉄道'; // 移動データからチェックしたい(船舶は考慮できていない)
    
    var check2 = false;
    schedules.map((s) => {
      if (s.type!='move'){
        check2 = true
  }})

  if(date != startDate && date != endDate && check2 == false){
    alert("用務を入力し,もう一度計算をしてください。(翌日用務があり帰宅する時間がない場合に限り理由書を書けば宿泊費が出ます。)")
    // this.setState({check1:false})
  }
    Promise.all([
      checkAccommodation({
        tripClass,
        date,
        jobTitle,
        destination,
        isOnMove,
        isOnBusiness,
        isInFlightNight,
        oneWayDistance,
        stayClass,
      }),
      checkDailyAllowance({
        tripClass,
        date,
        jobTitle,
        destination,
        isOnMove,
        isOnBusiness,
        stayClass,
        transportation,
        roundTripDistance,
        departureHour,
        returnHour,
      }),
    ]).then(([accommodationData, dailyAllowanceData]) => {
      const {
        accommodationAmount,
        accommodationIsReasonStatementNecessary,
        accommodationDescription,
      } = accommodationData;
      const {
        dailyAllowanceAmount,
        dailyAllowanceDescription,
      } = dailyAllowanceData;

      onChange({
        ...dayData,
        accommodationAmount,
        accommodationIsReasonStatementNecessary,
        accommodationDescription,
        dailyAllowanceAmount,
        dailyAllowanceDescription,
      });
      this.setState({
        loading: false,
        // dailyAllowanceAmountString: String(dailyAllowanceAmount),
        // accommodationAmountString: String(accommodationAmount),
      });
    });
  };



  // generateResult = (dayDatas: Array<DayData>): Array<Result> => {
  //   generateResult = (dayDatas: Array<DayData>) => {
  //   let resultList: Array<Result> = [];
  //   dayDatas.forEach(data => {
  
  //     const month = data.date.slice(5, 7);
  //     const date = data.date.slice(8, 10);
  //     if (data.schedules.length === 0) {
  //       resultList.push({
  //         month,
  //         date,
  //         body: '日程なし',
  //         fare: 0,
  //         accommodation: Number(data.accommodationAmount),
  //         dailyAllowance: Number(data.dailyAllowanceAmount),
  //       });
  //       return;
  //     }
  //     const firstSchedule = data.schedules[0];
  //     resultList.push({
  //       month,
  //       date,
  //       body: firstSchedule.text,
  //       fare: firstSchedule.type === 'move' ? Number(firstSchedule.fare) : 0,
  //       accommodation: Number(data.accommodationAmount),
  //       dailyAllowance: Number(data.dailyAllowanceAmount),
  //     });
  //     for (let i = 1; i < data.schedules.length; i++) {
  //       let schedule = data.schedules[i];
  //       resultList.push({
  //         month: '',
  //         date: '',
  //         body: schedule.text,
  //         fare: schedule.type === 'move' ? Number(schedule.fare) : 0,
  //         accommodation: 0,
  //         dailyAllowance: 0,
  //       });
  //     }
  //   });
  //   console.log(resultList);
  //   // localStorage.setItem("resultList",resultList);
  //   // return resultList
  // };

 


  render() {
    const { loading, showBusinessForm, showMoveForm, isInFlightNight,/*, accommodationAmountString, dailyAllowanceAmountString*/ } = this.state;
    const { dayData, tripData, onChange, onSubmit,/*startData,endData*/ } = this.props;
    const {
      date,
      schedules,
      accommodationAmount,
      accommodationIsReasonStatementNecessary,
      accommodationDescription,
      dailyAllowanceAmount,
      dailyAllowanceDescription,
    } = dayData;
    const { tripClass } = tripData;
    

    const isValid = accommodationAmount != null && dailyAllowanceAmount != null 

    console.log("s",schedules)
    return (
      <div style={{ margin: 16 }}>
        <Typography variant="headline">{date}</Typography>
        <div>
          <p></p>
        <div> ※申請書の旅行日程の欄の１行に相当します。時系列順に入力してください。</div>
          {schedules.map((s,index) => (
            <Paper key={s.text} style={{ marginTop: 8, padding: 8 }}>
              {s.text + (s.type === 'move' ? `(${s.fare}円)` : '')}
              &nbsp;&nbsp;
               <Button
               style={{ alignItems: 'end' }}
              variant="contained"
              color="inherit"
              onClick={()=>{
                schedules.splice(index,1)
                onChange({...dayData,schedules:schedules})}}
              >
              ×
                </Button> 
                &nbsp;&nbsp;
                {schedules.length !==index+1 &&
               <Button
               style={{ alignItems: 'end' }}
              variant="contained"
              color="inherit"
              onClick={()=>{
                schedules.splice(index,2,schedules[index+1],schedules[index])
                onChange({...dayData,schedules:schedules})}}
              >
              ↓
              </Button> }
              &nbsp;&nbsp;
              {s.type === 'move' &&　s.payment === 'traveler' &&
               <Button
               style={{ alignItems: 'end' }}
              variant="contained"
              color="inherit"
              onClick={()=>{
                s.payment = 'vender'
                onChange({...dayData,schedules:schedules})}}
              >
              出張者払い
              </Button>
               }
              {s.type === 'move' &&　s.payment === 'vender' &&
               <Button
               style={{ alignItems: 'end' }}
              variant="contained"
              color="inherit"
              onClick={()=>{
                s.payment = 'traveler'
                onChange({...dayData,schedules:schedules})}}
              >
              業者払い
              </Button> }
            </Paper>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          {/* <span style={{ margin: 8 }} /> */}
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ showMoveForm: true });
            }}
          >
            移動を追加
          </Button>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ showBusinessForm: true });
            }}
          >
            用務を追加
          </Button>
          </div>

        {tripClass === "国外" && (
          <div style={{
            marginTop: 16,
          }}>
            <FormLabel >機内泊</FormLabel>
            <RadioGroup row　defaultValue="false">
              <FormControlLabel value="true" control={<Radio />} onChange={() => this.setState({ isInFlightNight: true })} label="する" />
              <FormControlLabel value="false" control={<Radio />} onChange={() => this.setState({ isInFlightNight: false })} label="しない" />
            </RadioGroup>
          </div>)}

        <div
          style={{
            display: 'inline-block',
            position: 'relative',
            marginTop: 16,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={
              this.calcAmount
            }
          >
            宿泊料、日当を計算する
          </Button>
          &nbsp;&nbsp;※用務・移動を追加,変更,削除した場合再度押してください。
          {loading && (
            <CircularProgress
              size={24}
              color="secondary"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
              }}
            />
          )}
        </div>
        <div style={{
          marginTop: 16,
        }}>
          {accommodationAmount != null && (
            <div>宿泊料：
            <TextField
                autoFocus
                // value={accommodationAmountString}
                value={accommodationAmount}
                onChange={(e) => {
                  // this.setState({ accommodationAmountString: e.target.value });
                  console.log(Number.isNaN(Number(e.target.value)))
                    if(Number.isNaN(Number(e.target.value))===false){
                  onChange({...dayData,accommodationAmount: Number(e.target.value)}
                  )}
                }
                }
              />
              円&nbsp;&nbsp;&nbsp;&nbsp;
            {/* <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onChange({
                    ...dayData,
                    accommodationAmount: Number(accommodationAmountString)
                  }),
                    alert("宿泊料を変更しました。")
                }}
              >
                変更を反映
          </Button> */}
            </div>
          )}



          {accommodationIsReasonStatementNecessary != null && (
            <p>
              宿泊料のために理由書が必要か：
              {accommodationIsReasonStatementNecessary}
            </p>
          )}
          {accommodationDescription != null && (
            <p>宿泊料についての説明：{accommodationDescription}
            </p>
          )}

          {dailyAllowanceAmount != null && (
            <div style={{
              marginTop: 16,
            }}>
              日当：
              <TextField
                autoFocus
                // value={dailyAllowanceAmountString}
                value={dailyAllowanceAmount}
                onChange={(e) => {
                  // this.setState({ dailyAllowanceAmountString: e.target.value });
                  if(Number.isNaN(Number(e.target.value))===false){
                  onChange({...dayData,dailyAllowanceAmount:Number(e.target.value)})

                }}
                }
              />
              円&nbsp;&nbsp;&nbsp;&nbsp;

                {/* <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onChange({
                    ...dayData,
                    dailyAllowanceAmount: Number(dailyAllowanceAmountString)
                  }),
                    alert("日当を変更しました。")
                }}
              >
                変更を反映
          </Button> */}
            </div>
          )}
          {dailyAllowanceDescription != null && (
            <p>日当についての説明：{dailyAllowanceDescription}</p>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isValid}
            onClick={onSubmit}
          >
            完了
          </Button>
        </div>
        <BusinessScheduleFormDialog
          open={showBusinessForm}
          onClose={() => this.setState({ showBusinessForm: false })}
          onSubmit={data => {
            onChange({ ...dayData, schedules: [...dayData.schedules, data] });
            this.setState({ showBusinessForm: false });
          }}
        />
        <MoveScheduleFormDialog
          date={date}
          open={showMoveForm}

          tripData={tripData}

          onClose={() => this.setState({ showMoveForm: false })}
          onSubmit={data => {
            onChange({ ...dayData, schedules: [...dayData.schedules, data] });
            this.setState({ showMoveForm: false });
          }}
        />
      </div>
    );
  }

}

