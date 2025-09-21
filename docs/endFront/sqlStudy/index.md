# SQL入门基础
## 概述
### 1、什么是SQL？有什么作用？

**SQL**（**Structured Query Language**，**结构化查询语言**）是一种专门用于管理**关系型数据库**的标准化语言，主要用于数据的`查询`、`操作（增删改）`、`结构定义`和`权限控制`。

### 2、什么是RDBMS？

**RDBMS**（**Relational Database Management System**，**关系型数据库管理系统**）是以**表格形式**存储数据、支持**表间关系**建立、具备**ACID特性**并使用**SQL语言**操作的数据库管理系统，常见的有 `MySQL`、`PostgreSQL`、`Oracle`、`SQL Server` 等。

### 3、常用的SQL语句有哪些分类？

SQL语句主要分为四类：**DQL**（数据查询语言，如 `SELECT`）、**DML**（数据操作语言，如 `INSERT`/`UPDATE`/`DELETE`）、**DDL**（数据定义语言，如 `CREATE`/`ALTER`/`DROP`）和 **DCL**（数据控制语言，如 `GRANT`/`REVOKE`）。

## SQL语法

### 1、基本语法规则
- SQL语句以分号（;）结尾
- SQL关键字不区分大小写，但建议使用大写
- 字符串值用单引号包围
- 注释：单行用 `--`，多行用 `/* */`

### SQL常用关键词及作用：

**查询相关：**
- `SELECT` - 选择要查询的列
- `FROM` - 指定查询的表
- `WHERE` - 设置查询条件
- `ORDER BY` - 结果排序
- `GROUP BY` - 数据分组
- `HAVING` - 分组后的条件筛选
- `LIMIT` - 限制返回记录数

**操作相关：**
- `INSERT` - 插入新数据
- `UPDATE` - 更新现有数据
- `DELETE` - 删除数据
- `SET` - 在UPDATE中指定新值

**表结构相关：**
- `CREATE` - 创建表、索引等
- `ALTER` - 修改表结构
- `DROP` - 删除表、索引等
- `TABLE` - 指定表名

**连接相关：**
- `JOIN` - 表连接
- `INNER JOIN` - 内连接
- `LEFT JOIN` - 左外连接
- `RIGHT JOIN` - 右外连接
- `ON` - 连接条件

**条件操作符：**
- `AND` - 逻辑与
- `OR` - 逻辑或
- `NOT` - 逻辑非
- `IN` - 值在列表中
- `LIKE` - 模糊匹配
- `BETWEEN` - 范围查询
- `IS NULL` - 空值判断

**聚合函数：**
- `COUNT()` - 计数
- `SUM()` - 求和
- `AVG()` - 平均值
- `MAX()` - 最大值
- `MIN()` - 最小值

**约束关键词：**
- `PRIMARY KEY` - 主键
- `FOREIGN KEY` - 外键
- `NOT NULL` - 非空
- `UNIQUE` - 唯一
- `DEFAULT` - 默认值
- `CHECK` - 检查约束

### 2、数据查询语言（DQL）
