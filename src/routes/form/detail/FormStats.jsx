import React from 'react';
import { useParams } from 'react-router-dom';

import DetailLayout from './DetailLayout';

function FormStats() {
  const fid = parseInt(useParams().fid, 10);

  return (
    <DetailLayout offset='stats' fid={fid}>
      TODO
    </DetailLayout>
  );
}

export default FormStats;
