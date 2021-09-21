import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { JobTitles } from '../constants';
import { getPass } from '../lib/ekispert';
import StationSearchDialog from '../components/StationSearchDialog';
import TeikiRoute from '../components/TeikiRoute';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

type State = {
    loading: boolean;
    isOpenStationSearchDialogForDeparture: boolean;
    isOpenStationSearchDialogForArrival: boolean;
    isOpenStationSearchDialogForTransit: boolean;
    fromCode: string;
    fromText: string;
    toCode: string;
    toText: string;
    transitCode: string;
    transitText: string;
    assignTeikiSerializeData: string;


    selectingTab: string;
    teikiResult: any;
    teikiData: string;

}

export default class TeikiForm extends React.PureComponent<
    Props,
    State
    > {
    state: State = {
        loading: false,
        isOpenStationSearchDialogForDeparture: false,
        isOpenStationSearchDialogForArrival: false,
        isOpenStationSearchDialogForTransit: false,
        fromText: localStorage.getItem("teikiStart") === null ? '' : String(localStorage.getItem("teikiStart")),
        fromCode: localStorage.getItem("teikiStartCode") === null ? '' : String(localStorage.getItem("teikiStartCode")),
        toText: localStorage.getItem("teikiEnd") === null ? '' : String(localStorage.getItem("teikiEnd")),
        toCode: localStorage.getItem("teikiEndCode") === null ? '' : String(localStorage.getItem("teikiEndCode")),
        transitCode: '',
        transitText: '',
        assignTeikiSerializeData: '',


        selectingTab: '1',
        teikiResult: null,
        teikiData: ''
    };

    teiki = () => {
        const {
            fromCode,
            toCode,
            transitCode
        } = this.state;
        const searchData = { from: fromCode, to: toCode, transit: transitCode };

        this.setState({ loading: true });

        getPass({ ...searchData, sort: 'ekispert' })
            .then((teikiResult) => {
                this.setState({
                    loading: false,
                    teikiResult
                });
            });
    };

    render() {
        const { open, onClose, onSubmit } = this.props;
        const {

            loading,
            isOpenStationSearchDialogForDeparture,
            isOpenStationSearchDialogForArrival,
            isOpenStationSearchDialogForTransit,
            fromText,
            fromCode,
            toText,
            toCode,
            transitText,

            selectingTab,
            teikiResult,
        } = this.state;

        const isValid = fromCode !== '' && toCode !== '' && fromCode !== toCode

        return (
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
            >
                <AppBar style={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                            定期券の設定
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => window.open("./doc/出張お助けAI利用マニュアル.pdf")}
                            >
                                利用マニュアル
                </Button>
                        </Typography>
                        <Button color="inherit" onClick={onClose}>
                            キャンセル
                  </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ margin: 16 }}>
                    <div style={styles.wrapper}>
                        <div>
                            <div>
                                <label style={{ marginRight: 8 }}>出発地：{fromText}</label>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        this.setState({
                                            isOpenStationSearchDialogForDeparture: true,
                                        })
                                    }
                                >
                                    設定する
                      </Button>
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <label style={{ marginRight: 8 }}>目的地：{toText}</label>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        this.setState({ isOpenStationSearchDialogForArrival: true })
                                    }
                                >

                                    設定する
                      </Button>
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <label style={{ marginRight: 8 }}>経由地：{transitText}</label>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        this.setState({
                                            isOpenStationSearchDialogForTransit: true,
                                        })
                                    }
                                >
                                    設定する
                      </Button>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'inline-block',
                            position: 'relative',
                            marginTop: 16,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isValid || loading}
                            onClick={this.teiki}
                        >
                            検索する
                  </Button>

                        &nbsp;&nbsp;&nbsp;&nbsp;
                            {/* <div style={{ marginTop: 16 }}> */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {

                                localStorage.removeItem("assignTeikiSerializeData"),
                                    localStorage.removeItem("teikiStart"),
                                    localStorage.removeItem("teikiEnd"),
                                    localStorage.removeItem("teikiStartCode"),
                                    localStorage.removeItem("teikiEndCode"),
                                    this.setState({
                                        fromCode: '',
                                        fromText: '',
                                        toCode: '',
                                        toText: '',
                                    })
                                alert("定期情報をリセットしました。")


                            }
                            }
                        >
                            リセット
                                 </Button>

                        {loading && (
                            <CircularProgress
                                size={24}
                                color="secondary"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: -12,
                                    marginLeft: -12,
                                }}
                            />
                        )}
                    </div>
                </div>
                <Paper>
                    <Tabs
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        value={selectingTab}
                        onChange={(_, v) => this.setState({ selectingTab: v })}
                    >
                        <Tab label="ルート1" value="1" />
                        <Tab label="ルート2" value="2" />
                        <Tab label="ルート3" value="3" />
                        <Tab label="ルート4" value="4" />
                        <Tab label="ルート5" value="5" />
                    </Tabs>
                </Paper>
                {selectingTab === '1' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={0}
                        teikiStart={fromText}
                        teikiEnd={toText}
                        teikiStartCode={fromCode}
                        teikiEndCode={toCode}
                        onChange={data => this.setState({ teikiResult: data })}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '2' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={1}
                        teikiStart={fromText}
                        teikiEnd={toText}
                        teikiStartCode={fromCode}
                        teikiEndCode={toCode}
                        onChange={data => this.setState({ teikiResult: data })}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '3' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={2}
                        teikiStart={fromText}
                        teikiEnd={toText}
                        teikiStartCode={fromCode}
                        teikiEndCode={toCode}
                        onChange={data => this.setState({ teikiResult: data })}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '4' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={3}
                        teikiStart={fromText}
                        teikiEnd={toText}
                        teikiStartCode={fromCode}
                        teikiEndCode={toCode}
                        onChange={data => this.setState({ teikiResult: data })}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '5' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={4}
                        teikiStart={fromText}
                        teikiEnd={toText}
                        teikiStartCode={fromCode}
                        teikiEndCode={toCode}
                        onChange={data => this.setState({ teikiResult: data })}
                        onSubmit={onSubmit}
                    />
                )}

                <StationSearchDialog
                    open={isOpenStationSearchDialogForDeparture}
                    onClose={() =>
                        this.setState({ isOpenStationSearchDialogForDeparture: false })
                    }
                    onSubmit={data =>
                        this.setState({
                            isOpenStationSearchDialogForDeparture: false,
                            fromCode: data.code,
                            fromText: data.name,
                        })
                    }
                />
                <StationSearchDialog
                    open={isOpenStationSearchDialogForArrival}
                    onClose={() =>
                        this.setState({ isOpenStationSearchDialogForArrival: false })
                    }
                    onSubmit={data =>
                        this.setState({
                            isOpenStationSearchDialogForArrival: false,
                            toCode: data.code,
                            toText: data.name,
                        })
                    }
                />
                <StationSearchDialog
                    open={isOpenStationSearchDialogForTransit}
                    onClose={() =>
                        this.setState({ isOpenStationSearchDialogForTransit: false })
                    }
                    onSubmit={data =>
                        this.setState({
                            isOpenStationSearchDialogForTransit: false,
                            transitCode: data.code,
                            transitText: data.name,
                        })
                    }
                />
            </Dialog>

        );
    };


};

const Transition = (props: any) => <Slide direction="up" {...props} />;

const styles = {
    form: {
        margin: 16,
    },
    wrapper: {
        marginTop: 16,
    },
};