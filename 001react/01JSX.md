### babel可以将jsx转成react的语法，最终转成javascript

``` html
<div id='main'>
  <span>text</span>
</div>
```

``` javascript
"use strict";

React.createElement("div", {
  id: "main"
}, React.createElement("span", null, "text"));
```

### babel中规范规定自定义组件第一个字母大写(防止和原生的标签冲突)

``` 
function CustomCom() {
	return <div id='main'>
      <span>text</span>
    </div>
}

<CustomCom />
```

``` javascript
"use strict";

function CustomCom() {
  return React.createElement("div", {
    id: "main"
  }, React.createElement("span", null, "text"));
}

React.createElement(CustomCom, null);
```