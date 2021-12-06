import { QuestionView } from '../FormFill';
import { useDummyErrorContext } from '../errorContext';

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
