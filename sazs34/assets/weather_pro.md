## 前言

为了满足多元化的天气信息查询(其实就是开发者想写着玩而已)

提供了快捷地天气信息查询支持

能够快速地查看`当天天气` `7天天气` `48小时逐小时天气`

您可以自由地进行配置,混搭,想怎样就怎样

## 说明

这个就相当于一个占位符

比如我要显示的内容是`北京 晴 --@wechatu`

则这里面包含了`城市名称` `天气描述` `diy任意文字`

我的模板就要写成

```
$[city] $[weather] --@wechatu
```

## 示例

### 每日天气查看

![image-20200107183838878](assets/image-20200107183838878.png)

#### 对应模板

```javascript
{
    title: `$[city]$[district] $[summary]`,
    subtitle: `$[weatherIcon]$[weather] $[temperatureMin] ~ $[temperatureMax]°C ☔️降雨概率 $[precipProbability]%`,
    detail: `🥵空气质量 $[aqi]($[aqiDesc]) 🌬风速$[windSpeed]km/h $[windDir]
👀紫外线指数 $[uv]($[uvDesc]) 💦湿度$[currentHumidity]%
🌡体感温度 $[apparentTemperatureMin] ~ $[apparentTemperatureMax]°C 🏋🏻‍♀️气压$[atmosphere]pa
$[lifeStyle]`
}
```

### 一周天气查看

![image-20200107183850800](assets/image-20200107183850800.png)

#### 对应模板

```javascript
{
    title: `$[city]$[district] $[weeklySummary]`,
    subtitle: ``,
    detail: `$[daily($[month]月$[day]日 $[weatherIcon]$[weather]    $[temperatureLow]~$[temperatureHigh]°C)]`
}
```



### 48小时天气查看

![image-20200107183901094](assets/image-20200107183901094.png)

#### 对应模板

```javascript
{
    title: `$[city]$[district] $[weeklySummary]`,
    subtitle: ``,
    detail: `$[hourly($[month]/$[day] $[hour]:00 $[weatherIcon]$[weather] $[temperature]°C 湿度$[humidity]%)]`
}
```

### 混搭

![image-20200107184718882](assets/image-20200107184718882.png)

#### 对应模板

```
{
    title: `$[city]$[district] $[summary]`,
    subtitle: `$[weatherIcon]$[weather] $[temperatureMin] ~ $[temperatureMax]°C ☔️降雨概率 $[precipProbability]%`,
    detail: `🥵空气质量 $[aqi]($[aqiDesc]) 🌬风速$[windSpeed]km/h $[windDir]
👀紫外线指数 $[uv]($[uvDesc]) 💦湿度$[currentHumidity]%
🌡体感温度 $[apparentTemperatureMin] ~ $[apparentTemperatureMax]°C 🏋🏻‍♀️气压$[atmosphere]pa

$[hourly($[month]/$[day] $[hour]:00 $[weatherIcon]$[weather] $[temperature]°C 湿度$[humidity]%)]`
}
```



## API KEY申请

使用此脚本需要申请key

