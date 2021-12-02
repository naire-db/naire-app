import React, { useState } from 'react';

import { Button, Icon } from 'semantic-ui-react';

function CopyButton(props) {
  const {content, btnProps = {}} = props;
  const [successToken, setSuccessToken] = useState(null);

  async function copy() {
    const tk = Math.random();
    setSuccessToken(tk);
    setTimeout(() => {
      setSuccessToken(tk_cur => (tk === tk_cur ? null : tk_cur));
    }, 1000);
    await navigator.clipboard.writeText(content);
  }

  return (
    <Button
      positive={successToken !== null}
      icon labelPosition='left' size='small'
      onClick={copy}
      {...btnProps}
    >
      <Icon name={successToken === null ? 'copy' : 'checkmark'} />
      复制
    </Button>
  );
}

export default CopyButton;
