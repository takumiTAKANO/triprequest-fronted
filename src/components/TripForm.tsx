import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { TripData } from '../types';
import { Destinations, TripClasses } from '../constants';
import { render } from 'react-dom';
import TeikiForm from '../components/TeikiForm';
import BusinessTravelerForm from './BusinessTravelerForm';
import BusinessPersonForm from './BusinessPersonForm';
import { withWidth, Tab, Grid, RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";


type Props = {
    tripData: TripData;
    onChange: (tripData: TripData) => void;
    onSubmit: (e: React.MouseEvent) => void;
};

type State = {
    showTeikiForm: boolean;
    showBusinessPersonForm: boolean;
    showBusinessTravelerForm: boolean;
};

export default class TripForm extends React.PureComponent<Props, State> {
    state: State = {
        showTeikiForm: false,
        showBusinessPersonForm: false,
        showBusinessTravelerForm: false,
    }

    render() {
        const { showTeikiForm, showBusinessPersonForm, showBusinessTravelerForm } = this.state;
        const { tripData, onSubmit, onChange } = this.props;
        const { tripClass, fundClass, startDate, endDate, destination, reason, priceType } = tripData;


        const isValid =
            tripClass !== '' &&
            fundClass !== '' &&
            startDate !== '' &&
            endDate !== '' &&
            destination !== '' &&
            reason !== '' &&
            priceType !== ''

        return (
            <div style={styles.form}>
                <Typography variant="headline">出張全体
                </Typography>
                <div style={styles.wrapper}>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                            this.setState({ showTeikiForm: true });
                        }}
                    >
                        定期券の設定
          </Button>
                    &nbsp;&nbsp;
                <TeikiForm
                        open={showTeikiForm}
                        onClose={() => this.setState({ showTeikiForm: false })}
                        onSubmit={() => {
                            this.setState({ showTeikiForm: false });
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.setState({ showBusinessPersonForm: true });
                        }}
                    >
                        事業担当者の設定
          </Button>
                    &nbsp;&nbsp;
                <BusinessPersonForm
                        open={showBusinessPersonForm}
                        onClose={() => this.setState({ showBusinessPersonForm: false })}
                        onSubmit={() => {
                            this.setState({ showBusinessPersonForm: false });
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.setState({ showBusinessTravelerForm: true });
                        }}
                    >
                        出張者の設定
          </Button>
                    &nbsp;&nbsp;
                </div>
                <BusinessTravelerForm
                    open={showBusinessTravelerForm}
                    onClose={() => this.setState({ showBusinessTravelerForm: false })}
                    onSubmit={() => {
                        this.setState({ showBusinessTravelerForm: false });
                    }}
                />
                <div style={styles.wrapper}>
                    <TextField
                        select
                        label="出張分類"
                        value={tripClass}
                        onChange={e => {
                            onChange({ ...tripData, tripClass: e.target.value });
                        }}
                        SelectProps={{ native: true }}
                    >
                        {TripClasses.map(t => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </TextField>
                </div>
                <div style={styles.wrapper}>
                <Grid container>
                        <Grid item xs={3}>
                    <TextField
                        label="資金名,資金コード"
                        helperText="ex.CREST,科研費"
                        fullWidth
                        value={fundClass}
                        onChange={e => {
                            onChange({ ...tripData, fundClass: e.target.value });
                        }}
                    >
                    </TextField>
                    </Grid>
                    </Grid>
                </div>
                <div style={styles.wrapper}>
                    <TextField
                        type="date"
                        label="開始日"
                        inputProps={{ max: endDate }}
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={e => {
                            onChange({ ...tripData, startDate: e.target.value });
                        }}
                    />
                </div>
                <div style={styles.wrapper}>
                    <TextField
                        type="date"
                        label="終了日"
                        inputProps={{ min: startDate }}
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={e => {
                            onChange({ ...tripData, endDate: e.target.value });
                        }}
                    />
                </div>
                {tripClass === "国外" &&
                    <div style={styles.wrapper}>
                        <TextField
                            select
                            label="用務先"
                            value={destination}
                            helperText={"その他の場合は事由の前に用務先を入力してください"}
                            onChange={e => {
                                onChange({ ...tripData, destination: e.target.value });
                            }}
                            SelectProps={{ native: true }}
                        >
                            {Destinations.map(d => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </TextField>
                    </div>
                }

                {tripClass === "国内" &&
                    <div style={styles.wrapper}>
                        <Grid container>
                        <Grid item xs={6}>
                            <TextField
                                label="用務先"
                                value={destination}
                                helperText={"ex.金沢工業大学(石川県),淡路夢舞台国際会議場(兵庫県)"}
                                fullWidth
                                onChange={e => {
                                    onChange({ ...tripData, destination: e.target.value });
                                }
                                }
                            />
                            </Grid>
                            </Grid>
                    </div>
                }
                <div style={styles.wrapper}>
                    <Grid container>
                        <Grid item xs={6}>
                        <TextField
                            label="事由"
                            value={reason}
                            fullWidth
                            helperText={"ex.研究協力者としてJIST2018に参加し、発表・資料収集を行うため。"}
                            onChange={e => {
                                onChange({ ...tripData, reason: e.target.value });
                            }
                            }
                        />
                        </Grid>
                        </Grid>

                </div>
                <div style={styles.wrapper}>
                <FormLabel >交通費</FormLabel>
            <RadioGroup  name="priceType" row defaultValue="kippu">
              <FormControlLabel value="kippu" control={<Radio />} onChange={() => onChange({ ...tripData, priceType: "kippu"  })} label="切符" />
              <FormControlLabel value="ic" control={<Radio />} onChange={() => onChange({ ...tripData, priceType: "ic"  })} label="IC" />
            </RadioGroup> 
            
            </div>
                <div style={styles.wrapper}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isValid}
                        onClick={
                            onSubmit
                        }
                    >
                        次へ
        </Button>
                </div>
            </div>

        );
    }
}

const styles = {
    form: {
        margin: 16,
    },
    wrapper: {
        marginTop: 16,
    },
    TextField: {
        width: 500,
    }
};
