import * as React from 'react';

type Props = {
  lineIndex: number;
  line: any;
  prices: Array<any>;
  onPriceChange: (data: any) => void;
};

export default function Line(props: Props) {
  const { lineIndex, line, prices, onPriceChange } = props;

  const stopStationCount = line.stopStationCount;
  const kmDistance = line.Type === 'train' || line.Type.text === 'train'
    ? Number(line.distance) / 10 : 0;//電車のみ
  const colorR = Math.floor(Number(line.Color) / 1000000);
  const colorG = Math.floor(Number(line.Color) / 1000) % 1000;
  const colorB = Number(line.Color) % 1000;
  const departureTimeStr = new Date(line.DepartureState.Datetime.text)
    .toTimeString()
    .slice(0, 5);
  const arrivalTimeStr = new Date(line.ArrivalState.Datetime.text)
    .toTimeString()
    .slice(0, 5);

  const farePrices = prices.filter(
    price => price.kind === 'Fare' && Number(price.fromLineIndex) === lineIndex
  );
  const FarePricesComp = (() => {
    if (farePrices.length === 0) return null;
    if (farePrices.length === 1) {
      return (
        <div>
          <span>運賃：</span>
          <span>{farePrices[0].Oneway}円</span>
        </div>
      );
    } else {
      const selectedFarePrice = farePrices.filter(
        price => price.selected === 'true'
      )[0];
      return (
        <div>
          <span>運賃：</span>
          <select
            value={selectedFarePrice.index}
            onChange={e => {
              onPriceChange(
                modifyPrice({
                  prices,
                  kind: 'Fare',
                  fromLineIndex: String(lineIndex),
                  oldSelectedPriceIndex: selectedFarePrice.index,
                  newSelectedPriceIndex: e.target.value,
                }),

              );
            }}
          >
            {farePrices.map(price => (
              <option key={price.kind + price.index} value={price.index}>
                {price.Name} {price.Oneway}円
              </option>
            ))}
          </select>
        </div>
      );
    }
  })();
  const chargePrices = prices.filter(
    price =>
      price.kind === 'Charge' && Number(price.fromLineIndex) === lineIndex
  );
  const ChargePricesComp = (() => {
    if (chargePrices.length === 0) return null;
    if (chargePrices.length === 1) {
      return (
        <div>
          <span>座席料金：</span>
          <span>{chargePrices[0].Oneway}円</span>
        </div>
      );
    } else {
      const selectedChargePrice = chargePrices.filter(
        price => price.selected === 'true'
      )[0];
      return (
        <div>
          <span>座席料金：</span>
          <select
            value={selectedChargePrice.index}
            onChange={e => {
              onPriceChange(
                modifyPrice({
                  prices,
                  kind: 'Charge',
                  fromLineIndex: String(lineIndex),
                  oldSelectedPriceIndex: selectedChargePrice.index,
                  newSelectedPriceIndex: e.target.value,
                }),

              );
            }}
          >
            {chargePrices.map(price => (
              <option key={price.kind + price.index} value={price.index}>
                {price.Name} {price.Oneway}円
              </option>
            ))}
          </select>
        </div>
      );
    }
  })();

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 8,
          fontSize: 12,
        }}
      >
        <div>{stopStationCount}駅</div>
        <div>{kmDistance}km</div>
      </div>
      <div
        style={{
          flexGrow: 1,
          padding: 8,
          marginLeft: 8,
          borderLeft: `4px solid rgb(${colorR}, ${colorG}, ${colorB})`,
        }}
      >
        <div style={{ fontSize: 12, marginBottom: 8 }}>
          {departureTimeStr}発
        </div>
        <div>{line.Name}</div>
        <div style={{ fontSize: 12, marginTop: 8 }}>{arrivalTimeStr}着</div>
      </div>
      <div>
        {FarePricesComp}
        {ChargePricesComp}
      </div>
    </div>
  );
}

const modifyPrice = (obj: {
  prices: any;
  kind: string;
  fromLineIndex: string;
  oldSelectedPriceIndex: string;
  newSelectedPriceIndex: string;
}): any => {
  const {
    prices,
    kind,
    fromLineIndex,
    oldSelectedPriceIndex,
    newSelectedPriceIndex,
  } = obj;

  return prices.map((price: any) => {
    if (price.kind === kind && price.fromLineIndex === fromLineIndex) {
      if (price.index === oldSelectedPriceIndex) {
        return {
          ...price,
          selected: 'false',
        };
      }
      if (price.index === newSelectedPriceIndex) {
        return {
          ...price,
          selected: 'true',
        };
      }
    }
    return price;
  });
};