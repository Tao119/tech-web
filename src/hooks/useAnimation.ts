"use client";
import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { useLottie, LottieOptions } from "lottie-react";

export interface LottieContext {
    isVisible: boolean,
    options: LottieOptions,
    startLottie: (animationData: any) => void;
    endLottie: () => void;
    View: ReactElement<any, string | JSXElementConstructor<any>>
}

const useAnimation = (): LottieContext => {
    const [options, setOptions] = useState<LottieOptions>({
        loop: true,
        autoplay: false,
        animationData: null,
    });
    const [isVisible, setIsVisible] = useState(false);
    const { View, play, stop, setSpeed } = useLottie(options);

    useEffect(() => {
        if (isVisible) {
            play();
            setSpeed(0.5);
        } else stop();
    }, [options])

    const startLottie = (data: any) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            animationData: data,
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
        View
    };
};

export default useAnimation;