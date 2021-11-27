import { editorMap, qMap, typeMap } from './base';
import './checkbox';
import './radio';
import './input';
import './file';
import './dropdown';
import './text';

const nameMap = {
  'radio': '单选题',
  'checkbox': '多选题',
  'input': '填空题',
  'file': '文件上传',
  'dropdown': '下拉列表',
  'text': '简答题',
};

export { qMap, editorMap, typeMap, nameMap };
