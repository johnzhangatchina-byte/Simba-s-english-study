把录好的示范音频放到这个文件夹，文件名必须和课程数据里的 audio 字段一致。

命名规则：
  audio/{课程编号}-{序号}-{英文短名}.mp3

例如第一周星期一第一句：
  audio/p1-w01-mon-0-hello.mp3

课程编号在 data/curriculum.json 每课的 id 里，例如 p1-w01-mon。
序号从 0 开始，对应该课 phrases 数组的位置。
英文短名用小写字母和连字符。

有这个文件时，网页会优先播放它；没有文件时，会改用浏览器自带的英语朗读（Web Speech Synthesis）。
替换或新增音频后，请把项目根目录 sw.js 里的 VERSION 改成一个新值（例如 simba-squad-v2），再重新打开一次网页，以便更新离线缓存。
