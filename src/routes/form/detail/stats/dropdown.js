import { registerQuestionStat } from './base';
import { RadioAnswerRenderFactory } from './radio';

// TODO: use RadioStat after dropdown view is done.
registerQuestionStat('dropdown', null, RadioAnswerRenderFactory);
