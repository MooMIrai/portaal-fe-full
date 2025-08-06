import React from "react";
import Routes from 'common/Routes';
import { ReportEditorProvider } from './contexts/ReportEditorContext';

// Lazy load pages for better performance
const QueryList = React.lazy(() => import("./pages/QueryList"));
const QueryEditor = React.lazy(() => import("./pages/QueryEditor"));
const TemplateManager = React.lazy(() => import("./pages/TemplateManager"));

const App = () => {
  console.log('[ReportEditor App] Rendering');
  return (
    <ReportEditorProvider>
      <Routes data={[
        {
          path: "/reporteditor",
          element: <QueryList />,
          permissions: []
        },
        {
          path: "/reporteditor/new",
          element: <QueryEditor />,
          permissions: []
        },
        {
          path: "/reporteditor/edit/:id",
          element: <QueryEditor />,
          permissions: []
        },
        {
          path: "/reporteditor/templates",
          element: <TemplateManager />,
          permissions: []
        }
      ]}/>
    </ReportEditorProvider>
  );
};

export default App;