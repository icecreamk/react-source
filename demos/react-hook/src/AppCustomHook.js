import React, { useState } from 'react';
import useAdd from './useAdd'

function AppCustomHook() {
    const [count1, add1] = useAdd(1);
    const [count2, add2] = useAdd(2);
    return (
        <div>
            <div>
                <p>每次加1：{count1}</p>
                <button onClick={() => {
                    add1()
                }}>点击</button>
            </div>
            <hr/>
            <div>
                <p>每次加2：{count2}</p>
                <button onClick={() => {
                    add2()
                }}>点击</button>
            </div>
        </div>
    )
}

export default AppCustomHook