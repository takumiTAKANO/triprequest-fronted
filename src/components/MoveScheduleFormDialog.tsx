import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { MoveScheduleData } from '../types';
import { TripData } from '../types';
import {RadioGroup, FormControlLabel, Radio, FormLabel} from '@material-ui/core'
import { searchRoute } from '../lib/ekispert';
import StationSearchDialog from '../components/StationSearchDialog';
import Route from '../components/Route';
import { checkTrain } from '../lib/rule';
import { promised } from 'q';


type Props = {
  date: string; // yyyy-MM-dd
  open: boolean;
  tripData: TripData;
  onClose: () => void;
  onSubmit: (data: MoveScheduleData) => void;
};

type State = {
  loading: boolean;
  isOpenStationSearchDialogForDeparture: boolean;
  isOpenStationSearchDialogForArrival: boolean;
  isOpenStationSearchDialogForTransit: boolean;
  fromText: string;
  fromCode: string;
  toText: string;
  toCode: string;
  transitText:string;
  transitCode:string;
  time: string; // HH:mm
  searchType: string; // departure | arrival
  assignTeikiSerializeData: string;
  courseNum: number;


  priceNum: number;
  timeNum: number;
  transferNum: number;

  priority:string;

  selectingTab: string; // price | time | transfer
  priceResult: any;
  timeResult: any;
  transferResult: any;
};

