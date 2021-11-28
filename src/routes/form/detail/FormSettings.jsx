import React from 'react';
import { useParams } from 'react-router-dom';

import DetailLayout from './DetailLayout';

function FormSettings() {
  const fid = parseInt(useParams().fid, 10);

  return (
    <DetailLayout offset='settings' fid={fid}>
      TODO
    </DetailLayout>
  );
}

export default FormSettings;
