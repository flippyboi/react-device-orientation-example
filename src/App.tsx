import React from 'react';
import styles from './App.module.css';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from './components/ui/carousel';
import { Card, CardContent } from './components/ui/card';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined;
    }
}

function App() {
    const { alpha, beta, gamma, isLandscape, isInHand, swipeState } = useDeviceOrientation();
    const [api, setApi] = React.useState<CarouselApi>();

    const switchSlide = React.useCallback((dir: 'left' | 'right') => {
        api?.[dir === 'left' ? 'scrollPrev' : 'scrollNext']?.();
    }, [api]);

    React.useEffect(() => {
        window.addEventListener('gestureSwipe', (e: CustomEvent) => switchSlide(e.detail.dir));

        return () => window.addEventListener('gestureSwipe', (e: CustomEvent) => switchSlide(e.detail.dir));
    }, [switchSlide]);

    return (
        <>
            <div className={styles.pos_info}>
                <span data-in-hand={isInHand}>in hand: {JSON.stringify(isInHand)}</span>
                <span data-landscape={isLandscape}>landscape: {JSON.stringify(isLandscape)}</span>
            </div>
            <div className={styles.state}></div>
            <div className={styles.carousel_block} data-visible={isInHand}>
                <Carousel setApi={setApi} className="w-full rounded-lg">
                    <CarouselContent className="rounded-lg">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                    <CardContent className="flex items-center justify-center p-6 rounded-lg aspect-square">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className={styles.info}>
                <span>alpha: {alpha}</span>
                <span>beta: {beta}</span>
                <span>gamma: {gamma}</span>
                <span data-swipestate={swipeState}>swipe state: {swipeState}</span>
            </div>
        </>

    )
}

export default App;