export default class MoveScheduleFormDialog extends React.PureComponent<
  Props,
  State
  > {
  state: State = {
    loading: false,
    isOpenStationSearchDialogForDeparture: false,
    isOpenStationSearchDialogForArrival: false,
    isOpenStationSearchDialogForTransit: false,
    fromText: '',
    fromCode: '',
    toText: '',
    toCode: '',
    transitText:'',
    transitCode:'',
    time: '',
    searchType: 'departure',
    assignTeikiSerializeData: '',
    courseNum: 0,

    priceNum: 0,
    timeNum: 0,
    transferNum: 0,

    priority:'',

    selectingTab: 'transfer',
    priceResult: null,
    timeResult: null,
    transferResult: null,
  };

  search = () => {
    const { tripData, date, } = this.props;
    const {
      tripClass,
      priceType
    } = tripData;
    const {
      fromCode,
      toCode,
      transitCode,
      time,
      searchType,
      priority
    } = this.state;
    const searchData = { from: fromCode, to: toCode, date, time, searchType, priceType, transit: transitCode };

    this.setState({ loading: true });

    const assignTeikiSerializeData = (String)(localStorage.getItem("assignTeikiSerializeData"))

    Promise.all([
      searchRoute({ ...searchData, sort: 'price', assignTeikiSerializeData,priority }),
      searchRoute({ ...searchData, sort: 'time', assignTeikiSerializeData,priority }),
      searchRoute({ ...searchData, sort: 'transfer', assignTeikiSerializeData,priority }),
    ]).then(([priceResult, timeResult, transferResult]) => {
      console.log(priceResult);
      var isWayToNaritaAirport = ((toCode === '22392') || (toCode === '29573') || (toCode === '29574') || (toCode === '304034') || (toCode === '29110')
        || (fromCode === '22392') || (fromCode === '29573') || (fromCode === '29574') || (fromCode === '304034') || (fromCode === '29110'));
      var hasOnlyReservedSeats = false;//あまり使われないルールなため常にfalseにしてある
      var isShinkansen = true;//グリーン席は偉い人の身のため今回はルールから除外

      (async () => {
        for (var i = 0; i < (priceResult.ResultSet.Course).length; i++) {
          var priceOneWayDistance = parseInt(priceResult.ResultSet.Course[i].Route.distance) / 10.0;
          var priceCheck = true;
          for (let priceLine of priceResult.ResultSet.Course[i].Route.Line) {
            var priceDistanceForTheSameTrainSection = parseInt(priceLine.distance) / 10.0;
            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: priceDistanceForTheSameTrainSection,
              oneWayDistance: priceOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (priceLine.Type.detail === "shinkansen") {
                  priceCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((priceLine.Type.detail === "liner") || (priceLine.Typedetail === "limitedExpress")) {
                  priceCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((priceLine.Type.detail === "shinkansen") || (priceLine.Type.detail === "liner") || (priceLine.Type.detail === "limitedExpress")) {
                  priceCheck = false;
                }
              }
            })
          }
          if (priceCheck === true) {
            if (i === priceResult.ResultSet.Course.length - 1) {
              alert("適当な最安経路が見つからないため最短か最小乗換の経路をご利用ください");
              this.setState({ priceNum: i });
            } else {
              this.setState({ priceNum: i });
              break;
            }
          }

        }
      })();

      (async () => {
        for (var i = 0; i < (timeResult.ResultSet.Course).length; i++) {
          var timeOneWayDistance = parseInt(timeResult.ResultSet.Course[i].Route.distance) / 10.0;
          var timeCheck = true;
          for (let timeLine of timeResult.ResultSet.Course[i].Route.Line) {
            var timeDistanceForTheSameTrainSection = parseInt(timeLine.distance) / 10.0;

            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: timeDistanceForTheSameTrainSection,
              oneWayDistance: timeOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (timeLine.Type.detail === "shinkansen") {
                  timeCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((timeLine.Type.detail === "liner") || (timeLine.Typedetail === "limitedExpress")) {
                  timeCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((timeLine.Type.detail === "shinkansen") || (timeLine.Type.detail === "liner") || (timeLine.Type.detail === "limitedExpress")) {
                  timeCheck = false;
                }
              }
            })
          }
          if (timeCheck === true) {
            if (i === timeResult.ResultSet.Course.length - 1) {
              alert("適当な最短経路が見つからないため最安か最小乗換の経路をご利用ください");
              this.setState({ timeNum: i });
            } else {
              this.setState({ timeNum: i });
              break;
            }
          }

        }
      })();

      (async () => {
        for (var i = 0; i < (transferResult.ResultSet.Course).length; i++) {
          var transferOneWayDistance = parseInt(transferResult.ResultSet.Course[i].Route.distance) / 10.0
          var transferCheck = true;
          for (let transferLine of transferResult.ResultSet.Course[i].Route.Line) {

            var transferDistanceForTheSameTrainSection = parseInt(transferLine.distance) / 10.0;

            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: transferDistanceForTheSameTrainSection,
              oneWayDistance: transferOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (transferLine.Type.detail === "shinkansen") {
                  transferCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((transferLine.Type.detail === "liner") || (transferLine.Typedetail === "limitedExpress")) {
                  transferCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((transferLine.Type.detail === "shinkansen") || (transferLine.Type.detail === "liner") || (transferLine.Type.detail === "limitedExpress")) {
                  transferCheck = false;
                }
              }
            })
          } if (transferCheck === true) {
            if (i === transferResult.ResultSet.Course.length - 1) {
              alert("適切な最少乗換の経路が存在しないため最安か最短経路をご利用ください");
              this.setState({ transferNum: i });
            } else {
              this.setState({ transferNum: i });
              break;
            }
          }
        }
      })();
      this.setState({
        loading: false,
        priceResult,
        timeResult,
        transferResult,
      });
    });
  };

  render() {
    const { date, open, onClose, onSubmit } = this.props;
    const {
      loading,
      isOpenStationSearchDialogForDeparture,
      isOpenStationSearchDialogForArrival,
      isOpenStationSearchDialogForTransit,
      fromText,
      fromCode,
      toText,
      toCode,
      transitText,
      transitCode,
      time,
      searchType,
      priceNum,
      timeNum,
      transferNum,

      priority,

      selectingTab,
      priceResult,
      timeResult,
      transferResult,
    } = this.state;

    const isValid =
      fromCode !== '' && toCode !== '' && time !== '' && searchType !== '' && fromCode !== toCode;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}

      >
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {date}の移動日程追加
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                variant="contained"
                color="secondary"
                onClick={() => window.open("./doc/出張お助けAI利用マニュアル.pdf")}
              >
                利用マニュアル
                </Button>
            </Typography>
            <Button color="inherit" onClick={onClose}>
              キャンセル
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ margin: 16 }}>
          <div style={{ display: 'flex' }}>
            <div>
              <div>
                <label style={{ marginRight: 8 }}>出発地：{fromText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpenStationSearchDialogForDeparture: true,
                    })
                  }
                >
                  設定する
                </Button>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ marginRight: 8 }}>目的地：{toText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({ isOpenStationSearchDialogForArrival: true })
                  }
                >
                  設定する
                </Button>
              </div>
              

              
              <div>
            </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.setState(state => ({
                    fromText: state.toText,
                    fromCode: state.toCode,
                    toText: state.fromText,
                    toCode: state.fromCode,
                  }));
                }}
              >
                ↑↓出発地と目的地を入れ替え
              </Button>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
                <label style={{ marginRight: 8 }}>経由地：{transitText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({ isOpenStationSearchDialogForTransit: true })
                  }
                >
                  設定する
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                            variant="contained"
                            color="inherit"
                            onClick={() => {
                                    this.setState({
                                        transitCode: '',
                                        transitText: '',
                                    })
                            }
                            }
                        >
                            リセット
                                 </Button>
                </div>

          <div style={{ marginTop: 16 }}>
            <TextField
              type="time"
              label="時間"
              InputLabelProps={{ shrink: true }}
              value={time}
              onChange={e => this.setState({ time: e.target.value })}
            />
            <TextField
              select
              SelectProps={{ native: true }}
              label="時間指定"
              value={searchType}
              onChange={e => this.setState({ searchType: e.target.value })}
            >
              <option value="departure">出発</option>
              <option value="arrival">到着</option>
            </TextField>
          </div>
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
              disabled={!isValid || loading}
              onClick={this.search}
            >
              検索する
            </Button>

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
        </div>
        <Paper>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={selectingTab}
            onChange={(_, v) => this.setState({ selectingTab: v })}
          >
            <Tab label="最小乗換" value="transfer"
              disabled={transferResult !== null && transferNum === transferResult.ResultSet.Course.length - 1} />
            <Tab label="最短時間" value="time"
              disabled={timeResult !== null && timeNum === timeResult.ResultSet.Course.length - 1} />
            <Tab label="最安料金" value="price"
              disabled={priceResult !== null && priceNum === priceResult.ResultSet.Course.length - 1} />

          </Tabs>
        </Paper>
        {selectingTab === 'transfer' && transferResult != null && (
          <Route
            data={transferResult}
            courseNum={transferNum}
            onChange={data => this.setState({ transferResult: data })}
            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'time' && timeResult != null && (
          <Route
            data={timeResult}
            courseNum={timeNum}
            onChange={data => this.setState({ timeResult: data })}
            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'price' && priceResult != null && (
          <Route
            data={priceResult}
            courseNum={priceNum}
            onChange={data => this.setState({ priceResult: data })}

            onSubmit={onSubmit}
          />
        )}


        <StationSearchDialog
          open={isOpenStationSearchDialogForDeparture}
          onClose={() =>
            this.setState({ isOpenStationSearchDialogForDeparture: false })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForDeparture: false,
              fromCode: data.code,
              fromText: data.name,
            })
          }
        />
        <StationSearchDialog
          open={isOpenStationSearchDialogForArrival}
          onClose={() =>
            this.setState({ isOpenStationSearchDialogForArrival: false })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForArrival: false,
              toCode: data.code,
              toText: data.name,
            })
          }
        />
        <StationSearchDialog
          open={isOpenStationSearchDialogForTransit}
          onClose={() =>
            this.setState({ isOpenStationSearchDialogForTransit: false })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForTransit: false,
              transitCode: data.code,
              transitText: data.name,
            })
          }
        />
      </Dialog>

    );
  }
}

const Transition = (props: any) => <Slide direction="up" {...props} />;
