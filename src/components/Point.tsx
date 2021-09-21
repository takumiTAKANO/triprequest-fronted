import * as React from 'react';
import Paper from '@material-ui/core/Paper';

type Props = {
  point: any;
};

export default function Point(props: Props) {
  const { point } = props;

  return (
    <Paper style={{ flexGrow: 1, padding: 8 }}>{point.Station.Name}</Paper>
  );
}
