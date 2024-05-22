import { useLottie, LottieOptions } from "lottie-react";

const options: LottieOptions = {
    loop: true,
    autoplay: false,
    animationData: null,
}

export const startAnimation = (data: any) => {
    options.animationData = data

    const { play, setSpeed } = useLottie(options);
    play();
    setSpeed(0.5);
};

export const endAnimation = () => {
    options.animationData = null
    const { stop } = useLottie(options);
    stop()
};
