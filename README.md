# 🐢 海龟汤生成器                                                                                                     
  > 选类别 · 定主题 · 熬一锅好汤                                                                                        esc to interrupt

  一个基于 AI 的海龟汤段子生成网站，支持 **六大类别** × **五档难度**，输入任意主题即可生成 5 个海龟汤谜题。

  ---

  ## 什么是海龟汤？

  海龟汤（Turtle Soup）是一种情境推理游戏：给出一个离奇的情境（**汤面**），玩家通过"是/否"提问推理出背后的真相（**汤底**
  ）。考验推理能力和脑洞，适合聚会、群聊互动。

  ---

  ## 功能

  | 功能 | 说明 |
  |------|------|
  | 六大类别 | 生活日常 / 悬疑犯罪 / 细思极恐 / 脑洞反转 / 温情治愈 / 沙雕搞笑 |
  | 五档难度 | 入门×2、进阶×1、烧脑×1、脑筋急转弯×1 |
  | 5 路并发 | 5 个故事同步生成，约 3~5 秒出结果 |
  | 响应式 | 电脑、平板、手机均可使用 |
  | 类别主题色 | 不同类别对应不同卡片颜色和视觉效果 |
  | 交互反馈 | 骨架屏加载、实时计时、汤底展开动画、彩纸特效 |

  ---

  ## 快速开始

  ```bash
  # 1. 安装依赖
  npm install

  # 2. 配置 API 密钥
  # 复制 .env 文件并填入你的密钥

  # 3. 启动
  node server.js

  # 4. 打开 http://localhost:3000

  ---
  纯前端部署

  public/standalone.html 是无需服务器的版本，可拖拽部署到 Vercel、Netlify 或 Cloudflare Pages，立即可用。

  ---
  项目结构

  ├── server.js              # Express 后端
  ├── public/
  │   ├── index.html         # 前端 UI
  │   └── standalone.html    # 纯前端版（可独立部署）
  ├── package.json
  └── .env                   # API 配置

  ---
  技术栈

  - 前端：原生 HTML / CSS / JS
  - 后端：Node.js + Express
  - AI：DeepSeek API（Anthropic 兼容接口）
  - 部署：Vercel / Netlify / Cloudflare Pages

  ---
