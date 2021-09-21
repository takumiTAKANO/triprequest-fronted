import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { BusinessScheduleData } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessScheduleData) => void;
};

type State = {
  text: string;
};

export default class BusinessScheduleFormDialog extends React.PureComponent<
  Props,
  State
> {
  state = {
    text: '',
  };

  render() {
    const { text } = this.state;
    const { open, onClose, onSubmit } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>用務の追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="内容"
            value={text}
            helperText={"ex.情報処理学会で発表"}
            onChange={e => this.setState({ text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            color="primary"
            onClick={() => onSubmit({ type: 'business', text })}
          >
            完了
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
