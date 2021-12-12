import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';

import DetailLayout from './DetailLayout';
import { statMap } from './stats';
import { nameMap } from '../types';

function FormStats() {
  const fid = parseInt(useParams().fid, 10);
  const details = useAsyncResult(() =>
    api_unwrap_fut(api.form.get_form_stats(fid))
  );

  if (details === null)
    return null;

  const {form, resps} = details;
  const {questions} = form.body;

  const segs = [];
  for (let i = 0; i < questions.length; ++i) {
    const q = questions[i];
    const E = statMap[q.type];
    if (!E)
      continue;
    const e = <Segment key={q.id}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {q.title}
            <Label horizontal style={{
              marginLeft: 15
            }}>
              {nameMap[q.type]}
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div
              style={{
                paddingBottom: 4,
                paddingTop: 4
              }}
            >
              <E
                question={q}
                values={resps.map(r => r.body.answers[i])}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>;
    segs.push(e);
  }

  return (
    <DetailLayout
      offset='stats' fid={fid} form={form}
      respCount={resps.length}
    >
      <Header className='print-only' as='h1' content={form.title} style={{
        textAlign: 'center'
      }} />
      {segs.length ? <>
        <Button
          className='no-print'
          primary
          content='导出统计信息'
          onClick={() => window.print()}
        /> {/* TODO: set A3 to default printing page size before demonstration */}
        {segs}
      </> : <Segment>
        问卷暂不包含可统计的问题
      </Segment>
      }
    </DetailLayout>
  );
}

export default FormStats;
