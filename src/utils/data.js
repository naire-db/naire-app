import { useState } from 'react';
import _ from 'lodash';

import { usePagination } from './paginate';

function useSorted(initialData = []) {
  const [state, setState] = useState(() => ({
    column: null,
    data: initialData,
    direction: null,
  }));
  const {column, data, direction} = state;

  function changeSort(nextColumn, key) {
    if (column === nextColumn)
      setState({
        ...state,
        data: data.slice().reverse(),
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    else
      setState({
        column: nextColumn,
        data: _.sortBy(data, key ?? [nextColumn]),
        direction: 'ascending',
      });
  }

  return {
    data,
    setData(data) {
      setState({
        column: null,
        direction: null,
        data,
      });
    },
    headerProps(col, key) {
      return {
        sorted: column === col ? direction : null,
        onClick: () => changeSort(col, key),
      };
    }
  };
}

export { useSorted, usePagination };
