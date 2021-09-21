import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MoveScheduleData } from '../types';
import PointComp from '../components/Point';
import LineComp from '../components/Line';

type Props = {
  data: any;
  courseNum: number;
  onChange: (data: any) => void;
  onSubmit: (data: MoveScheduleData) => void;
};

type State = {
  print: boolean;
}



export default class TripForm extends React.PureComponent<Props, State> {
  state: State = {
    print: false
  }
  render() {
    const { data, courseNum, onChange, onSubmit } = this.props;
    const { print } = this.state
    const { Course } = data.ResultSet;
    const { Price, Route } = Course[courseNum]===undefined?　Course[0] : Course[courseNum];
    const {
      timeOther,
      timeOnBoard,
      timeWalk,
      transferCount,
      distance,
      Line,
      Point,
    } = Route;
    const priceArray: Array<any> = Price.length == null ? [Price] : Price;
    const prices = priceArray.map(price => ({
      ...price,
      Oneway:
        typeof price.Oneway === 'object'
          ? Number(price.Oneway.text)
          : Number(price.Oneway),
    }));
    const lines: Array<any> = Line.length == null ? [Line] : Line;
    const points: Array<any> = Point.length == null ? [Point] : Point;

    const time = Number(timeOther) + Number(timeOnBoard) + Number(timeWalk);
    var kmDistance = 0;
    for (var i in lines) {
      if (lines[i].Type === 'train' || lines[i].Type.text === 'train'){
        kmDistance += Number(lines[i].distance / 10) 
      };
    }
    var accommodationKmDistance = 0;
    for (var i in lines) {
      if (lines[i].Type === 'train' || lines[i].Type === 'bus' || lines[i].Type.text === 'train' || lines[i].Type.text) {
        accommodationKmDistance += Number(lines[i].distance / 10)
      };
    }
    var getOnPlane = false;
    for (var i in lines) {
      if (lines[i].Type === 'plane' || lines[i].Type.text === 'plane'){
        getOnPlane = true;
        break;
    };
  };
    var getOnTrain = false;
    for (var i in lines) {
      if (lines[i].Type === 'train' || lines[i].Type.text === 'train'){
        getOnTrain = true;
        break;
    };
  };
    
    const sumPrice = prices.reduce((v, price) => {
      if (/Teiki/.test(price.kind)) return v;
      if (price.selected !== 'true') return v;
      return price.Oneway + v;
    }, 0);

    const onPriceChange = (Price: any) =>
    Course[courseNum]===undefined?  
    onChange({
        ...data,
        ResultSet: {
          ...data.ResultSet,
          Course: [{ ...data.ResultSet.Course[0], Price }],
        },
      }):
      onChange({
        ...data,
        ResultSet: {
          ...data.ResultSet,
          Course: [{ ...data.ResultSet.Course[courseNum], Price }],
        },
      });//onPriceChangeするとCourse[0]にそのコースが当てはまりCourse[courseNum]がundefined
    const RouteComponents = [];
    for (let i = 0; i < points.length; i++) {
      RouteComponents.push(
        <PointComp key={i + points[i].Station.Name} point={points[i]} />
      );
      if (lines[i] != null) {
        RouteComponents.push(
          <LineComp
            key={i + lines[i].Name}
            lineIndex={i + 1}
            line={lines[i]}
            prices={prices}
            onPriceChange={onPriceChange}
          />
        );
      }
    }

    return (
      <Paper style={{ width: '100%', padding: 16 }}>
        <div id="printable">
          <p>所要時間：{time}分</p>
          <p>距離(電車のみ)：{kmDistance.toFixed(1)}km</p>
          <p>乗り換え：{transferCount}回</p>
          <p>運賃：{sumPrice}円</p>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {RouteComponents}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.print()
              onSubmit(
                generateMoveScheduleData({
                  kmDistance,
                  accommodationKmDistance,
                  fare: sumPrice,
                  lines,
                  points,
                  getOnPlane,
                  getOnTrain
                })
              )
            }
            }
          >
            決定(経路を印刷)
        </Button>
        </div>
      </Paper>

    );
  }
}
const generateMoveScheduleData = (obj: {
  kmDistance: number;
  accommodationKmDistance: number;
  fare: number;
  lines: any;
  points: any;
  getOnPlane: boolean;
  getOnTrain: boolean;
}): MoveScheduleData => {
  const { kmDistance, accommodationKmDistance, fare, lines, points, getOnPlane, getOnTrain } = obj;

  let text = '';
  for (let i = 0; i < points.length; i++) {
    text += points[i].Station.Name;
    if (lines[i] != null) {
      const departureTimeStr = new Date(lines[i].DepartureState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
      const arrivalTimeStr = new Date(lines[i].ArrivalState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
      text += `${departureTimeStr}〜${lines[i].Name}〜${arrivalTimeStr}`;
    }
  }
  const startHour = new Date(lines[0].DepartureState.Datetime.text).getHours();
  const endHour = new Date(
    lines[lines.length - 1].ArrivalState.Datetime.text
  ).getHours();

  return {
    type: 'move',
    text,
    fare,
    distance: Math.floor(kmDistance),
    accommodationDistance: Math.floor(accommodationKmDistance),
    startHour,
    endHour,
    getOnPlane,
    getOnTrain,
    payment: 'traveler'
  };
};
