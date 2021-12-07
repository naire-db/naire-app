import { showModal } from 'utils/modal';

async function onEditForm(url, warn, subtitle = null) {
  if (!warn) {
    window.location = url;
    return;
  }
  return await showModal({
    title: '编辑问卷',
    subtitle,
    description: '保存问卷时，将删除其所有已有答卷。',
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
