import { aMap, QuestionView } from '../FormFill';
import api, { api_unwrap } from 'api';
import { useDummyErrorContext } from '../errorContext';

async function loadResp(fid, rid, form) {
  const {questions} = form.body;
  const {answers} = api_unwrap(await api.form.get_resp_detail(fid, rid)).body;
  console.log('got answers', answers, questions);
  for (let i = 0; i < answers.length; ++i)
    aMap[questions[i].id] = answers[i];
  console.log('make amap', aMap);
}

function RespView(props) {
  const {form} = props;
  const errorCtx = useDummyErrorContext();
  const {questions} = form.body;

  // TODO: make them disabled
  return questions.map(q => (
    <QuestionView
      key={q.id}
      question={q}
      errorCtx={errorCtx}
    />
  ));
}

export default RespView;
export { loadResp };
