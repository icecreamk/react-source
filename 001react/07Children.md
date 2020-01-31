### Children
- map
- forEach
- count
- toArray
- only

#### map(返回一个扁平化(没有嵌套)的数组)
``` javascript
React.Children.map([1,2], c => [c, c]) // [1,1,2,2]
React.Children.map([1,2], c => [c, [c, c]]) // [1,1,1,2,2,2]
```
