# 中文排版 Pangu CN

在 VS Code 里自动整理中文排版：中英文之间、中文与数字之间补空格，中文标点前后不留多余空格。写 Markdown、公众号草稿、文档注释时特别省心。

## 功能

- **一键格式化文档**：命令面板执行 `中文排版：格式化当前文档`
- **格式化选区**：右键菜单或命令面板，只处理选中的段落
- **保存时自动排版**（默认关闭）：`中文排版：切换保存时自动排版`
- **安全跳过**：围栏代码块、缩进代码块、行内代码、URL、HTML 标签、Markdown 链接地址、Wiki 链接都不会被改动
- **可选标点转换**：把中文语境里的半角 `, . ! ? : ;` 转成全角，默认关闭

## 示例

```
使用VSCode写Markdown文档，共3个文件
```

↓

```
使用 VSCode 写 Markdown 文档，共 3 个文件
```

## 配置项

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `panguCn.enableSpacing` | `true` | 中英文/数字之间补空格 |
| `panguCn.enablePunctuation` | `false` | 半角标点转全角 |
| `panguCn.formatOnSave` | `false` | 保存时自动格式化 |
| `panguCn.languages` | `markdown, plaintext, restructuredtext, latex, html` | 允许整篇格式化的语言 |

> 对 JavaScript、Python 等源码文件，建议只用「格式化选中内容」，避免改动字符串字面量。

## 快捷键建议

在 `keybindings.json` 中自行绑定：

```json
{
  "key": "ctrl+alt+p",
  "command": "panguCn.formatDocument"
}
```

## 反馈

遇到误改内容（例如某些 DSL、特殊 Markdown 扩展），请附上原文片段与语言 ID 提 issue。

## License

MIT
