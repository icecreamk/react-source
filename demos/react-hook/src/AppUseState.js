import React, { useState } from 'react';

function AppUseState() {
    // 声明 "count" 的 state 变量，值为0；以及更新对应 state 的函数 setCount
    const [count, setCount] = useState(0);
    return (
        <div>
            {/* 函数中直接读取 count，setCount */}
            <p>{count}次</p>
            <button onClick={() => {
                setCount(count+1)
            }}>点击</button>
        </div>
    )
}

export default AppUseState