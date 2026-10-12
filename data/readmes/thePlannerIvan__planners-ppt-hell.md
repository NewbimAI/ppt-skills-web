#BRANCH:main
# Planner’s PPT Hell v5

主 Agent 将源材料整理成轻量底稿，直接设计可编辑 SVG、渲染并看图调整，整套人工审阅后导出 PPTX。

入口见 [SKILL.md](SKILL.md)。依赖见 scripts/requirements.txt；Python 还需 Playwright Chromium。没有模板时自主选择视觉；严格品牌复用和模板提取按需启用。

v5 不使用独立 Layout 审阅、强制子 Agent 或三页批次门禁。旧项目需用已归档的旧版本完成，不能直接混用新状态机。

运行 `python -m unittest discover -s scripts/test -p 'test_*.py'` 验证。工程验证不替代真实用户的视觉与内容验收。

由阿祖不看 TVC 创建与维护 · https://demyth.info · Lawyif@163.com。授权和归属详见 LICENSE、NOTICE、TRADEMARK.md。
