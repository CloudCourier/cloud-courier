// git commit 规范
// <类型>[可选的作用域]: <描述>
// git commit -m 'feat: 增加 xxx 功能'
// git commit -m 'bug: 修复 xxx 功能'
// # 主要type
// feat:     增加新功能
// fix:      修复bug
// build:     主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
// ci:         主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
// docs:       文档更新
// perf:      性能，体验优化
// refactor:  代码重构时使用
// style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
// refactor: 代码重构时使用
// revert:   执行git revert打印的message
// chore：      不属于以上类型的其他类型
// test:     添加测试或者修改现有测试

module.exports = {
  extends: ['@commitlint/config-conventional'],
};
