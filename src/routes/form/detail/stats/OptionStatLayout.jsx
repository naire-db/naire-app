import React from 'react';
import { Grid, Table } from 'semantic-ui-react';
import { formatPercent, makeColors } from './utils';

class OptionCounter {
  constructor(options) {
    this.optMap = new Map();
    this.data = [];
    this.total = 0;
    for (const o of options) {
      const n = {
        text: o.text,
        count: 0
      };
      this.optMap.set(o.id, n);
      this.data.push(n);
    }
  }

  update(oid) {
    ++this.optMap.get(oid).count;
  }

  setTotal(n) {
    this.total = n;
  }

  toChartData() {
    return {
      labels: this.data.map(e => e.text),
      datasets: [{
        data: this.data.map(e => e.count),
        backgroundColor: makeColors(this.data.length)
      }],
    };
  }

  toFullChartData() {
    const labels = this.data.map(e => e.text);
    labels.push('总数');
    const data = this.data.map(e => e.count);
    data.push(this.total);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: makeColors(this.data.length + 1)
      }],
    };
  }
}

function OptionStatLayout(props) {
  const {data, total} = props.stat;

  return <>
    <Grid>
      <Grid.Column width={9} verticalAlign='middle'>
        <div className='pie-stat' style={{
          marginBottom: 20
        }}>
          {props.children}
        </div>
      </Grid.Column>
      <Grid.Column width={7} verticalAlign='middle'>
        <Table className='mg-center' compact collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>选项</Table.HeaderCell>
              <Table.HeaderCell>数量</Table.HeaderCell>
              <Table.HeaderCell>比例</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((d, i) => (
              <Table.Row key={i}>
                <Table.Cell width={6}>{d.text}</Table.Cell>
                <Table.Cell width={6}>{d.count}</Table.Cell>
                <Table.Cell width={6}>{formatPercent(d.count / total)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>答卷总数</Table.HeaderCell>
              <Table.HeaderCell>{total}</Table.HeaderCell>
              <Table.HeaderCell>{formatPercent(1)}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Grid.Column>
    </Grid>
  </>;
}

export default OptionStatLayout;
export { OptionCounter };
