import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Grid, Icon, Label, Menu } from 'semantic-ui-react';

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
      <Container style={{marginTop: '5.5em'}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Menu vertical pointing>
                <Menu.Item active>
                  <Label>1</Label>
                  <code>{'TODO: folders'}</code>
                </Menu.Item>
                <Menu.Item>
                  <Label>51</Label>
                  Folder 2
                </Menu.Item>
                <Menu.Item>
                  <Label>1</Label>
                  Folder 3
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Menu pagination>
                      <Menu.Item as='a' icon>
                        <Icon name='chevron left' />
                      </Menu.Item>
                      <Menu.Item as='a'><code>{'TODO: pagination'}</code></Menu.Item>
                      <Menu.Item as='a'>2</Menu.Item>
                      <Menu.Item as='a'>3</Menu.Item>
                      <Menu.Item as='a'>4</Menu.Item>
                      <Menu.Item as='a' icon>
                        <Icon name='chevron right' />
                      </Menu.Item>
                    </Menu>
                    <Button
                      primary size='large' floated='right'
                      href='/form/create'
                    >
                      创建问卷
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Card.Group itemsPerRow={3}>
                      {cards}
                    </Card.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </AppLayout>
  );
}

export default FormSet;
