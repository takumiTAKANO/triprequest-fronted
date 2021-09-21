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
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Point_1 = __importDefault(require("../components/Point"));
const Line_1 = __importDefault(require("../components/Line"));
function Route(props) {
    const { data, onChange, onSubmit } = props;
    const { Course } = data.ResultSet;
    const { Price, Route } = Course;
    const { timeOther, timeOnBoard, timeWalk, transferCount, distance, Line, Point, } = Route;
    const priceArray = Price.length == null ? [Price] : Price;
    const prices = priceArray.map(price => (Object.assign(Object.assign({}, price), { Oneway: typeof price.Oneway === 'object'
            ? Number(price.Oneway.text)
            : Number(price.Oneway) })));
    const lines = Line.length == null ? [Line] : Line;
    const points = Point.length == null ? [Point] : Point;
    const time = Number(timeOther) + Number(timeOnBoard) + Number(timeWalk);
    const kmDistance = Number(distance) / 10;
    const sumPrice = prices.reduce((v, price) => {
        if (/Teiki/.test(price.kind))
            return v;
        if (price.selected !== 'true')
            return v;
        return price.Oneway + v;
    }, 0);
    const onPriceChange = (Price) => onChange(Object.assign(Object.assign({}, data), { ResultSet: Object.assign(Object.assign({}, data.ResultSet), { Course: Object.assign(Object.assign({}, data.ResultSet.Course), { Price }) }) }));
    const RouteComponents = [];
    for (let i = 0; i < points.length; i++) {
        RouteComponents.push(React.createElement(Point_1.default, { key: i + points[i].Station.Name, point: points[i] }));
        if (lines[i] != null) {
            RouteComponents.push(React.createElement(Line_1.default, { key: i + lines[i].Name, lineIndex: i + 1, line: lines[i], prices: prices, onPriceChange: onPriceChange }));
        }
    }
    return (React.createElement(Paper_1.default, { style: { width: '100%', padding: 16 } },
        React.createElement("div", null,
            React.createElement("p", null,
                "\u6240\u8981\u6642\u9593\uFF1A",
                time,
                "\u5206"),
            React.createElement("p", null,
                "\u8DDD\u96E2\uFF1A",
                kmDistance,
                "km"),
            React.createElement("p", null,
                "\u4E57\u308A\u63DB\u3048\uFF1A",
                transferCount,
                "\u56DE"),
            React.createElement("p", null,
                "\u904B\u8CC3\uFF1A",
                sumPrice,
                "\u5186")),
        React.createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column' } }, RouteComponents),
        React.createElement("div", { style: { marginTop: 16 } },
            React.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => onSubmit(generateMoveScheduleData({
                    kmDistance,
                    fare: sumPrice,
                    lines,
                    points,
                })) }, "\u6C7A\u5B9A"))));
}
exports.default = Route;
const generateMoveScheduleData = (obj) => {
    const { kmDistance, fare, lines, points } = obj;
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
    const endHour = new Date(lines[lines.length - 1].ArrivalState.Datetime.text).getHours();
    return {
        type: 'move',
        text,
        fare,
        distance: Math.floor(kmDistance),
        startHour,
        endHour,
    };
};
