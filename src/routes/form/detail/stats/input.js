import { registerQuestionStat } from './base';

function InputAnswerRenderFactory() {
  return v => v;
}

registerQuestionStat('input', null, InputAnswerRenderFactory);
