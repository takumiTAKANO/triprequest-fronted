import * as React from 'react';
import debounce from 'lodash/debounce';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { searchStation } from '../lib/ekispert';

type Point = {
  code: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: Point) => void;
};

type State = {
  text: string;
  trainList: Array<Point>;
  busList: Array<Point>;
  planeList: Array<Point>;
  shipList: Array<Point>;
};

export default class StationSearchDialog extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    text: '',
    trainList: [],
    busList: [],
    planeList: [],
    shipList: [],
  };

  onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    this.setState({ text });
    if (text === '') return;
    this.search(text);
  };

  search = debounce((text: string) => {
    searchStation(text).then(list => {
      this.setState({
        trainList: list
          .filter(p => p.type === 'train')
          .map(p => ({ code: p.code, name: p.name })),
        busList: list
          .filter(p => p.type === 'bus')
          .map(p => ({ code: p.code, name: p.name })),
        planeList: list
          .filter(p => p.type === 'plane')
          .map(p => ({ code: p.code, name: p.name })),
        shipList: list
          .filter(p => p.type === 'ship')
          .map(p => ({ code: p.code, name: p.name })),
      });
    });
  }, 300);

  render() {
    const { open, onClose, onSubmit } = this.props;
    const { text, trainList, busList, planeList, shipList } = this.state;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>地点の検索</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="名称"
            value={text}
            onChange={this.onTextChange}
          />
          <List>
            <ListItem disabled divider>
              <ListItemText primary="駅" />
            </ListItem>
            {trainList.map(p => (
              <ListItem key={p.code} button onClick={() => onSubmit(p)}>
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
            <Divider />
            <ListItem disabled divider>
              <ListItemText primary="バス停" />
            </ListItem>
            {busList.map(p => (
              <ListItem key={p.code} button onClick={() => onSubmit(p)}>
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
            <Divider />
            <ListItem disabled divider>
              <ListItemText primary="空港" />
            </ListItem>
            {planeList.map(p => (
              <ListItem key={p.code} button onClick={() => onSubmit(p)}>
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
            <Divider />
            <ListItem disabled divider>
              <ListItemText primary="船" />
            </ListItem>
            {shipList.map(p => (
              <ListItem key={p.code} button onClick={() => onSubmit(p)}>
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
