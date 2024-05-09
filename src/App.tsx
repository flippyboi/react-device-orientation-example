import React from 'react';
import styles from './App.module.css';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
import { Card, CardContent } from './components/ui/card';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number;
    }
}

const inHandBg = '#00ad26';
const landscapeBg = '#a700ad';

function App() {
    const { alpha, beta, gamma, isLandscape, isInHand } = useDeviceOrientation();
    const [api, setApi] = React.useState<CarouselApi>();
    const currentBgColor = React.useMemo(() => {
        if (isLandscape) {
            return landscapeBg;
        }
        if (isInHand) {
            return inHandBg;
        }
        return undefined;
    }, [isInHand, isLandscape]);

    const switchSlide = React.useCallback((dir: 'left' | 'right') => {
        // toast("slide changed");
        api?.[dir === 'left' ? 'scrollPrev' : 'scrollNext']?.();
    }, [api]);

    React.useEffect(() => {
        window.addEventListener('gestureSwipe', (e: CustomEvent) => switchSlide(e.detail.dir));

        return () => window.addEventListener('gestureSwipe', (e: CustomEvent) => switchSlide(e.detail.dir));
    }, [switchSlide]);

    return (
        <>
            <div className={styles.block} style={{ backgroundColor: currentBgColor }}>
                <span>in hand: {JSON.stringify(isInHand)}</span>
                <span>landscape: {JSON.stringify(isLandscape)}</span>
            </div>
            <span>{JSON.stringify({ alpha, beta, gamma })}</span>
            <div className={styles.carousel_block}>
                <Carousel setApi={setApi} className="w-full rounded-lg">
                    <CarouselContent className="rounded-lg">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6 bg-black rounded-lg">
                                        <span className="text-4xl font-semibold text-white">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </>

    )
}

export default App;
