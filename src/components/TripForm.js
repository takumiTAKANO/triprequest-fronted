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
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const constants_1 = require("../constants");
function TripForm(props) {
    const { tripData, onChange, onSubmit } = props;
    const { jobTitle, tripClass, startDate, endDate, destination } = tripData;
    const isValid = jobTitle !== '' &&
        tripClass !== '' &&
        startDate !== '' &&
        endDate !== '' &&
        destination !== '';
    return (React.createElement("div", { style: styles.form },
        React.createElement(Typography_1.default, { variant: "headline" }, "\u51FA\u5F35\u5168\u4F53"),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(TextField_1.default, { select: true, label: "\u8077\u540D", value: jobTitle, onChange: e => {
                    onChange(Object.assign(Object.assign({}, tripData), { jobTitle: e.target.value }));
                }, SelectProps: { native: true } }, constants_1.JobTitles.map(j => (React.createElement("option", { key: j, value: j }, j))))),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(TextField_1.default, { select: true, label: "\u51FA\u5F35\u5206\u985E", value: tripClass, onChange: e => {
                    onChange(Object.assign(Object.assign({}, tripData), { tripClass: e.target.value }));
                }, SelectProps: { native: true } }, constants_1.TripClasses.map(t => (React.createElement("option", { key: t, value: t }, t))))),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(TextField_1.default, { type: "date", label: "\u958B\u59CB\u65E5", inputProps: { max: endDate }, InputLabelProps: { shrink: true }, value: startDate, onChange: e => {
                    onChange(Object.assign(Object.assign({}, tripData), { startDate: e.target.value }));
                } })),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(TextField_1.default, { type: "date", label: "\u7D42\u4E86\u65E5", inputProps: { min: startDate }, InputLabelProps: { shrink: true }, value: endDate, onChange: e => {
                    onChange(Object.assign(Object.assign({}, tripData), { endDate: e.target.value }));
                } })),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(TextField_1.default, { label: "\u76EE\u7684\u5730", value: destination, onChange: e => {
                    onChange(Object.assign(Object.assign({}, tripData), { destination: e.target.value }));
                } })),
        React.createElement("div", { style: styles.wrapper },
            React.createElement(Button_1.default, { variant: "contained", color: "primary", disabled: !isValid, onClick: onSubmit }, "\u6B21\u3078"))));
}
exports.default = TripForm;
const styles = {
    form: {
        margin: 16,
    },
    wrapper: {
        marginTop: 16,
    },
};
