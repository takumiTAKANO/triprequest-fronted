"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
function Line(props) {
    const { lineIndex, line, prices, onPriceChange } = props;
    const stopStationCount = line.stopStationCount;
    const kmDistance = Number(line.distance) / 10;
    const colorR = Math.floor(Number(line.Color) / 1000000);
    const colorG = Math.floor(Number(line.Color) / 1000) % 1000;
    const colorB = Number(line.Color) % 1000;
    const departureTimeStr = new Date(line.DepartureState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
    const arrivalTimeStr = new Date(line.ArrivalState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
    const farePrices = prices.filter(price => price.kind === 'Fare' && Number(price.fromLineIndex) === lineIndex);
    const FarePricesComp = (() => {
        if (farePrices.length === 0)
            return null;
        if (farePrices.length === 1) {
            return (React.createElement("div", null,
                React.createElement("span", null, "\u904B\u8CC3\uFF1A"),
                React.createElement("span", null,
                    farePrices[0].Oneway,
                    "\u5186")));
        }
        else {
            const selectedFarePrice = farePrices.filter(price => price.selected === 'true')[0];
            return (React.createElement("div", null,
                React.createElement("span", null, "\u904B\u8CC3\uFF1A"),
                React.createElement("select", { value: selectedFarePrice.index, onChange: e => {
                        onPriceChange(modifyPrice({
                            prices,
                            kind: 'Fare',
                            fromLineIndex: String(lineIndex),
                            oldSelectedPriceIndex: selectedFarePrice.index,
                            newSelectedPriceIndex: e.target.value,
                        }));
                    } }, farePrices.map(price => (React.createElement("option", { key: price.kind + price.index, value: price.index },
                    price.Name,
                    " ",
                    price.Oneway,
                    "\u5186"))))));
        }
    })();
    const chargePrices = prices.filter(price => price.kind === 'Charge' && Number(price.fromLineIndex) === lineIndex);
    const ChargePricesComp = (() => {
        if (chargePrices.length === 0)
            return null;
        if (chargePrices.length === 1) {
            return (React.createElement("div", null,
                React.createElement("span", null, "\u5EA7\u5E2D\u6599\u91D1\uFF1A"),
                React.createElement("span", null,
                    chargePrices[0].Oneway,
                    "\u5186")));
        }
        else {
            const selectedChargePrice = chargePrices.filter(price => price.selected === 'true')[0];
            return (React.createElement("div", null,
                React.createElement("span", null, "\u5EA7\u5E2D\u6599\u91D1\uFF1A"),
                React.createElement("select", { value: selectedChargePrice.index, onChange: e => {
                        onPriceChange(modifyPrice({
                            prices,
                            kind: 'Charge',
                            fromLineIndex: String(lineIndex),
                            oldSelectedPriceIndex: selectedChargePrice.index,
                            newSelectedPriceIndex: e.target.value,
                        }));
                    } }, chargePrices.map(price => (React.createElement("option", { key: price.kind + price.index, value: price.index },
                    price.Name,
                    " ",
                    price.Oneway,
                    "\u5186"))))));
        }
    })();
    return (React.createElement("div", { style: { display: 'flex' } },
        React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 8,
                fontSize: 12,
            } },
            React.createElement("div", null,
                stopStationCount,
                "\u99C5"),
            React.createElement("div", null,
                kmDistance,
                "km")),
        React.createElement("div", { style: {
                flexGrow: 1,
                padding: 8,
                marginLeft: 8,
                borderLeft: `4px solid rgb(${colorR}, ${colorG}, ${colorB})`,
            } },
            React.createElement("div", { style: { fontSize: 12, marginBottom: 8 } },
                departureTimeStr,
                "\u767A"),
            React.createElement("div", null, line.Name),
            React.createElement("div", { style: { fontSize: 12, marginTop: 8 } },
                arrivalTimeStr,
                "\u7740")),
        React.createElement("div", null,
            FarePricesComp,
            ChargePricesComp)));
}
exports.default = Line;
const modifyPrice = (obj) => {
    const { prices, kind, fromLineIndex, oldSelectedPriceIndex, newSelectedPriceIndex, } = obj;
    return prices.map((price) => {
        if (price.kind === kind && price.fromLineIndex === fromLineIndex) {
            if (price.index === oldSelectedPriceIndex) {
                return Object.assign(Object.assign({}, price), { selected: 'false' });
            }
            if (price.index === newSelectedPriceIndex) {
                return Object.assign(Object.assign({}, price), { selected: 'true' });
            }
        }
        return price;
    });
};
