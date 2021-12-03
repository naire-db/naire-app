import { registerQuestionStat } from './base';

import './index.css';

function InputAnswerRenderFactory(q) {
  return v => v;
}

// TODO: handle null
registerQuestionStat('input', null, InputAnswerRenderFactory);
