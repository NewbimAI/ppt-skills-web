#BRANCH:main
# codeximage-to-editable-ppt-v1

**简体中文** | [English](README.en.md)

这是一个 Codex Skill，用于将图片型 PowerPoint 演示文稿和幻灯片截图转换为可编辑的 PPTX 文件。

本 Skill 面向栅格化幻灯片，包括整页截图、仅包含图片的 PPT/PPTX、扫描幻灯片，
以及大部分可见内容并非 PowerPoint 原生对象的演示文稿。它可以将幻灯片图片拆分为视觉元素，
导出检查产物，并重建经过精细调整的可编辑 PowerPoint；在适合的情况下，文字框和简单结构会转换为
PowerPoint 原生可编辑对象，而复杂科学图示可以保留为独立 PNG 元素以维持视觉保真度。

## V1 与 V2 如何选择

- **V1：节省 Token 版本。** 复杂图片以原图裁剪和复用为主，重点将文字与简单结构转换为可编辑对象，
  能以较低的 Token 和时间成本完成可编辑化，适合一般组会汇报、内部交流和快速整理。
- **[V2：精细版本](https://github.com/wiltonesten-web/codeximage-to-editable-ppt-v2-1)。**
  对视觉质量和结构拆分要求更高；复杂图片会按需调用 `imagegen` 进行修复、清理背景，
  必要时甚至重绘相关视觉元素。它适合正式答辩、对外汇报和高保真交付，但通常需要更多 Token 和处理时间。

这是教学视频：[点击前往抖音观看](https://v.douyin.com/dmk2jHVBRxg/)

## 案例展示

### 案例 1：高效神经进化势

本案例从一张扁平化幻灯片图片开始，将其重建为包含多个可独立选择对象的 PowerPoint 页面。
可识别文字和简单演示结构可以编辑；为了保持视觉保真度，复杂科学图示可以继续作为独立 PNG 元素存在。

<table>
  <tr>
    <th width="50%">原始扁平化幻灯片</th>
    <th width="50%">可编辑 PowerPoint 结果</th>
  </tr>
  <tr>
    <td width="50%">
      <img src="examples/csh-nep-editable-slide/original-flattened-slide.png"
           alt="原始扁平化科学演示幻灯片" width="100%">
    </td>
    <td width="50%">
      <img src="examples/csh-nep-editable-slide/editable-powerpoint-view.png"
           alt="带有对象选择框的可编辑 PowerPoint 重建结果" width="100%">
    </td>
  </tr>
</table>

结果图中的选择框和旋转手柄表明，该页面由多个独立 PowerPoint 对象组成，
而不是一张覆盖整页的截图。

### 案例 2：精度、效率与尺度

该结构密集型幻灯片包含可编辑中文文字、编号内容面板、图标、分隔线和复杂科学图示。
精细重建结果在保持原始版式视觉一致性的同时，使文字、视觉元素和结构对象可以独立选择并继续编辑。

<table>
  <tr>
    <th width="50%">原始扁平化幻灯片</th>
    <th width="50%">可编辑 PowerPoint 结果</th>
  </tr>
  <tr>
    <td width="50%">
      <img src="examples/csh-nep-editable-slide-02/original-flattened-slide.png"
           alt="精度、效率与尺度页面的原始扁平化幻灯片" width="100%">
    </td>
    <td width="50%">
      <img src="examples/csh-nep-editable-slide-02/editable-powerpoint-view.png"
           alt="精度、效率与尺度页面的可编辑 PowerPoint 重建结果" width="100%">
    </td>
  </tr>
</table>

可编辑结果中的对象手柄展示了用于重建页面的文字、视觉和结构元素均可独立选择。

> 这些案例仅用于展示转换工作流。机构标识和出版物内容的权利仍归各自权利人所有。

## 输出内容

- 源页面图片
- 拆分后的 PNG 幻灯片元素
- CSV 和 JSON 格式的视觉元素清单
- 带有元素检测框的检查叠加图
- 基础重组 PPTX
- 精细可编辑 PPTX 重建工作流
- 启用质量检查时生成的差异图和质量报告
- 多文件批处理摘要与合并后的 PPTX

## 安装为 Codex Skill

本仓库中的实际 Codex Skill 位于：

```text
skills/codeximage-to-editable-ppt-v1
```

使用 Codex Skill 安装脚本从 GitHub 安装：

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo wiltonesten-web/codeximage-to-editable-ppt-v1 \
  --path skills/codeximage-to-editable-ppt-v1
```

在 Windows 上，最终安装目录应为：

```text
%USERPROFILE%\.codex\skills\codeximage-to-editable-ppt-v1
```

如需手动安装，只需将 `skills/codeximage-to-editable-ppt-v1` 文件夹复制到
`%USERPROFILE%\.codex\skills\`。不要将整个仓库根目录作为 Skill 文件夹复制。

## Python 依赖

安装所需 Python 软件包：

```bash
pip install -r skills/codeximage-to-editable-ppt-v1/requirements.txt
```

可选但建议安装的系统工具：

- LibreOffice：用于渲染、PPTX 预览和导出流程
- Tesseract OCR
- Tesseract 语言包，尤其是 `eng` 和 `chi_sim`
- Poppler 工具：在需要 PDF 或高质量页面渲染支持时使用

Ubuntu/Debian 安装示例：

```bash
sudo apt-get update
sudo apt-get install -y libreoffice poppler-utils tesseract-ocr tesseract-ocr-eng tesseract-ocr-chi-sim
```

## 基本用法

```bash
python skills/codeximage-to-editable-ppt-v1/scripts/decompose_visual_elements.py input.pptx --outdir output --ocr --editable-text
```

推荐的高保真命令：

```bash
python skills/codeximage-to-editable-ppt-v1/scripts/decompose_visual_elements.py input.pptx \
  --outdir output \
  --dpi 300 \
  --granularity fine \
  --ocr \
  --ocr-lang chi_sim+eng \
  --ocr-confidence-threshold 75 \
  --editable-text \
  --review \
  --quality-check
```

使用示例配置运行：

```bash
python skills/codeximage-to-editable-ppt-v1/scripts/decompose_visual_elements.py input.pptx \
  --config skills/codeximage-to-editable-ppt-v1/config.example.yaml \
  --outdir output
```

批量处理：

```bash
python skills/codeximage-to-editable-ppt-v1/scripts/run_batches.py input_folder_or_files \
  --outdir batch_output \
  --batch-size 2 \
  --batch-workers 2 \
  --dpi 300 \
  --granularity fine \
  --ocr \
  --ocr-lang chi_sim+eng \
  --ocr-confidence-threshold 75 \
  --editable-text \
  --review \
  --quality-check
```

## 输出目录结构

```text
output/
|-- source_pages/
|-- split_png_elements/
|-- split_png_elements.zip
|-- recomposed_from_elements.pptx
|-- visual_elements_manifest.csv
|-- visual_elements_manifest.json
|-- image_source_report.csv
|-- review/
|   |-- slide01_detected_elements_overlay.png
|   `-- ...
`-- quality_report/
    |-- slide01_original.png
    |-- slide01_recomposed.png
    |-- slide01_diff.png
    `-- quality_report.csv
```

## 注意事项

- 本 Skill 无法从栅格幻灯片中恢复原始矢量对象。
- 基础重组演示文稿属于参考产物，精细可编辑重建结果才是预期的主要交付物。
- 使用 OCR 结果前应进行人工检查，尤其是中文、小字号文字、公式、图表和密集标签。
- 复杂图形、照片、示意图和图表画面可以保留为独立 PNG 元素，同时将文字和简单结构重建为可编辑 PowerPoint 对象。
