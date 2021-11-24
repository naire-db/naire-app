import React, { useEffect, useState } from 'react';
import { Container, Card } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function FormSet() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.form.get_all();
      setForms(res.data);
    })();
  }, [])

  const cards = forms.map(form =>
    <Card
      href={'/form/' + form.id}
      key={form.id}
    >
      <Card.Content header={form.name} meta={
        '创建于 ' + formatTimestamp(form.ctime)
      } />
      <Card.Content extra>
        {form.resp_count + ' 份答卷'}
      </Card.Content>
    </Card>
  );

  return (
    <AppLayout>
      <Container text style={{ marginTop: '5em' }}>
        <Card.Group itemsPerRow={2}>
          {cards}
        </Card.Group>
      </Container>
    </AppLayout>
  );
}

export default FormSet;
