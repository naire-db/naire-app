import React from 'react';

import AppLayout from './AppLayout';
import { Container, Divider, Feed, Header, Icon, Segment } from 'semantic-ui-react';

import './homepage.css'

function HomeLayout(props) {
  const Banner = () => (
    <Segment className='landing-image'>
      <Container text>
        <Header
          as='h1'
          content='naire'
          inverted
          style ={{
            fontSize: '5.5em',
            fontWeight: 'normal',
            marginBottom: '0',
            marginTop: '1.5em',
            textAlign: 'center',
          }}
        />
        <Header
          as='h2'
          content='a versatile questionnaire platform.'
          inverted
          style={{
            fontSize: '1.7em',
            fontWeight: 'normal',
            marginTop: '1.5em',
            marginBottom: '3.5em',
            textAlign: 'center',
          }}
        />
      </Container>
    </Segment>
  )

  const Intro = () => (
    <Segment vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          关于 naire
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          naire 是一个xxxxxxxxxxxxxxxxxxxxxxxxx......
        </p>
      </Container>
    </Segment>
  )

  const FeedingItem = (props) => (
    <Feed size='large'>
      <Feed.Event>
        <Feed.Label icon={props.icon} />
        <Feed.Content>
          <Feed.Date>{props.time}</Feed.Date>
          <Feed.Summary>
            <Feed.User>{props.user}</Feed.User>
            {props.event}。
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  )

  const Notification = () => (
    <Segment vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          新消息
        </Header>

        <FeedingItem
          isResp={true}
          user='刘瑞'
          event='填写了您的问卷XXX'
          time='Dec 7th, 2021'
        />

        <FeedingItem
          icon='bullhorn'
          user='刘瑞'
          event='发布了问卷XXX'
          time='Dec 7th, 2021'
        />

        <FeedingItem />
      </Container>
    </Segment>
  )

  return (
    <>
      <Banner />
      <AppLayout offset>
        <Notification />
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '1em 1em', textTransform: 'uppercase' }}
        />
        <Intro />
      </AppLayout>
    </>
  );
}

export default HomeLayout;