- [Dark Sky API](https://darksky.net/dev)
- [Aqicn API](http://aqicn.org/data-platform/token/#/)
- [和风天气API](https://dev.heweather.com/) (注意生成key类型选择 WebApi)

## 配置项位置

在show节点-template,这是一个示例用的模板

```javascript
{
    title: `$[city]$[district] $[summary]`,
    subtitle: `$[weatherIcon]$[weather] $[temperatureMin] ~ $[temperatureMax]°C ☔️降雨概率 $[precipProbability]%`,
    detail: `🥵空气质量 $[aqi]($[aqiDesc]) 🌬风速$[windSpeed]km/h $[windDir]
👀紫外线指数 $[uv]($[uvDesc]) 💦湿度$[currentHumidity]%
🌡体感温度 $[apparentTemperatureMin] ~ $[apparentTemperatureMax]°C 🏋🏻‍♀️气压$[atmosphere]pa
$[lifeStyle]`
}
```

## 可配置的选项

### 普通模板

可以直接调用

|          配置项           |         功能         | 单位 |      示例值      |
| :-----------------------: | :------------------: | :--: | :--------------: |
|        $[province]        |          省          |      |       江苏       |
|          $[city]          |          市          |      |       苏州       |
|        $[district]        |          区          |      |     工业园区     |
|        $[summary]         |   全天气候变化概述   |      | 晴朗将持续一整天 |
|     $[weeklySummary]      |   一周气候变化概述   |      |  降雨持续一整周  |
|      $[weatherIcon]       |       天气图标       |      |        ☀️         |
|        $[weather]         | 天气描述(晴/雨/雪等) |      |     晴转多云     |
|   $[currentTemperature]   |       当前温度       |  ℃   |        22        |
|     $[temperatureMin]     |       温度低值       |  ℃   |        13        |
|     $[temperatureMax]     |       温度高值       |  ℃   |        26        |
| $[apparentTemperatureMin] |     体感温度低值     |  ℃   |        15        |
| $[apparentTemperatureMax] |     体感温度高值     |  ℃   |        23        |
|   $[precipProbability]    |       降雨概率       |  %   |        90        |
|          $[aqi]           |       空气质量       |      |        45        |
|        $[aqiIcon]         |     空气质量图标     |      |        🟢         |
|        $[aqiDesc]         |     空气质量描述     |      |        优        |
|       $[windSpeed]        |       全天风速       | km/h |        15        |
|    $[currentWindSpeed]    |       当前风速       | km/h |        13        |
|        $[windDir]         |       全天风向       |      |      西北风      |
|     $[currentWindDir]     |       当前风向       |      |      东南风      |
|       $[windPower]        |     全天风力等级     |      |       3-4        |
|    $[currentWindPower]    |     当前风力等级     |      |       3-4        |
|        $[humidity]        |     全天相对湿度     |  %   |        30        |
|    $[currentHumidity]     |     当前相对湿度     |  %   |        30        |
|       $[atmosphere]       |      全天大气压      |  Pa  |       1030       |
|   $[currentAtmosphere]    |      当前大气压      |  Pa  |       1030       |
|       $[visibility]       |      全天能见度      |  km  |        10        |
|   $[currentVisibility]    |      当前能见度      |  km  |        10        |
|           $[uv]           |      紫外线指数      |      |        3         |
|         $[uvDesc]         |      紫外线描述      |      |    二级-较强     |
|        $[sunrise]         |       日出时间       |      |      07:36       |
|         $[sunset]         |       日落时间       |      |      16:58       |
|        $[moonrise]        |       月出时间       |      |      04:47       |
|        $[moonset]         |       月落时间       |      |      14:59       |
|       $[lifeStyle]        |       生活指数       |      |       ...        |
|                           |                      |      |                  |
|           more            |   更多内容等待更新   |      |                  |

### 列表模板

> 用于多天/逐小时天气的渲染
>
> 可以同上面的普通模板同时使用

#### 逐小时天气(48小时)

$[hourly(`此处填入配置`)]

```
例如我每小时想要显示的内容是  12点 ☀️晴 温度12℃
则模板填入的内容是
$[hourly($[hour]点 $[weatherIcon]$[weather] 温度$[temperature]℃)]
外面$[hourly()]是固定的部分,仅在括号内填入配置
```

|         配置项         |          功能           | 单位 |   示例    |
| :--------------------: | :---------------------: | :--: | :-------: |
|  $[month]  |   月份   |  月  |       10       |
|   $[day]   |   日期   |  日  |       05       |
|        $[hour]         |          小时           |      |    12     |
|       $[summary]       |          概述           |      | 多云转阴  |
|     $[weatherIcon]     |        天气图标         |      |     ☀️     |
|       $[weather]       |  天气描述(晴/雨/雪等)   |      | 晴转多云  |
|     $[temperature]     |          温度           |  ℃   |    12     |
| $[apparentTemperature] |        体感温度         |  ℃   |    10     |
|      $[humidity]       |          湿度           |  $   |    30     |
|      $[windSpeed]      |          风速           | km/h |     5     |
|     $[visibility]      |         能见度          |  km  |    16     |
|       $[uvIndex]       |       紫外线指数        |      |     5     |
|       $[uvDesc]        |       紫外线描述        |      | 一级-最弱 |
|     $[cloudCover]      | 被云遮挡的天空比例(0~1) |  %   |    91     |

#### 多天天气(7天)

$[daily(`此处填入配置`)]

|   配置项   |   功能   | 单位 |      示例      |
| :--------: | :------: | :--: | :------------: |
|  $[month]  |   月份   |  月  |       10       |
|   $[day]   |   日期   |  日  |       05       |
| $[summary] | 天气概述 |      | 小雨持续至下午 |
|     $[weatherIcon]     |        天气图标         |      |     ☀️     |
|       $[weather]       |  天气描述(晴/雨/雪等)   |      | 晴转多云  |
| $[temperatureHigh] | 温度高值 | ℃ | 20 |
| $[temperatureLow] | 温度低值 | ℃ | 13 |
| $[apparentTemperatureMax] | 体感温度高值 | ℃ | 18 |
| $[apparentTemperatureMin] | 体感温度低值 | ℃ | 14 |
|      $[humidity]       |          湿度           |  $   |    30     |
|      $[windSpeed]      |          风速           | km/h |     5     |
|     $[visibility]      |         能见度          |  km  |    16     |
|       $[uvIndex]       |       紫外线指数        |      |     5     |
|       $[uvDesc]        |       紫外线描述        |      | 一级-最弱 |
|     $[cloudCover]      | 被云遮挡的天空比例(0~1) |  %   |    91     |
|            |          |      |                |
