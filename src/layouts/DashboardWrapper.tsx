import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const DashboardWrapper: React.FC = () => {
    const context = useOutletContext<any>(); // Type this properly if possible, or use 'any' for now during migration
    return <DashboardLayout {...context} outletContext={context} />;
};

export default DashboardWrapper;
