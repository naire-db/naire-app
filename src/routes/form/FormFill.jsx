import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

function FormView(props) {
  // TODO
  return <>
    <Header>
      {props.title}
    </Header>
    <Header>
      {JSON.stringify(props.body)}
    </Header>
  </>;
}

function FormFill() {
  const [detail, setDetail] = useState(null);
  const fid = parseInt(useParams().fid, 10);

  useEffect(() => {
    if (isNaN(fid))
      return window.location = '/';
    (async () => {
      const res = await api.form.get_detail(fid);
      if (res.code === 0)
        setDetail(res.data);
      else {
        // TODO: warn about unauthorized or nonexistent
        window.location = '/';
      }
    })();
  }, []);

  return (detail &&
    <AppLayout offset>
      <FormView fid={fid} {...detail} />
    </AppLayout>
  );
}

export default FormFill;
