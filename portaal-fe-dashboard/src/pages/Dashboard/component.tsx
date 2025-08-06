import React from "react";
import { DashboardProvider } from "../../contexts/DashboardContext";
import { DashboardContent } from "../../components/dashboard/DashboardContent";
import { TestSpacingError } from "../../components/widgets/TestSpacingError";

export const Dashboard: React.FC = () => {
  const showTest = new URLSearchParams(window.location.search).get('testSpacing') === 'true';
  
  return (
    <DashboardProvider>
      <DashboardContent />
      {showTest && <TestSpacingError />}
    </DashboardProvider>
  );
};