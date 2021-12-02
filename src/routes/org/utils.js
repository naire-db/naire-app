import { Label } from 'semantic-ui-react';
import { ROLE_OWNER } from './config';

function formatRole(i) {
  return ['成员', '管理员', '所有者'][i];
}

function renderRoleLabel(role) {
  return role > 0 && (
    <Label
      content={formatRole(role)}
      style={{
        marginLeft: 12
      }}
      color={role === ROLE_OWNER ? 'blue' : undefined}
    />
  );
}

export { formatRole, renderRoleLabel };
