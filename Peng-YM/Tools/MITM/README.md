# MITM Proxy

为开发者打造的又一神兵利器！电脑端MITM拦截请求并运行指定JavaScript脚本修改`Request`和`Response`。至此，配合**OpenAPI**，开发者已经可以完全脱离手机书写代码。

## 特性

1. 按照MITM host和正则自动拦截http(s)请求，并执行指定代码。
2. 支持自动生成Quantumult X, Loon 和 Surge 的配置。
3. 脚本在虚拟环境中运行 (vm2)，安全性100%！
4. 脚本实时加载，无需反复开启MITM proxy。

## 配置

### 1. 安装依赖

```shell
npm install -g hoxy vm2 http-server
# 当前目录下
npm link hoxy vm2
```

### 2. iOS端证书信任

在当前目录运行`http-server`

```shell
# 当前目录下
http-server .
```

手机访问http://{电脑IP}:8080 ，点击`mitmproxy.crt`安装证书，到设置开启**完全信任**。

### 3. 开发

用下面命令开启MITM Proxy，iOS设置WIFI代理为http://{电脑IP}:6789。即可开始脚本开发

```shell
# 当前目录
node Proxy.js
```

当前目录下有一个`config.json`文件作为MITM proxy的配置文件，一个例子如下：

```json
{
    "general": {
        "workspace": "/Users/pengym/Project/QuanX/Rewrites",
        "remote": "https://raw.githubusercontent.com/Peng-YM/QuanX/master/Rewrites"
    },

    "proxy": {
        "port": 6789,
        "key": "mitmproxy.key.pem",
        "cert": "mitmproxy.crt"
    },

    "mitm": [
        "httpbin.org"
    ],
    
    "scripts": [
        {
            "name": "test-request-body",
            "type": "request",
            "pattern": "^http:\/\/httpbin\\.org\/post",
            "require_body": true,
            "path": "test-request-body.js",
            "enabled": true
        }
    ]
}
```

`proxy`部分配置一般不需要更改，

1. `general.workspace`指定脚本路径，MITM proxy拦截请求后会加载此目录的脚本。
2. `general.remote`指定远程路径，用于一键生成配置文件。
3. `mitm`: https解密的hostnames。
4. `scripts`指定当前加载的环境，参数很好理解。
   - `name`: 脚本名字。
   - `type`: `request`或者`response`。
   - `pattern`: 正则表达式。
   - `require_body`: 是否需要`body`。
   - `path`: 文件名字。
   - `enabled`: 是否禁用，默认启用。

MITM Proxy会在启动时加载所有`config.json`里面指定的文件，**之后修改脚本无需重启Proxy**。

## 示例

在默认的`config.json`中，脚本`test-request-body.js`会拦截匹配`^http:\/\/httpbin\\.org\/post`的请求，并修改其request body。其内容如下：

```javascript
console.log(`${$request.body}`);
const $ = new API("test-request-body");
console.log(`Modified request body to ${$.read("data")}`);
$.done({body: $.read("data")}) // 这里会将body设置为："HACKED BY MITM"

// 下面是OpenAPI
```

是不是非常熟悉呢？手机发个**空的**POST请求 (可以用Anubis)，可以看到返回体为：

```json
{
  "args": {},
  "data": "HACKED BY MITM",
  "files": {},
  "form": {},
  "headers": {
    "Content-Length": "14",
    "Host": "httpbin.org",
    "X-Amzn-Trace-Id": "{一串字符串}"
  },
  "json": null,
  "origin": "{IP地址}",
  "url": "http://httpbin.org/post"
}
```

可以看到`data`字段已经被修改了。

另外，当前目录下的`rewrites.txt`里已经自动生成了全部远程配置。