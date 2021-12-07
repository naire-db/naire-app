import { registerQuestionStat } from './base';
import { RadioStat, RadioAnswerRenderFactory } from './radio';

// TODO: use RadioStat after dropdown view is done.
registerQuestionStat('dropdown', RadioStat, RadioAnswerRenderFactory);
