# README #

# 准备工作

1. 需要先安装nodejs
2. 在项目目录下运行 npm install，安装依赖包
3. 将 ht 库放到 dist/libs目录下

# 运行方式：

* npm run pack // 测试开发
* npm run min // 部署

# 部署方式
运行 npm run min 后可以将 dist 目录部署

# 开发说明
## 如何与编辑器关联 
* 可直接将 2D 或者 3D 编辑器配置(server/config.ini)中, storageDir修改为项目 dist 的绝对路径，就可以直接在编辑器中编辑 2D、3D内容，例如
[instance-project]
port = 8090
autoOpen = false
storagePrefix = 
clientDir = ../client
customDir = ../instance-enjoy/custom
storageDir = /Users/user/project/dist

## src/pages 下的 js 是入口 js
## 创建新页面
1. 在 dist 中创建 html
2. 在 src/pages/创建 js 文件，建议一个 html 对应一个 js，注意 pages 目录下的 js 会被当成入口文件打包，如果 pages 下还有目录，则子目录下的同名 js 会被当成入口文件打包，比如 pages/index/index.js 和 page/index/Main.js 中，第一个文件会被当成入口文件打包