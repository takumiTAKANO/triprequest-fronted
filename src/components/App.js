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
const CssBaseline_1 = __importDefault(require("@material-ui/core/CssBaseline"));
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const constants_1 = require("../constants");
const TripForm_1 = __importDefault(require("../components/TripForm"));
const DayForm_1 = __importDefault(require("../components/DayForm"));
const Result_1 = __importDefault(require("../components/Result"));
class App extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            step: 1,
            tripData: {
                jobTitle: constants_1.JobTitles[0],
                tripClass: constants_1.TripClasses[0],
                startDate: '',
                endDate: '',
                destination: '',
                maxDistance: 0,
            },
            editingDayDataIndex: 0,
            dayData: [],
        };
        this.onTripFormChange = (tripData) => this.setState({ tripData });
        this.onTripFormSubmit = (_) => this.setState(state => (Object.assign(Object.assign({}, state), { step: state.step + 1, editingDayDataIndex: 0, dayData: [constants_1.InitialDayData(state.tripData, 0)] })));
        this.onDayFormChange = (dayData) => this.setState(state => (Object.assign(Object.assign({}, state), { dayData: [
                ...state.dayData.slice(0, state.editingDayDataIndex),
                dayData,
                ...state.dayData.slice(state.editingDayDataIndex + 1),
            ] })));
        this.onDayFormSubmit = (_) => this.setState(state => {
            const dayData = state.dayData[state.editingDayDataIndex];
            const dayDataDistance = dayData.schedules.reduce((distance, schedule) => {
                if (schedule.type !== 'move')
                    return distance;
                return schedule.distance + distance;
            }, 0);
            const maxDistance = dayDataDistance > state.tripData.maxDistance
                ? dayDataDistance
                : state.tripData.maxDistance;
            if (state.dayData[state.editingDayDataIndex].date === state.tripData.endDate) {
                return Object.assign(Object.assign({}, state), { tripData: Object.assign(Object.assign({}, state.tripData), { maxDistance }), step: state.step + 1 });
            }
            else {
                return Object.assign(Object.assign({}, state), { tripData: Object.assign(Object.assign({}, state.tripData), { maxDistance }), editingDayDataIndex: state.editingDayDataIndex + 1, dayData: [
                        ...state.dayData,
                        constants_1.InitialDayData(state.tripData, state.editingDayDataIndex + 1),
                    ] });
            }
        });
    }
    render() {
        const { step, tripData, editingDayDataIndex, dayData } = this.state;
        return (React.createElement(React.Fragment, null,
            React.createElement(CssBaseline_1.default, null),
            React.createElement(AppBar_1.default, { position: "static" },
                React.createElement(Toolbar_1.default, null,
                    React.createElement(Typography_1.default, { variant: "h6", color: "inherit" }, "\u51FA\u5F35\u65C5\u8CBB\u7533\u8ACB"))),
            step === 1 && (React.createElement(TripForm_1.default, { tripData: tripData, onChange: this.onTripFormChange, onSubmit: this.onTripFormSubmit })),
            step === 2 && (React.createElement(DayForm_1.default, { tripData: tripData, dayData: dayData[editingDayDataIndex], onChange: this.onDayFormChange, onSubmit: this.onDayFormSubmit })),
            step === 3 && React.createElement(Result_1.default, { dayData: dayData })));
    }
}
exports.default = App;
