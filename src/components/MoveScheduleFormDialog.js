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
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const Slide_1 = __importDefault(require("@material-ui/core/Slide"));
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const ekispert_1 = require("../lib/ekispert");
const ekispert_2 = require("../lib/ekispert");
const ekispert_3 = require("../lib/ekispert");
const StationSearchDialog_1 = __importDefault(require("../components/StationSearchDialog"));
const Route_1 = __importDefault(require("../components/Route"));
class MoveScheduleFormDialog extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
            passStart: false,
            passEnd: false,
            isOpenStationSearchDialogForDeparture: false,
            isOpenStationSearchDialogForArrival: false,
            isOpenStationSearchDialogForPassStart: false,
            isOpenStationSearchDialogForPassEnd: false,
            fromText: '',
            fromCode: '',
            toText: '',
            toCode: '',
            passFromText: '',
            passFromCode: '',
            passToText: '',
            passToCode: '',
            time: '',
            searchType: 'departure',
            assignTeikiSerializeData: '',
            selectingTab: 'price',
            priceResult: null,
            timeResult: null,
            transferResult: null,
        };
        /*}
          pass = () => {
            const { } = this.props;
            const { passFromCode, passToCode, searchType } = this.state;
            const searchData = { passFrom: passFromCode, passTo: passToCode, searchType };
        
            this.setState({ loading: true });
        
            getPass({ ...searchData, sort: 'time' })
              .then((json) => {
                console.log(json.ResultSet.Course.Teiki.SerializeData),
                  this.setState({
                    loading: false,
                    assignTeikiSerializeData: json.ResultSet.Course.Teiki.SerializeData
                  });
              });
          };
        */
        this.search = () => {
            const { date } = this.props;
            const { fromCode, toCode, time, searchType, /*assignTeikiSerializeData,*/ passFromCode, passToCode, passStart, passEnd } = this.state;
            const searchData = { from: fromCode, to: toCode, date, time, searchType, /*teikiData: assignTeikiSerializeData,*/ passFrom: passFromCode, passTo: passToCode };
            this.setState({ loading: true });
            if (passStart && passEnd) {
                ekispert_3.getPass(Object.assign(Object.assign({}, searchData), { sort: 'time' }))
                    .then((json) => {
                    Promise.all([
                        ekispert_1.searchRoute(Object.assign(Object.assign({}, searchData), { sort: 'price', teikiData: json.ResultSet.Course.Teiki.SerializeData })),
                        ekispert_1.searchRoute(Object.assign(Object.assign({}, searchData), { sort: 'time', teikiData: json.ResultSet.Course.Teiki.SerializeData })),
                        ekispert_1.searchRoute(Object.assign(Object.assign({}, searchData), { sort: 'transfer', teikiData: json.ResultSet.Course.Teiki.SerializeData })),
                    ]).then(([priceResult, timeResult, transferResult]) => {
                        this.setState({
                            loading: false,
                            priceResult,
                            timeResult,
                            transferResult,
                        });
                    });
                });
            }
            else {
                Promise.all([
                    ekispert_2.searchRoute2(Object.assign(Object.assign({}, searchData), { sort: 'price' })),
                    ekispert_2.searchRoute2(Object.assign(Object.assign({}, searchData), { sort: 'time' })),
                    ekispert_2.searchRoute2(Object.assign(Object.assign({}, searchData), { sort: 'transfer' })),
                ]).then(([priceResult, timeResult, transferResult]) => {
                    this.setState({
                        loading: false,
                        priceResult,
                        timeResult,
                        transferResult,
                    });
                });
            }
            ;
        };
    }
    render() {
        const { date, open, onClose, onSubmit } = this.props;
        const { loading, isOpenStationSearchDialogForDeparture, isOpenStationSearchDialogForArrival, isOpenStationSearchDialogForPassStart, isOpenStationSearchDialogForPassEnd, fromText, fromCode, toText, toCode, passFromText, passFromCode, passToText, passToCode, time, searchType, assignTeikiSerializeData, selectingTab, priceResult, timeResult, transferResult, } = this.state;
        const isValid = fromCode !== '' && toCode !== '' && time !== '' && searchType !== '';
        /*
            const isPassValid =
              passFromCode !== '' && passToCode !== '' && searchType !== '';
        */
        return (React.createElement(Dialog_1.default, { fullScreen: true, open: open, onClose: onClose, TransitionComponent: Transition },
            React.createElement(AppBar_1.default, { style: { position: 'relative' } },
                React.createElement(Toolbar_1.default, null,
                    React.createElement(Typography_1.default, { variant: "h6", color: "inherit", style: { flex: 1 } },
                        date,
                        "\u306E\u79FB\u52D5\u65E5\u7A0B\u8FFD\u52A0"),
                    React.createElement(Button_1.default, { color: "inherit", onClick: onClose }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))),
            React.createElement("div", { style: { margin: 16 } },
                React.createElement("div", { style: { display: 'flex' } },
                    React.createElement("div", null,
                        React.createElement("div", null,
                            React.createElement("label", { style: { marginRight: 8 } },
                                "\u51FA\u767A\u5730\uFF1A",
                                fromText),
                            React.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => this.setState({
                                    isOpenStationSearchDialogForDeparture: true,
                                }) }, "\u8A2D\u5B9A\u3059\u308B")),
                        React.createElement("div", { style: { marginTop: 16 } },
                            React.createElement("label", { style: { marginRight: 8 } },
                                "\u76EE\u7684\u5730\uFF1A",
                                toText),
                            React.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => this.setState({ isOpenStationSearchDialogForArrival: true }) }, "\u8A2D\u5B9A\u3059\u308B")),
                        React.createElement("div", { style: { marginTop: 16 } },
                            React.createElement("label", { style: { marginRight: 8 } },
                                "\u5B9A\u671F\u533A\u9593\uFF1A",
                                passFromText),
                            React.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => this.setState({
                                    isOpenStationSearchDialogForPassStart: true
                                }) }, "\u8A2D\u5B9A\u3059\u308B"),
                            React.createElement("label", { style: { marginRight: 8 } },
                                " \u301C",
                                passToText),
                            React.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => this.setState({
                                    isOpenStationSearchDialogForPassEnd: true
                                }) }, "\u8A2D\u5B9A\u3059\u308B"))),
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        React.createElement(Button_1.default, { variant: "contained", color: "secondary", onClick: () => {
                                this.setState(state => ({
                                    fromText: state.toText,
                                    fromCode: state.toCode,
                                    toText: state.fromText,
                                    toCode: state.fromCode,
                                }));
                            } }, "\u2191\u2193"))),
                React.createElement("div", { style: { marginTop: 16 } },
                    React.createElement(TextField_1.default, { type: "time", label: "\u6642\u9593", InputLabelProps: { shrink: true }, value: time, onChange: e => this.setState({ time: e.target.value }) }),
                    React.createElement(TextField_1.default, { select: true, SelectProps: { native: true }, label: "\u6642\u9593\u6307\u5B9A", value: searchType, onChange: e => this.setState({ searchType: e.target.value }) },
                        React.createElement("option", { value: "departure" }, "\u51FA\u767A"),
                        React.createElement("option", { value: "arrival" }, "\u5230\u7740"))),
                React.createElement("div", { style: {
                        display: 'inline-block',
                        position: 'relative',
                        marginTop: 16,
                    } },
                    React.createElement(Button_1.default, { variant: "contained", color: "primary", disabled: !isValid || loading, onClick: this.search }, "\u691C\u7D22\u3059\u308B"),
                    loading && (React.createElement(CircularProgress_1.default, { size: 24, color: "secondary", style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -12,
                            marginLeft: -12,
                        } })))),
            React.createElement(Paper_1.default, null,
                React.createElement(Tabs_1.default, { indicatorColor: "primary", textColor: "primary", variant: "fullWidth", value: selectingTab, onChange: (_, v) => this.setState({ selectingTab: v }) },
                    React.createElement(Tab_1.default, { label: "\u6700\u5B89\u6599\u91D1", value: "price" }),
                    React.createElement(Tab_1.default, { label: "\u6700\u77ED\u6642\u9593", value: "time" }),
                    React.createElement(Tab_1.default, { label: "\u6700\u5C0F\u4E57\u63DB", value: "transfer" }))),
            selectingTab === 'price' && priceResult != null && (React.createElement(Route_1.default, { data: priceResult, onChange: data => this.setState({ priceResult: data }), onSubmit: onSubmit })),
            selectingTab === 'time' && timeResult != null && (React.createElement(Route_1.default, { data: timeResult, onChange: data => this.setState({ timeResult: data }), onSubmit: onSubmit })),
            selectingTab === 'transfer' && transferResult != null && (React.createElement(Route_1.default, { data: transferResult, onChange: data => this.setState({ transferResult: data }), onSubmit: onSubmit })),
            React.createElement(StationSearchDialog_1.default, { open: isOpenStationSearchDialogForDeparture, onClose: () => this.setState({ isOpenStationSearchDialogForDeparture: false }), onSubmit: data => this.setState({
                    isOpenStationSearchDialogForDeparture: false,
                    fromCode: data.code,
                    fromText: data.name,
                }) }),
            React.createElement(StationSearchDialog_1.default, { open: isOpenStationSearchDialogForArrival, onClose: () => this.setState({ isOpenStationSearchDialogForArrival: false }), onSubmit: data => this.setState({
                    isOpenStationSearchDialogForArrival: false,
                    toCode: data.code,
                    toText: data.name,
                }) }),
            React.createElement(StationSearchDialog_1.default, { open: isOpenStationSearchDialogForPassStart, onClose: () => this.setState({
                    isOpenStationSearchDialogForPassStart: false
                }), onSubmit: data => this.setState({
                    isOpenStationSearchDialogForPassStart: false,
                    passFromCode: data.code,
                    passFromText: data.name,
                    passStart: true,
                }) }),
            React.createElement(StationSearchDialog_1.default, { open: isOpenStationSearchDialogForPassEnd, onClose: () => this.setState({
                    isOpenStationSearchDialogForPassEnd: false
                }), onSubmit: data => this.setState({
                    isOpenStationSearchDialogForPassEnd: false,
                    passEnd: true,
                    passToCode: data.code,
                    passToText: data.name,
                }) })));
    }
}
exports.default = MoveScheduleFormDialog;
const Transition = (props) => React.createElement(Slide_1.default, Object.assign({ direction: "up" }, props));
