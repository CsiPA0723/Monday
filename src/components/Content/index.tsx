import React, { lazy, useEffect, useState } from 'react';
import BasicViewProps from "../../views/BasicViewProps";

const importView = (viewName: string) => lazy(() => import(`../../views/${viewName}`).catch(console.error));

type ContentProps = {
  view: string
} & BasicViewProps;

function Content({ view, userId, userSettings }: ContentProps) {
  const [page, setPage] = useState(null);
  
  useEffect(() => {
    async function loadView() {
      const View = await importView(view);
      setPage(<View userId={userId} usesSettings={userSettings} />);
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