### 

``` jsx

import React from 'react'

// 函数组件是纯组件，没有实例无法获取到this.ref
// const TargetComponent = ((props) => (
    //   <input type="text" />
// ))

// 而React.forwardRef创建的组件可以帮助拿到上层组件传进来的ref
const TargetComponent = React.forwardRef((props, ref) => (
  <input type="text" ref={ref} />
))

export default class Comp extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.ref.current.value = 'ref get input'
  }

  render() {
    return <TargetComponent ref={this.ref} />
  }
}

```