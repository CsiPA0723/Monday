import React, { lazy, useEffect, useState } from 'react';

const importView = (viewName: string) => lazy(() => import(`../../views/${viewName}`).catch(console.error));


function Content({ view }: { view: string }) {
  const [page, setPage] = useState(null);
  
  useEffect(() => {
    async function loadView() {
      const View = await importView(view);
      setPage(<View />);
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