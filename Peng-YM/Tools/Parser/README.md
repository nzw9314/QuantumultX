# QX资源解析器魔改版

## Acknowledgements

本资源解析器绝大部分代码来自@KOP-XIAO的resouce-parser。我在此基础上根据自己的需求实现了一些新特性:

1. `sfilter`参数可以传入一段**base64编码**的脚本，用于**过滤**订阅节点。
2. `srename`参数可以传入一段**base64编码**的脚本，用于**重命名**订阅节点。

相比于使用正则或者关键字进行过滤和重命名，脚本可以实现几乎所有的需求，但是复杂度也随之提升。本解析器主要是个人使用。本文档只是介绍一些基本用法，**如果你不具备JavaScript的基础知识，不建议使用此特性**。

## 用法

### 1. sfilter

`sfilter`参数里面的脚本只能有一个名为`filter`的函数：

```javascript
function filter(nodes) {}
```

其中`nodes`参数有以下两个key:

- `names`，包含了所有节点的`tag`。

- `types`，包含了所有节点的类型，可以为`shadowsocks`, `vmess`, `http`, `trojan`或者`unknown`。节点类型同样可以用于过滤或者重命名。

`filter`函数的核心思想是：根据`nodes`输出一个布尔数组，其中`true`代表选择该节点，`false`代表去掉该节点`。

在此解析器中，提供了一些基础的API方便过滤，这些API统一使用`$`调用。对于`sfilter`，提供的API有：

- `$.filter(names, /(香港|HK|Hong Kong|/i, /台湾|TW|Taiwan/i)`，对于`names`中包含**任何一个**正则表达式的元素，返回`true`。

另外，对于一些复杂的需求，提供了三个布尔运算符`AND`, `OR`, `NOT`。

- `AND`可以合并多个布尔数组，表达的是**逻辑和**的关系
  - 例如：`AND([true, false, true], [false, true, true]) ==> [false, fasle, true]`。
- `OR`类似于`AND`，表达的是**逻辑或**的关系
  - 例如：`OR([true, false, false], [false, true, false]) ==> [true, true, false]`。
- `NOT`用于反转一个布尔数组的所有元素

理解了这些之后，我们来看个例子：比如说对于一个订阅：

> 我们的需求是：
>
> - 只保留shadowsocks或者vmess类型的节点。
> - 所有带有"NETFLIX"的节点。
> - 只要IPLC和IEPL的节点。
> - 去掉"印度"，"土耳其"，"加拿大"的节点，我们还需要保留NETFLIX节点。

我们可以这样写一个`filter`函数：

```javascript
function filter(nodes) {
  const names = nodes.names;
  const types = $.filter(nodes.types, /shadowsocks|vmess/);
  const netflix = $.filter(names, /NETFLIX/i); //过滤出所有NETFLIX节点
  const iplc = $.filter(names, /IPLC|IEPL/i); //过滤出含有IPLC和IEPL的节点
  const kick = $.filter(names, /印度|土耳其/, /加拿大/); //过滤掉某些地区的节点，注意$.filter可以支持多个表达式
  return AND(types, OR(netflix, AND(iplc, NOT(kick))));
}
```

可以看到`sfilter`足以应付几乎各种奇奇怪怪的需求。

### 2. srename

与上面类似，我们需要写一个名为`rename`的函数。解析器提供的API有：

- `$.replace(names, /regex/, newName)`，替换一个正则表达式为指定的名字。
- `$.delete(names, /regex1/, /regex2/, /regex3/)`，删除包含匹配到任何一个正则的字段。
- `$.trim(names)`，删除多余的空格。

例如：

```javascript
function rename(nodes){
    let names = nodes.names;
    names = $.delete(names, /IPLC|IEPL/i, /HULU|HBO|动画疯/i, /\d+(GBPS|MBPS)/i, /洛杉矶|圣塔克拉利塔|萨克拉门托|帕罗奥图/);
    names = $.trim(names);
    return names;
}
```

当然，解析器提供的API只是辅助，你完全可以实现更加复杂、更加个性化的需求。
