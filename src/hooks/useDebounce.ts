import React from 'react';

import debounce from 'lodash.debounce';

export const useDebounce = <T>(callback: (arg?: T) => void, delay: number) => {
    const options = { leading: false, trailing: true };

    const cbRef = React.useRef(callback);

    React.useEffect(() => {
        cbRef.current = callback;
    });

    return React.useCallback(
        debounce((arg?: T) => cbRef.current(arg), delay, options),
        [delay],
    );
};
