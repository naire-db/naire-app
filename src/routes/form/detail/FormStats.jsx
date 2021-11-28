import React from 'react';
import { useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';

import DetailLayout from './DetailLayout';
import { statMap } from './stats';

function FormStats() {
  const fid = parseInt(useParams().fid, 10);
  const details = useAsyncResult(() =>
    api_unwrap_fut(api.form.get_form_stats(fid))
  );
  if (details === null)
    return null;

  const {form, resps} = details;
  const {questions} = form.body;

  // TODO: when empty
  return (
    <DetailLayout offset='stats' fid={fid} title={form.title}>
      {questions.map((q, i) => {
        const E = statMap[q.type];
        if (!E)
          return null;  // TODO: remove checks
        return <Segment key={q.id}>
          <p>
            {q.title}
          </p>
          <E
            question={q}
            values={resps.map(r => r.body.answers[i])}
          />
        </Segment>;
      })}
    </DetailLayout>
  );
}

export default FormStats;
