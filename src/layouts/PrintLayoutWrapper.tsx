import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PrintLayout from '../components/PrintLayout';

const PrintLayoutWrapper: React.FC = () => {
    const context = useOutletContext<any>();
    const navigate = useNavigate();

    return (
        <PrintLayout
            recipes={context.recipes}
            onExit={() => navigate('/dashboard')}
        />
    );
};

export default PrintLayoutWrapper;
