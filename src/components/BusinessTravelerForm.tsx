import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { JobTitles } from '../constants';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { render } from 'react-dom';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function BusinessTravelerForm(props: Props) {
    const { open, onClose, onSubmit } = props;
    var belong = localStorage.getItem("businessTravelerBelong") === null
        ? "" : (String)(localStorage.getItem("businessTravelerBelong"));

    var staffNumber = localStorage.getItem("businessTravelerStaffNumber") === null
        ? "" : (String)(localStorage.getItem("businessTravelerStaffNumber"));

    var jobTitle = localStorage.getItem("businessTravelerJobTitle") === null
        ? "" : (String)(localStorage.getItem("businessTravelerJobTitle"));

    var name = localStorage.getItem("businessTravelerName") === null
        ? "" : (String)(localStorage.getItem("businessTravelerName"));

    var extension = localStorage.getItem("businessTravelerExtension") === null
        ? "" : (String)(localStorage.getItem("businessTravelerExtension"));

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
                        出張者の設定(出張者と事業担当者が同じ場合は事業担当者のみ入力してください)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                        <div style={styles.wrapper}>
                            <TextField
                                label="所属"
                                defaultValue={belong}
                                onChange={e => {
                                    localStorage.setItem("businessTravelerBelong", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                label="教職員番号"
                                defaultValue={staffNumber}
                                onChange={e => {
                                    localStorage.setItem("businessTravelerStaffNumber", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                select
                                label="職名"
                                defaultValue={jobTitle}
                                onChange={e => {
                                    localStorage.setItem("businessTravelerJobTitle", e.target.value)
                                }}
                                SelectProps={{ native: true }}
                            >
                                {JobTitles.map(j => (
                                    <option key={j} value={j}>
                                        {j}
                                    </option>
                                ))}
                            </TextField>
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                label="氏名"
                                defaultValue={name}
                                onChange={e => {
                                    localStorage.setItem("businessTravelerName", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                label="連絡先(内線番号等)"
                                defaultValue={extension}
                                onChange={e => {
                                    localStorage.setItem("businessTravelerExtension", e.target.value)
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onSubmit()
                                }
                            >
                                決定
                                 </Button>
                            {/* </div>
                            <div style={{ marginTop: 16 }}> */}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    localStorage.removeItem("businessTravelerBelong"),
                                        localStorage.removeItem("businessTravelerStaffNumber"),
                                        localStorage.removeItem("businessTravelerJobTitle"),
                                        localStorage.removeItem("businessTravelerName"),
                                        localStorage.removeItem("businessTravelerExtension"),
                                        alert("リセットされました")
                                    onSubmit();
                                }
                                }

                            >
                                リセット
                                 </Button>
                        </div>
                        <p>
                        </p>

                    </div>
                </div>
            </div>
        </Dialog>

    );
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