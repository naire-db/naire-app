import React, { useRef } from 'react';
import { Container, Feed, Grid, Header, Icon, Ref, Segment, Sticky } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import Nav from 'components/Nav';
import { useAsyncResult } from 'utils';
import { formatTimestampToRelative, formatUser } from 'utils/render';

function FeatCol(props) {
  const {title, content, icon} = props;

  // TODO: add a button
  return (
    <Grid.Column style={{paddingBottom: '5em', paddingTop: '5em'}}>
      <Icon name={icon} size='huge' />
      <Header as='h3' style={{fontSize: '1.8em'}}>
        {title}
      </Header>
      <p style={{fontSize: '1.2em'}}>
        {content}
      </p>
    </Grid.Column>
  );
}

function Event(props) {
  const {user: puser, action, link, object: obj, icon, time} = props;

  const user = puser ? formatUser(puser) : '匿名用户';

  const object = link ? <a href={link}>{obj}</a> : obj;

  return (
    <Feed.Event>
      <Feed.Label>
        <Icon name={icon} />
      </Feed.Label>
      <Feed.Content>
        <Feed.Date>{formatTimestampToRelative(time)}</Feed.Date>
        <Feed.Summary>
          {user}
          <span style={{fontWeight: 'normal'}}>
            {' ' + action + ' '}
          </span>
          {object}
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
}

const Home = observer(() => {
  const user = appState.user_info;

  const feeds = useAsyncResult(async () => {
    if (!user)
      return null;
    const res = await api_unwrap_fut(api.get_feeds());
    if (!res.length)
      return null;
    return res;
  }, [user]);

  const ref = useRef();

  const Banner = () => (
    <Segment
      inverted
      textAlign='center'
      vertical
      style={{minHeight: 480, padding: '1em 0em'}}
    >
      <Sticky
        context={ref}
        style={{paddingTop: 10}}
      >
        <Nav
          inverted
          hideName
          menuProps={{
            borderless: true,
            size: 'large',
            fixed: undefined,
          }}
        />
      </Sticky>
      <Container text>
        <Header
          as='h1'
          content='naire'
          inverted
          style={{
            fontSize: '4.5em',
            fontWeight: 'bold ',
            marginBottom: 0,
            marginTop: '1em',
          }}
        />
        <Header
          as='h2'
          content='The most versatile questionnaire platform ever.'
          inverted
          style={{
            fontSize: '1.8em',
            fontWeight: 'normal',
            marginTop: '2em',
          }}
        />
      </Container>
    </Segment>
  );

  return (
    <>
      <Banner />
      <Ref innerRef={ref}>
        <Container>
          <Segment style={{paddingBottom: feeds ? 20 : 100}} vertical>
            <Grid columns='equal' stackable>
              <Grid.Row textAlign='center'>
                <FeatCol
                  title='快捷的信息采集'
                  content='在编辑器中添加题目，或从模板直接创建问卷，即可开始回收答卷。'
                  icon='database'
                />
                <FeatCol
                  title='高效的团队协作'
                  content='向组织成员发布内部问卷，或与其他成员共享答卷数据。'
                  icon='group'
                />
                <FeatCol
                  title='直观的数据统计'
                  content='从答卷生成饼状图、条形图等统计信息，对数据进行全方位分析。'
                  icon='chart bar'
                />
                <FeatCol
                  title='完善的访问控制'
                  content='自定义问卷的开始时间、填写次数限制和访问密码，满足不同的使用场景。'
                  icon='lock'
                />
              </Grid.Row>
            </Grid>
          </Segment>
          {feeds && <Segment style={{padding: '4em 0em 8em'}} vertical>
            <Grid container stackable verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3' style={{fontSize: '1.8em', marginBottom: 25}}>
                    新动态
                  </Header>
                  <Feed size='large'>
                    {feeds.map((f, i) => {
                      const {type, time, user, object: obj} = f;
                      const p = {key: i, time, user};
                      if (type === 'resp')
                        return <Event
                          {...p}
                          icon='pencil'
                          action='填写了问卷'
                          object={obj.title}
                          link={'/form/' + obj.id + '/resps'}
                        />;

                      p.link = '/org/' + obj.id + '/members';
                      p.object = obj.name;
                      if (type === 'join_org')
                        return <Event
                          {...p}
                          icon='user plus'
                          action='加入了组织'
                        />;

                      if (type === 'leave_org')
                        return <Event
                          {...p}
                          icon='user times'
                          action='离开了组织'
                        />;

                      console.error('bad feed', f);
                      return null;
                    })}
                  </Feed>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>}
        </Container>
      </Ref>
    </>
  );
});

export default Home;
