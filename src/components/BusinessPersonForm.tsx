import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { JobTitles } from '../constants';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function BusinessPersonForm(props: Props) {
    const { open, onClose, onSubmit } = props;

    var belong = localStorage.getItem("businessPersonBelong") === null
        ? "" : (String)(localStorage.getItem("businessPersonBelong"));

    var staffNumber = localStorage.getItem("businessPersonStaffNumber") === null
        ? "" : (String)(localStorage.getItem("businessPersonStaffNumber"));

    var jobTitle = localStorage.getItem("businessPersonJobTitle") === null
        ? "" : (String)(localStorage.getItem("businessPersonJobTitle"));

    var name = localStorage.getItem("businessPersonName") === null
        ? "" : (String)(localStorage.getItem("businessPersonName"));

    var extension = localStorage.getItem("businessPersonExtension") === null
        ? "" : (String)(localStorage.getItem("businessPersonExtension"));

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
                        事業担当者の設定&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                                    localStorage.setItem("businessPersonBelong", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                label="教職員番号"
                                defaultValue={staffNumber}
                                onChange={e => {
                                    localStorage.setItem("businessPersonStaffNumber", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                select
                                label="職名"
                                defaultValue={jobTitle}
                                onChange={e => {
                                    localStorage.setItem("businessPersonJobTitle", e.target.value)
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
                                    localStorage.setItem("businessPersonName", e.target.value)
                                }}
                            />
                        </div>
                        <div style={styles.wrapper}>
                            <TextField
                                label="連絡先(内線番号等)"
                                defaultValue={extension}
                                onChange={e => {
                                    localStorage.setItem("businessPersonExtension", e.target.value)
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
                            {/* </div> */}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {/* <div style={{ marginTop: 16 }}> */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    
                                        localStorage.removeItem("businessPersonBelong"),
                                            localStorage.removeItem("businessPersonStaffNumber"),
                                            localStorage.removeItem("businessPersonJobTitle"),
                                            localStorage.removeItem("businessPersonName"),
                                            localStorage.removeItem("businessPersonExtension"),
                                            alert("リセットされました"),
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