import { useState } from 'react';

import FlagStore from 'stores/flags';

const errorFlags = new FlagStore();
const qMap = {};

class BaseQuestion {
  title = '';

  constructor(id) {
    this.id = id;
  }
}

function useErrorFlag(props) {
  return errorFlags.make(props.qid);
}

function useQState(key, props) {
  const [value, setValue] = useState(qMap[props.qid][key]);
  return [value, v => {
    qMap[props.qid][key] = v;
    setValue(v);
  }];
}

const typeMap = {};
const editorMap = {};

function registerQuestionType(type, Question, Editor) {
  typeMap[type] = Question;
  editorMap[type] = Editor;
}

export { BaseQuestion, useQState, qMap, editorMap, typeMap, registerQuestionType, errorFlags, useErrorFlag };
