"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const rule_1 = require("../lib/rule");
const BusinessScheduleFormDialog_1 = __importDefault(require("../components/BusinessScheduleFormDialog"));
const MoveScheduleFormDialog_1 = __importDefault(require("../components/MoveScheduleFormDialog"));
class DayForm extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
            showBusinessForm: false,
            showMoveForm: false,
        };
        this.calcAmount = () => {
            this.setState({ loading: true });
            const { tripData, dayData, onChange } = this.props;
            const { jobTitle, tripClass, startDate, endDate, destination, maxDistance, } = tripData;
            const { date, schedules } = dayData;
            const isOnMove = schedules.some(schedule => schedule.type === 'move');
            const isOnBusiness = schedules.some(schedule => schedule.type === 'business');
            const oneWayDistanceFromDayData = schedules.reduce((distance, schedule) => {
                if (schedule.type !== 'move')
                    return distance;
                return schedule.distance + distance;
            }, 0); // 移動日程のdistanceを合計したものを使う
            const oneWayDistance = oneWayDistanceFromDayData > maxDistance
                ? oneWayDistanceFromDayData
                : maxDistance; // これまでの移動距離で最大のものをルール実行では使う
            const roundTripDistance = oneWayDistance * 2;
            const stayClass = (() => {
                if (startDate === endDate)
                    return '日帰り';
                if (date === startDate)
                    return '宿泊(出発日)';
                if (date === endDate)
                    return '宿泊(帰着日)';
                return '宿泊(滞在日)';
            })();
            const firstMoveData = schedules.find(schedule => schedule.type === 'move');
            const departureHour = firstMoveData != null && firstMoveData.type === 'move'
                ? firstMoveData.startHour
                : 0;
            const returnHour = schedules.reduce((hour, schedule) => {
                if (schedule.type !== 'move')
                    return hour;
                return schedule.endHour;
            }, 24); // 最後の移動日程のendHourをセットする
            const isInFlightNight = false; // 移動データからチェックしたい
            const transportation = '鉄道'; // 移動データからチェックしたい
            Promise.all([
                rule_1.checkAccommodation({
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
                rule_1.checkDailyAllowance({
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
                const { accommodationAmount, accommodationIsReasonStatementNecessary, accommodationDescription, } = accommodationData;
                const { dailyAllowanceAmount, dailyAllowanceDescription, } = dailyAllowanceData;
                onChange(Object.assign(Object.assign({}, dayData), { accommodationAmount,
                    accommodationIsReasonStatementNecessary,
                    accommodationDescription,
                    dailyAllowanceAmount,
                    dailyAllowanceDescription }));
                this.setState({ loading: false });
            });
        };
    }
    render() {
        const { loading, showBusinessForm, showMoveForm } = this.state;
        const { dayData, onChange, onSubmit } = this.props;
        const { date, schedules, accommodationAmount, accommodationIsReasonStatementNecessary, accommodationDescription, dailyAllowanceAmount, dailyAllowanceDescription, } = dayData;
        const isValid = accommodationAmount != null && dailyAllowanceAmount != null;
        return (React.createElement("div", { style: { margin: 16 } },
            React.createElement(Typography_1.default, { variant: "headline" }, date),
            React.createElement("div", null, schedules.map(s => (React.createElement(Paper_1.default, { key: s.text, style: { marginTop: 8, padding: 8 } }, s.text + (s.type === 'move' ? `(${s.fare}円)` : ''))))),
            React.createElement("div", { style: { marginTop: 16 } },
                React.createElement(Button_1.default, { variant: "contained", onClick: () => {
                        this.setState({ showBusinessForm: true });
                    } }, "\u7528\u52D9\u3092\u8FFD\u52A0"),
                React.createElement("span", { style: { margin: 8 } }),
                React.createElement(Button_1.default, { variant: "contained", onClick: () => {
                        this.setState({ showMoveForm: true });
                    } }, "\u79FB\u52D5\u3092\u8FFD\u52A0")),
            React.createElement("div", { style: {
                    display: 'inline-block',
                    position: 'relative',
                    marginTop: 16,
                } },
                React.createElement(Button_1.default, { variant: "contained", color: "primary", disabled: loading, onClick: this.calcAmount }, "\u5BBF\u6CCA\u6599\u3001\u65E5\u5F53\u3092\u8A08\u7B97\u3059\u308B"),
                loading && (React.createElement(CircularProgress_1.default, { size: 24, color: "secondary", style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: -12,
                        marginLeft: -12,
                    } }))),
            React.createElement("div", null,
                accommodationAmount != null && (React.createElement("p", null,
                    "\u5BBF\u6CCA\u6599\uFF1A",
                    accommodationAmount,
                    "\u5186")),
                accommodationIsReasonStatementNecessary != null && (React.createElement("p", null,
                    "\u5BBF\u6CCA\u6599\u306E\u305F\u3081\u306B\u7406\u7531\u66F8\u304C\u5FC5\u8981\u304B\uFF1A",
                    accommodationIsReasonStatementNecessary)),
                accommodationDescription != null && (React.createElement("p", null,
                    "\u5BBF\u6CCA\u6599\u306B\u3064\u3044\u3066\u306E\u8AAC\u660E\uFF1A",
                    accommodationDescription)),
                dailyAllowanceAmount != null && (React.createElement("p", null,
                    "\u65E5\u5F53\uFF1A",
                    dailyAllowanceAmount,
                    "\u5186")),
                dailyAllowanceDescription != null && (React.createElement("p", null,
                    "\u65E5\u5F53\u306B\u3064\u3044\u3066\u306E\u8AAC\u660E\uFF1A",
                    dailyAllowanceDescription))),
            React.createElement("div", { style: { marginTop: 16 } },
                React.createElement(Button_1.default, { variant: "contained", color: "primary", disabled: !isValid, onClick: onSubmit }, "\u5B8C\u4E86")),
            React.createElement(BusinessScheduleFormDialog_1.default, { open: showBusinessForm, onClose: () => this.setState({ showBusinessForm: false }), onSubmit: data => {
                    onChange(Object.assign(Object.assign({}, dayData), { schedules: [...dayData.schedules, data] }));
                    this.setState({ showBusinessForm: false });
                } }),
            React.createElement(MoveScheduleFormDialog_1.default, { date: date, open: showMoveForm, onClose: () => this.setState({ showMoveForm: false }), onSubmit: data => {
                    onChange(Object.assign(Object.assign({}, dayData), { schedules: [...dayData.schedules, data] }));
                    this.setState({ showMoveForm: false });
                } })));
    }
}
exports.default = DayForm;
