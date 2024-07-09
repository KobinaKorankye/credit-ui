import React from 'react';
import Lottie from 'react-lottie';
import analyzing from './lotties/analyzing.json'

const animations = {
  analyzing
}

export default function Loader({ width, height, animationName}) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animations[animationName] || analyzing,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
      <div>
        <Lottie 
          options={defaultOptions}
          height={height||400}
          width={width||400}
        />
      </div>
    );
  }