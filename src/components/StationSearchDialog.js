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
const debounce_1 = __importDefault(require("lodash/debounce"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const List_1 = __importDefault(require("@material-ui/core/List"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const ekispert_1 = require("../lib/ekispert");
class StationSearchDialog extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            text: '',
            trainList: [],
            busList: [],
            planeList: [],
            shipList: [],
        };
        this.onTextChange = (e) => {
            const text = e.target.value;
            this.setState({ text });
            if (text === '')
                return;
            this.search(text);
        };
        this.search = debounce_1.default((text) => {
            ekispert_1.searchStation(text).then(list => {
                this.setState({
                    trainList: list
                        .filter(p => p.type === 'train')
                        .map(p => ({ code: p.code, name: p.name })),
                    busList: list
                        .filter(p => p.type === 'bus')
                        .map(p => ({ code: p.code, name: p.name })),
                    planeList: list
                        .filter(p => p.type === 'plane')
                        .map(p => ({ code: p.code, name: p.name })),
                    shipList: list
                        .filter(p => p.type === 'ship')
                        .map(p => ({ code: p.code, name: p.name })),
                });
            });
        }, 300);
    }
    render() {
        const { open, onClose, onSubmit } = this.props;
        const { text, trainList, busList, planeList, shipList } = this.state;
        return (React.createElement(Dialog_1.default, { open: open, onClose: onClose },
            React.createElement(DialogTitle_1.default, null, "\u5730\u70B9\u306E\u691C\u7D22"),
            React.createElement(DialogContent_1.default, null,
                React.createElement(TextField_1.default, { autoFocus: true, fullWidth: true, label: "\u540D\u79F0", value: text, onChange: this.onTextChange }),
                React.createElement(List_1.default, null,
                    React.createElement(ListItem_1.default, { disabled: true, divider: true },
                        React.createElement(ListItemText_1.default, { primary: "\u99C5" })),
                    trainList.map(p => (React.createElement(ListItem_1.default, { key: p.code, button: true, onClick: () => onSubmit(p) },
                        React.createElement(ListItemText_1.default, { primary: p.name })))),
                    React.createElement(Divider_1.default, null),
                    React.createElement(ListItem_1.default, { disabled: true, divider: true },
                        React.createElement(ListItemText_1.default, { primary: "\u30D0\u30B9\u505C" })),
                    busList.map(p => (React.createElement(ListItem_1.default, { key: p.code, button: true, onClick: () => onSubmit(p) },
                        React.createElement(ListItemText_1.default, { primary: p.name })))),
                    React.createElement(Divider_1.default, null),
                    React.createElement(ListItem_1.default, { disabled: true, divider: true },
                        React.createElement(ListItemText_1.default, { primary: "\u7A7A\u6E2F" })),
                    planeList.map(p => (React.createElement(ListItem_1.default, { key: p.code, button: true, onClick: () => onSubmit(p) },
                        React.createElement(ListItemText_1.default, { primary: p.name })))),
                    React.createElement(Divider_1.default, null),
                    React.createElement(ListItem_1.default, { disabled: true, divider: true },
                        React.createElement(ListItemText_1.default, { primary: "\u8239" })),
                    shipList.map(p => (React.createElement(ListItem_1.default, { key: p.code, button: true, onClick: () => onSubmit(p) },
                        React.createElement(ListItemText_1.default, { primary: p.name })))))),
            React.createElement(DialogActions_1.default, null,
                React.createElement(Button_1.default, { color: "primary", onClick: onClose }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))));
    }
}
exports.default = StationSearchDialog;
