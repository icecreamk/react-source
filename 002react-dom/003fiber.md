### Fiber
- Fiber对应一个组件需要被处理或者已经处理，一个组件可以有一个或多个Fiber
- 每一个ReactElement对应一个Fiber对象
- 记录节点的各种状态
  + 如：class组件的 state,props等
  + 在Fiber更新之后，才会更新到class组件上，组件并不会自动调理更新，更新过程都是在fiber上，所以对于函数组件(hooks)，也可以从Fiber上获取更新的内容
- 串联整个应用形成树结构