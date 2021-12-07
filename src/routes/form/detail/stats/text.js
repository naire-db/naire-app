import { registerQuestionStat } from './base';

function TextAnswerRenderFactory() {
  return v => v;
}

registerQuestionStat('text', null, TextAnswerRenderFactory);
