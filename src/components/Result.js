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
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
function Result(props) {
    const { dayData } = props;
    const resultData = generateResultData(dayData);
    const resultDataText = resultData.reduce((text, data) => `${text}${data.month},${data.date},${data.body},${data.fare},,${data.accommodation},,${data.dailyAllowance},,\n`, '');
    const blob = new Blob([resultDataText], { type: 'text/plain' });
    const objectURL = window.URL.createObjectURL(blob);
    const download = () => {
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, 'triprequest.txt');
        }
    };
    return (React.createElement("div", { style: { margin: 16 } },
        React.createElement(Typography_1.default, { variant: "headline" }, "\u65E5\u7A0B\u8868"),
        React.createElement(Paper_1.default, { style: { width: '100%', marginTop: 16 } },
            React.createElement(Table_1.default, null,
                React.createElement(TableHead_1.default, null,
                    React.createElement(TableRow_1.default, null,
                        React.createElement(TableCell_1.default, null, "\u6708"),
                        React.createElement(TableCell_1.default, null, "\u65E5"),
                        React.createElement(TableCell_1.default, null, "\u65E5\u7A0B"),
                        React.createElement(TableCell_1.default, null, "\u904B\u8CC3(\u5186)"),
                        React.createElement(TableCell_1.default, null, "\u5BBF\u6CCA\u6599(\u5186)"),
                        React.createElement(TableCell_1.default, null, "\u65E5\u5F53(\u5186)"))),
                React.createElement(TableBody_1.default, null, resultData.map(data => (React.createElement(TableRow_1.default, { key: data.month + data.date + data.body },
                    React.createElement(TableCell_1.default, null, data.month),
                    React.createElement(TableCell_1.default, null, data.date),
                    React.createElement(TableCell_1.default, null, data.body),
                    React.createElement(TableCell_1.default, null, data.fare),
                    React.createElement(TableCell_1.default, null, data.accommodation),
                    React.createElement(TableCell_1.default, null, data.dailyAllowance))))))),
        React.createElement(Button_1.default, { style: { marginTop: 16 }, variant: "contained", color: "primary", onClick: download, href: objectURL, component: "a", download: "triprequest.txt" }, "\u30D5\u30A1\u30A4\u30EB\u4FDD\u5B58")));
}
exports.default = Result;
const generateResultData = (dayData) => {
    let resultData = [];
    dayData.forEach(data => {
        const month = data.date.slice(5, 7);
        const date = data.date.slice(8, 10);
        if (data.schedules.length === 0) {
            resultData.push({
                month,
                date,
                body: '日程なし',
                fare: '',
                accommodation: String(data.accommodationAmount),
                dailyAllowance: String(data.dailyAllowanceAmount),
            });
            return;
        }
        const firstSchedule = data.schedules[0];
        resultData.push({
            month,
            date,
            body: firstSchedule.text,
            fare: firstSchedule.type === 'move' ? String(firstSchedule.fare) : '',
            accommodation: String(data.accommodationAmount),
            dailyAllowance: String(data.dailyAllowanceAmount),
        });
        for (let i = 1; i < data.schedules.length; i++) {
            let schedule = data.schedules[i];
            resultData.push({
                month: '',
                date: '',
                body: schedule.text,
                fare: schedule.type === 'move' ? String(schedule.fare) : '',
                accommodation: '',
                dailyAllowance: '',
            });
        }
    });
    return resultData;
};
