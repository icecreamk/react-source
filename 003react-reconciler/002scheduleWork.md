### scheduleWork
- 找到更新对应的FiberRoot节点
- 若符合条件重置stack(存放公共变量)
- 若符合条件就请求工作调度

#### 步骤
1. 点击按钮
2. 调用按钮所在组件的setState
3. 将组件的RootFiber加入调度