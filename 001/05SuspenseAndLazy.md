### SuspenseAndLazy

打包工具可以使多个js文件最终打包成为一个 bundle 文件,随着 bundle 的体积不断增大，最终造成首次加载时间过长。而打包工具可以通过代码拆分来解决。而在react,可以通过`import('./Foo.js').then()`实现懒加载

``` javascript
export default class LazyPage extends Component {
    render() {
        return (
            <div>
                <Suspense fallback={<div>loading...</div>}>
                    <Bar/>
                    <Foo/>
                </Suspense>
            </div>
        )
    }
}

export function slowImport(value, ms = 1000){
    return new Promise(resolve=>{
        setTimeout(()=> resolve(value),ms);
    })
}

const Foo = React.lazy(
    () => slowImport(import('../components/Foo'), 1000 ));

const Bar = React.lazy(
    ()=> slowImport(import('../components/Bar'),500)
)

```

