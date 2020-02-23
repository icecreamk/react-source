# Hook
最早在v16.7.0-alpha版本提出，v16.8正式版本中新增，官方介绍为：
> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 现状问题
* 很难在组件间复用状态逻辑
    * React 中很容易复用组件，但很难复用状态逻辑
    * 复用状态逻辑通常使用 [高阶组件](https://react.docschina.org/docs/higher-order-components.html) 和 [render props](https://react.docschina.org/docs/render-props.html)，但此类方案需要重新组织组件结构，使代码难以理解，且会形成“嵌套地狱”
* 复杂组件变得难以理解
    * 以生命周期组织代码，每个生命周期包含多个不相关的逻辑。如 componentDidMount 中设置多个事件监听
    * 相关逻辑拆分在不同的生命周期里。如事件监听需在 componentWillUnmount 中清除
* 难以理解的 class
    * 理解 this 工作方式，绑定事件处理器
    * 何时使用函数组件与 class 组件存在分歧
    * class 不能很好的压缩，并且会使热重载出现不稳定的情况

## Hook API

### useState
```
import React, { useState } from 'react';
function App() {
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
```
* 函数组件
* useState 声明 State 变量
    * 参数：initialState，作为初始 state
    * 返回值：当前 state 以及更新 state 的函数
* 函数中读取 State
* 函数方法更新 State

### useEffect
```
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
```
* useEffect 执行副作用操作，第一个参数为副作用函数，第二个为可选参数变量数组
* useEffect 对应着 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合
* 副作用函数可 return 函数，作为清除操作，类似 componentWillUnmount
* 可选参数变量数组，当变量值变化时，才再次执行 effect，进行性能优化，若传空数组 []，则会只执行一次 effect（仅在组件挂载和卸载时执行）

### 其他
* useContext
* useReducer
* [Hook API 索引](https://react.docschina.org/docs/hooks-reference.html)

### Hook 规则
可用 [linter 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)强制检测执行以下规则
* 只在 React 函数或自定义 Hook 中使用 Hook
* 只在最顶层使用 Hook
    * 不要在循环，条件或嵌套函数中调用 Hook，确保多个 Hook 时按照顺序被调用
    * 因为 React 依据 Hook 的调用顺序确定每个 State 与 useState 的对应关系

### 自定义 Hook
自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。通过自定义 Hook，可以将组件逻辑提取到可重用的函数中。
现实现可指定步进 step 参数的加法器 Hook。
* 自定义 useAdd Hook
```
// useAdd.js
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
```
* 使用 useAdd Hook
```
import React, { useState } from 'react';
import useAdd from './useAdd'
function AppCustomHook() {
    const [count1, add1] = useAdd(1);
    return (
        <div>
            <p>每次加1：{count1}</p>
            <button onClick={() => {
                add1()
            }}>点击</button>
        </div>
    )
}
```

## 问题解决
* 很难在组件间复用状态逻辑
使用自定义 Hook 提取状态逻辑，且不需要修改组件结构，更不会产生“嵌套地狱”
* 复杂组件变得难以理解
Hook 采用高内聚的思想将相互关联的逻辑在一起维护，并且可通过组合使用多个 Hook 实现功能组合
* 难以理解的 class
Hook 使得在非 class 的情况下使用更多的 React 特性，从函数角度编程