import api from 'api';
import { registerQuestionStat } from './base';

function FileAnswerRenderFactory() {
  return file => {
    if (!file)
      return '未上传';
    const [token, filename] = file;
    return `${filename} (${api.file.file_url(token)})`;
  };
}

registerQuestionStat('file', null, FileAnswerRenderFactory);
