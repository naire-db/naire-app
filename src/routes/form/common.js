import { showModal } from 'utils/modal';

async function onEditForm(url, warn, subtitle = null) {
  if (!warn) {
    window.location = url;
    return;
  }
  return await showModal({
    title: '编辑问卷',
    subtitle,
    size: 'tiny',
    description: '该问卷正在接受答卷。保存修改后的问卷时，将删除所有已有的答卷。',
    confirmText: '编辑',
    confirmProps: {
      negative: true
    },
    confirmNav: true,
    onConfirmed() {
      window.location = url;
    }
  });
}

export { onEditForm };
