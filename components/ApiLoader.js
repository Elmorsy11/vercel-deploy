

import React from 'react';
// import ReactLoading from 'react-loading';
import SkeletonLoader from './skeleton-loader';
 
const ApiLoader = ({ type, color }) => (
    // <ReactLoading color={`#09958C`} type={`spin`} height={'20px'} width={'20px'} className='mx-auto' />
    <SkeletonLoader />
);
 
export default ApiLoader;