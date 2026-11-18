# Run Receipt

[中文](README.md)

Open Run Receipt from the DSH sidebar to review delivery, execution, and report evidence for native automation tasks. Create, run, and retry plans in DSH’s Automation tasks panel.

## Install

The local package was verified on **DSH Web 0.2.2-rc.1** on Windows with Node.js 24. Stop the target Web profile and install into that same profile.

```powershell
dsh plugin --profile web add "C:\path\to\jidekaixin2dian-dsh-run-receipt-0.1.0.tgz" -y
dsh --profile web
```

Use the same `DSH_HOME` for installation and startup. Desktop manages its own profile through the in-app plugin manager and a market source that lists the package. The verified local installation path uses Web and the CLI.

## Review a run

1. Open **Plans** and track a native plan that creates a fresh session every time.
2. Set an optional workspace-relative path such as `reports/{date}.md`. The preview expands the date in the plan’s time zone. For Markdown, enter one required heading per line. Leave the path empty to track execution only.
3. In **Runs**, select a row to see the matched session, event sequence, reviewed file version, and heading checks. Use **Check current version** to compare it with the reviewed version and open or reveal the current file.
4. Mark the run as read, or confirm that a completed run was expected to produce no report. The inbox retains both the manual review and the automatic check.

A file passes when the matched turn successfully updated it with DSH’s `write` or `edit` tool and the reviewed version matches that write. Other file changes are recorded as observations. Retained deliveries can be linked to turns. File evidence starts when a rule takes effect. **No receipt observed** appears for a continuously observed due window, with both observation timestamps in the details.

Rule edits apply to subsequent occurrences. Subscriptions, review evidence, and manual state are stored in the profile’s `run-receipt/ledger.json`. The file remains available for a later reinstall.

## Manage the installation

```powershell
dsh plugin --profile web remove @jidekaixin2dian/dsh-run-receipt -y
```

The npm identity for market distribution is `@jidekaixin2dian/dsh-run-receipt`. Use the tarball for offline installation and the market’s migration action when switching to a market installation.
