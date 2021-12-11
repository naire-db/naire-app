import { BaseQuestion, registerQuestionType } from './base';

class CommentQuestion extends BaseQuestion {
  type = 'comment';
}

registerQuestionType('comment', CommentQuestion, () => null);
