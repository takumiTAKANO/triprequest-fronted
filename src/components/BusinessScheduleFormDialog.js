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
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
class BusinessScheduleFormDialog extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            text: '',
        };
    }
    render() {
        const { text } = this.state;
        const { open, onClose, onSubmit } = this.props;
        return (React.createElement(Dialog_1.default, { open: open, onClose: onClose },
            React.createElement(DialogTitle_1.default, null, "\u7528\u52D9\u306E\u8FFD\u52A0"),
            React.createElement(DialogContent_1.default, null,
                React.createElement(TextField_1.default, { autoFocus: true, fullWidth: true, label: "\u5185\u5BB9", value: text, onChange: e => this.setState({ text: e.target.value }) })),
            React.createElement(DialogActions_1.default, null,
                React.createElement(Button_1.default, { color: "primary", onClick: onClose }, "\u30AD\u30E3\u30F3\u30BB\u30EB"),
                React.createElement(Button_1.default, { color: "primary", onClick: () => onSubmit({ type: 'business', text }) }, "\u5B8C\u4E86"))));
    }
}
exports.default = BusinessScheduleFormDialog;
