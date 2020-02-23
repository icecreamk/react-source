import { useState } from 'react';

function useAdd(step) {
    const [count, setCount] = useState(0);
    const add = () => {
        setCount(count + step);
    }
    return [
        count,
        add
    ]
}

export default useAdd