import React, { lazy, useEffect, useState } from 'react';
import BasicViewProps from "../@types/views";

const importView = (viewName: string) => lazy(() => import(`../views/${viewName}`).catch(console.error));

type ContentProps = {
  view: string
} & BasicViewProps;

function Content({ view, ...restProps }: ContentProps) {
  const [page, setPage] = useState(null);
  
  useEffect(() => {
    async function loadView() {
      try {
        const View = await importView(view);
        setPage(<View {...restProps}/>);
      } catch (error) {
        console.error(error);
      }
    }
    loadView();
  }, [view]);

  return (
    <React.Suspense fallback="Loading...">
      <div id="content">{page}</div>
    </React.Suspense>
  );
}

export default Content;