# Run Receipt · 定时任务验收箱

[English](README.en.md)

从 DSH 侧栏打开「定时任务验收箱」，查收原生计划每次运行的投递回执、轮次终态和报告验收结果。计划的创建、执行和重试仍在 DSH「定时任务」中操作。

## 安装

本地包以 Windows 上的 **DSH Web 0.2.2-rc.1** 和 Node.js 24 验证。退出目标 Web profile，再在同一个 profile 中安装。

```powershell
dsh plugin --profile web add "C:\path\to\jidekaixin2dian-dsh-run-receipt-0.1.0.tgz" -y
dsh --profile web
```

用过 `DSH_HOME` 的话，安装和启动使用同一个值。Desktop 由应用内插件管理器管理，使用能识别该包的市场安装源。此版的本地验收入口是 Web/CLI。

## 使用

1. 打开「订阅计划」，选择一项使用「每次新建会话」的原生计划。
2. 填写工作区相对路径，例如 `reports/{date}.md`。保存前可预览按计划时区展开的路径。Markdown 可填写必需标题，每行一个。留空则只跟踪轮次。
3. 在「运行记录」中点开一行查看匹配的会话和事件、验收时文件版本、以及标题检查。需要对照时点「检查当前版本」，可从这里打开或定位当前文件。
4. 用「标为已读」记录是否处理过。计划成功结束且预期无需生成报告时，可点「确认本次无需产出」。人工结论与自动验收都保留。

文件通过需要该轮中可核实的 DSH `write` 或 `edit` 成功写入，并且验收时仍是该版本。已有文件、Shell 或其他工具引起的变化会保留观察结果。历史投递可补关联轮次，文件证据从订阅规则生效后开始记录。「尚未观察到回执」来自持续观察到的应投递窗口，详情列出开始和截止时点。

规则修改作用于后续发生的运行。验收时版本和后来读取的当前版本分别显示。订阅、规则、历史和人工状态存放在目标 profile 的 `run-receipt/ledger.json`。卸载后保留该文件以便重装找回记录。

## 管理安装

```powershell
dsh plugin --profile web remove @jidekaixin2dian/dsh-run-receipt -y
```

市场分发使用 npm 包名 `@jidekaixin2dian/dsh-run-receipt`。本地 tarball 是离线安装来源。以后迁移到市场源时，按市场的「切换到市场版」提示操作。
