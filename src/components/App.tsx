import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { JobTitles, TripClasses, InitialDayData } from '../constants';
import { TripData, DayData } from '../types';
import TripForm from '../components/TripForm';
import DayForm from '../components/DayForm';
import Result from '../components/Result';
import { Button } from '@material-ui/core';

type Props = {};

type State = {
  step: number;
  tripData: TripData;
  editingDayDataIndex: number;
  dayData: Array<DayData>;
  check1: boolean;
  check2: boolean;
};

export default class App extends React.PureComponent<Props, State> {
  state = {
    step: 1,
    tripData: {
      jobTitle: JobTitles[0],
      tripClass: TripClasses[0],
      fundClass: '',
      startDate: '',
      endDate: '',
      destination: '',
      reason: '',
      maxDistance: 0,
      remarks:'',
      priceType:'kippu'
    },
    editingDayDataIndex: 0,
    dayData: [],
    check1: false,
    check2: false
  };

  onTripFormChange = (tripData: TripData) => this.setState({ tripData });
  onTripFormSubmit = (_: React.MouseEvent<any>) =>{
    if(this.state.check1===false||this.state.check2===false){
    this.setState(state => 
      ({
      ...state,
      step: state.step + 1,
      editingDayDataIndex: 0,
      dayData: [InitialDayData(state.tripData, 0)],
    }
    )),
    localStorage.setItem("dayData",JSON.stringify(this.state.dayData, null, '\t')),
    localStorage.setItem("step",String(this.state.step)),
    localStorage.setItem("editingDayDataIndex",String(this.state.editingDayDataIndex)),
                  console.log(this.state.dayData),
                  console.log(this.state.step,this.state.editingDayDataIndex)

  }else{
    this.setState(state => 
      ({
      ...state,
      step: state.step + 1,
      editingDayDataIndex: 0,
    }
    ))
  }
    localStorage.setItem("tripData", JSON.stringify(this.state.tripData, null, '\t')),
    console.log(this.state.tripData)
    console.log(localStorage.getItem("tripData"))
  }
  ;
  

  onDayFormChange = (dayData: DayData) =>
    this.setState(state => ({
      ...state,
      dayData: [
        ...state.dayData.slice(0, state.editingDayDataIndex),
        dayData,
        ...state.dayData.slice(state.editingDayDataIndex + 1),
      ],
    }
    ));
  onDayFormSubmit = (_: React.MouseEvent<any>) =>
    this.setState(state => {
      const dayData = state.dayData[state.editingDayDataIndex];
      const dayDataDistance = dayData.schedules.reduce((accommodationDistance, schedule) => {
        if (schedule.type !== 'move') return accommodationDistance;
        return schedule.accommodationDistance + accommodationDistance;
      }, 0);
      const maxDistance =
        dayDataDistance > state.tripData.maxDistance
          ? dayDataDistance
          : state.tripData.maxDistance;
      //console.log("dayData",dayData)
      localStorage.setItem("dayData", JSON.stringify(state.dayData, null, '\t'));
      localStorage.setItem("tripData", JSON.stringify(state.tripData, null, '\t'));
      localStorage.setItem("editingDayDataIndex",String(state.editingDayDataIndex))
      if (
        state.dayData[state.editingDayDataIndex].date === state.tripData.endDate
      ) {
        localStorage.setItem("step","3")
        return {
          ...state,
          tripData: {
            ...state.tripData,
            maxDistance,
          },
          step: state.step + 1,
        };
      } else {
        localStorage.setItem("step",String(state.step))
        return {
          ...state,
          tripData: {
            ...state.tripData,
            maxDistance,
          },
          editingDayDataIndex: state.editingDayDataIndex + 1,
          dayData: [
            ...state.dayData,
            InitialDayData(state.tripData, state.editingDayDataIndex + 1),
          ],
        };
      }
    });



  render() {
    const { step, tripData, editingDayDataIndex, dayData } = this.state;
  

    // const test2 = JSON.parse(stringDayData)
    // console.log(test2)
    return (
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
            {step ==1&&
                <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  this.setState({
                    ...this.state,
                    tripData:JSON.parse(String(localStorage.getItem("tripData"))),
                    dayData:JSON.parse(String(localStorage.getItem("dayData"))),
                    step:Number(localStorage.getItem("step")),
                    editingDayDataIndex:Number(localStorage.getItem("editingDayDataIndex")),
                    check1:true
                  }),
                  console.log(tripData),
                  console.log(dayData),
                  console.log(step,editingDayDataIndex)
                }
                }
              >
              前回の申請へ

              </Button>}
                {(step ==2&&editingDayDataIndex==0)&&
                <Button
                variant="outlined"
                color="inherit"
                onClick={() => 
                  this.setState({
                    ...this.state,
                    step:step-1,
                    check2:true
                  })
                }
              >
              出張の詳細
                </Button>}
                {(step ==2&&editingDayDataIndex!=0)&&
                <Button
                variant="outlined"
                color="inherit"
                onClick={() => 
                  this.setState({
                    ...this.state,
                    editingDayDataIndex:editingDayDataIndex-1
                  })
                }
              >
              前の日へ
                </Button>}
                {step ==3&&
                <Button
                variant="outlined"
                color="inherit"
                onClick={() => 
                  this.setState({
                    ...this.state,
                    step:step-1,
                    //check2:true
                  })
                }
              >
              最終日へ
                </Button>}

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出張旅費申請&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              
                
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => window.open("./doc/出張お助けAI利用マニュアル.pdf")}
              >
                利用マニュアル
                </Button>
          </Toolbar>
        </AppBar>
        {step === 1 && (
          <TripForm
            tripData={tripData}
            onChange={this.onTripFormChange}
            onSubmit={this.onTripFormSubmit}
          />
        )}
        {step === 2 && (
          <DayForm
            tripData={tripData}
            dayData={dayData[editingDayDataIndex]}
            onChange={this.onDayFormChange}
            onSubmit={this.onDayFormSubmit}
          />
        )}
        {step === 3 && <Result dayData={dayData} tripData={tripData} onChange={this.onTripFormChange}/>}
      </>
    );
  }
}
