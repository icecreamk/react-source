import React, { useState, useEffect } from 'react';

function AppUseEffect() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        // 执行副作用操作
        document.title = `点击${count}次`;
        // 当副作用需要清除时，通过 return 函数实现，类似于执行 componentWillUnmount
        return () => {
            document.title = 'React App';
        }
        // 第二个可选参数，仅当 count 值变化时，才执行 effect
    }, [count])
    return (
        <div>
            <p>{count}次</p>
            <button onClick={() => {
                setCount(count+1)
            }}>点击</button>
        </div>
    )
}

export default AppUseEffect