import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PointComp from '../components/Point';
import LineComp from '../components/Line';

type Props = {
    data: any;
    teikiStart: string;
    teikiEnd: string;
    teikiStartCode: string;
    teikiEndCode: string;
    courseNum: number;
    onChange: (data: any) => void;
    onSubmit: () => void;
};

export default function TeikiRoute(props: Props) {
    const { data, courseNum, onChange, onSubmit, teikiStart, teikiEnd, teikiStartCode, teikiEndCode } = props;
    const { Course } = data.ResultSet;
    // const { Price, Route } = Course[courseNum];
    const { Price, Route } = Course[courseNum] === undefined ? Course[0] : Course[courseNum];
    const {
        timeOther,
        timeOnBoard,
        timeWalk,
        transferCount,
        distance,
        Line,
        Point,
    } = Route;
    var assignTeikiSerializeData = Course[courseNum] === undefined 
    ? (Course[0].Teiki === undefined ? '' : (String)(Course[0].Teiki.SerializeData)) 
    : (Course[courseNum].Teiki === undefined ? '' : (String)(Course[courseNum].Teiki.SerializeData));

    const priceArray: Array<any> = Price.length == null ? [Price] : Price;
    const prices = priceArray.map(price => ({
        ...price,
        Oneway:
            typeof price.Oneway === 'object'
                ? Number(price.Oneway.text)
                : Number(price.Oneway),
    }));
    const lines: Array<any> = Line.length == null ? [Line] : Line;
    const points: Array<any> = Point.length == null ? [Point] : Point;

    const time = Number(timeOther) + Number(timeOnBoard) + Number(timeWalk);
    const kmDistance = Number(distance) / 10;
    const sumPrice = prices.reduce((v, price) => {
        if (/*(/Teiki/.test(price.kind)!=undefined) &&*/(/Teiki/.test(price.kind))) return v;
        if (price.selected !== 'true') return v;
        return price.Oneway + v;
    }, 0);

    const onPriceChange = (Price: any) =>
        Course[courseNum] === undefined ?
            onChange({
                ...data,
                ResultSet: {
                    ...data.ResultSet,
                    Course: [{ ...data.ResultSet.Course[0], Price }],
                },
            }) :
            onChange({
                ...data,
                ResultSet: {
                    ...data.ResultSet,
                    Course: [{ ...data.ResultSet.Course[courseNum], Price }],
                },
            });
    const RouteComponents = [];
    for (let i = 0; i < points.length; i++) {
        RouteComponents.push(
            <PointComp key={i + points[i].Station.Name} point={points[i]} />
        );
        if (lines[i] != null) {
            RouteComponents.push(
                <LineComp
                    key={i + lines[i].Name}
                    lineIndex={i + 1}
                    line={lines[i]}
                    prices={prices}
                    onPriceChange={onPriceChange}
                />
            );
        }
    }

    return (
        <Paper style={{ width: '100%', padding: 16 }}>
            <div>
                <p>所要時間：{time}分</p>
                <p>距離：{kmDistance}km</p>
                <p>乗り換え：{transferCount}回</p>
                <p>運賃：{sumPrice}円</p>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {RouteComponents}
            </div>
            <div style={{ marginTop: 16 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        localStorage.setItem("assignTeikiSerializeData", assignTeikiSerializeData);
                        localStorage.setItem("teikiStart", teikiStart);
                        localStorage.setItem("teikiEnd", teikiEnd);
                        localStorage.setItem("teikiStartCode", teikiStartCode);
                        localStorage.setItem("teikiEndCode", teikiEndCode);
                        onSubmit()
                    }


                    }
                >
                    決定
        </Button>
            </div>
        </Paper>
    );
}




