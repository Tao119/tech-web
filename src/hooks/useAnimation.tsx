import React, {
  useState,
  useEffect,
  ReactElement,
  JSXElementConstructor,
} from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export interface LottieContext {
  isVisible: boolean;
  options: any; // Define this type more precisely if possible
  startLottie: (animationData: any) => void;
  endLottie: () => void;
  View: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
}

const useAnimation = (): LottieContext => {
  const [options, setOptions] = useState({
    loop: true,
    autoplay: false,
    animationData: null,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [LottieComponent, setLottieComponent] = useState<ReactElement>();

  useEffect(() => {
    if (isVisible && options.animationData) {
      const props = {
        ...options,
        animationData: options.animationData,
        loop: true,
        autoplay: true,
      };
      // Ensure only setting ReactElement or null here
      setLottieComponent(<Lottie {...props} />);
    } else {
      setLottieComponent(undefined); // Correctly passing null when not visible
    }
  }, [isVisible, options]);

  const startLottie = (animationData: any) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      animationData: animationData,
    }));
    setIsVisible(true);
  };

  const endLottie = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      animationData: null,
    }));
    setIsVisible(false);
  };

  return {
    isVisible,
    options,
    startLottie,
    endLottie,
    View: LottieComponent,
  };
};

export default useAnimation;
