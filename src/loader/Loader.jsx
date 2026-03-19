import React from 'react';
import CustomLoader, { AnalysisLoader } from '../components/CustomLoader';

export default function Loader({ animationName }) {
    if (animationName === 'analyzing') {
        return <AnalysisLoader />;
    }

    return <CustomLoader size="large" />;
}
