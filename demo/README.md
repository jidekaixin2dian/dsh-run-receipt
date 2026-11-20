# 隔离宿主演示

使用 Windows、Node.js 24、Chrome、Playwright 和 DSH `0.2.2-rc.1`。测试模型监听 loopback，原生计划、调度、回执、会话和文件工具都由 DSH 执行。

## 实际投递与验收

从插件源码目录运行。为每次测试使用新建的临时根目录，并将 `$playwright` 设为已安装 Playwright 的 `index.mjs` 绝对路径。

```powershell
$src = (Get-Location).Path
$lab = Join-Path ([IO.Path]::GetTempPath()) ("run-receipt-" + [guid]::NewGuid())
New-Item -ItemType Directory "$lab/final-home/profiles/web","$lab/workspace","$lab/evidence","$lab/packages" | Out-Null
Copy-Item demo/profile.patch.yml "$lab/final-home/profiles/web/cordis.patch.yml"
npm ci
npm pack --pack-destination "$lab/packages"
$version = npm pkg get version | ConvertFrom-Json
$env:DSH_HOME = "$lab/final-home"
$env:DSH_AGENTS_HOME = "$lab/final-home/agents"
$env:DSH_TELEMETRY_DISABLED = '1'
$env:RUN_RECEIPT_DEMO_KEY = 'loopback-demo'
dsh plugin --profile web add "$lab/packages/jidekaixin2dian-dsh-run-receipt-$version.tgz" -y
```

新终端运行 `node demo/model.mjs 18979`。在继承上面环境变量的终端里进入 `$lab/workspace`，运行 `dsh --profile web --port 18977 --no-open *> "$lab/host.log"`。在另一窗口运行浏览器验收。

```powershell
node "$src/demo/host-acceptance.mjs" "$lab/host.log" "$lab/workspace/native-run" "$lab/evidence" $playwright
```

脚本通过原生 API 创建计划，在验收箱的真实界面订阅和设置规则，检查文件通过、旧文件、执行失败及另一任务更新同路径。输出 `native-receipts.json` 和亮暗主题截图。用同一个 profile 重启宿主后，可运行 `verify-panel.mjs` 的 `restart` 模式核对保留状态。结束时关闭隔离宿主和模型。

## 三个工作日回放

停止隔离宿主，创建新的 `$lab/replay-home`。复制 `final-home` 的 `sessions`、`storages` 和 `profiles/web/run-receipt/ledger.json` 到相同相对路径。创建空文件 `replay-home/RUN_RECEIPT_FIXTURE`，在新的 Web profile 中使用同一个 tarball 和 `profile.patch.yml`。

```powershell
node "$src/demo/replay.mjs" "$lab/evidence/native-receipts.json" "$lab/replay-home"
```

用 `DSH_HOME=$lab/replay-home` 启动隔离宿主，将启动日志保存在 `replay-host.log`。运行以下命令截图。

```powershell
node "$src/demo/verify-panel.mjs" "$lab/replay-host.log" "$lab/evidence/native-receipts.json" "$lab/evidence" $playwright replay
```

第 1 天保留真实计划回执和文件证据，第 2 天复现旧文件，第 3 天用固定时钟重放连续观察窗口。回放使用独立 profile。

## 升级与卸载

`verify-market.mjs` 读取社区市场源码，使用 loopback npm registry 先提供 `0.0.9`，再提供正在验收的版本。将首版包在临时目录解包，仅修改其 `package.json` 版本为 `0.0.9`，用 `npm pack --ignore-scripts` 生成旧版夹具。从一个全新的 `market-lab-*` 路径安装。

```powershell
node --experimental-transform-types "$src/demo/verify-market.mjs" $marketSource "$lab/market-lab-test" $newTgz $oldTgz "$lab/evidence/market-upgrade.json"
```

在隔离验证 profile 上，`verify-panel.mjs` 的 `uninstall` 模式会走宿主插件管理接口，检查实时卸载后的路由和侧栏入口。
