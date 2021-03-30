import React, { lazy, useEffect, useState } from 'react';
import { UserSettingsStatic } from "../../systems/database/models/user_settings";

const importView = (viewName: string) => lazy(() => import(`../../views/${viewName}`).catch(console.error));

export type BasicViewProps = {
  userSettings: UserSettingsStatic
}

type ContentProps = {
  view: string
} & BasicViewProps;

function Content({ view, userSettings }: ContentProps) {
  const [page, setPage] = useState(null);
  
  useEffect(() => {
    async function loadView() {
      const View = await importView(view);
      setPage(<View usesSettings={userSettings} />);
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