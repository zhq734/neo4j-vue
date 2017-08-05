# Neo4j Vue

## 安装步骤
1. 克隆或下载该库到本地
2. 下载neo4j并安装到本地, 启动neo4j服务
3. 进入到该工程的根目录, 输入命令: npm run update 进行npm包的导入
4. 使用命令: npm run dev 启动该工程
5. 默认端口是:8081
   - neo4j账号信息:
   - url: bolt://localhost
   - userName: neo4j
   - passsword: password

### 启动服务
`npm run dev` and point your web browser to `http://localhost:8081`.

# 目录结构
├── index.html                      入口页面
├── build                           构建脚本目录
│   ├── build-server.js                 运行本地构建服务器，可以访问构建后的页面
│   ├── build.js                        生产环境构建脚本
│   ├── dev-client.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
│   ├── dev-server.js                   运行本地开发服务器
│   ├── utils.js                        构建相关工具方法
│   ├── webpack.base.conf.js            wabpack基础配置
│   ├── webpack.dev.conf.js             wabpack开发环境配置
│   └── webpack.prod.conf.js            wabpack生产环境配置
├── config                          项目配置
│   ├── dev.env.js                      开发环境变量
│   ├── index.js                        项目配置文件
│   ├── prod.env.js                     生产环境变量
│   └── test.env.js                     测试环境变量
├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── src                             项目源码目录
│   ├── index.js                         入口js文件
│   ├── app.vue                         根组件
│   ├── app.js
│   ├── components                      公共组件目录
│   │   └── title.vue
│   ├── routes                          前端路由
│   │   └── index.js
│   └── views                           页面目录
│       └── Main.vue
└── static                          纯静态资源，不会被wabpack构建。

