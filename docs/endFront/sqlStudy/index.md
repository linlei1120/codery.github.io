# SQL入门基础

## 概述

### 1、什么是SQL？有什么作用？

**SQL**（**Structured Query Language**，**结构化查询语言**）是一种专门用于管理**关系型数据库**的标准化语言，主要用于数据的 `查询`、`操作（增删改）`、`结构定义` 和 `权限控制`。

### 2、什么是RDBMS？

**RDBMS**（**Relational Database Management System**，**关系型数据库管理系统**）是以**表格形式**存储数据、支持**表间关系**建立、具备 **ACID 特性**并使用 **SQL 语言**操作的数据库管理系统，常见的有 `MySQL`、`PostgreSQL`、`Oracle`、`SQL Server` 等。

| 特性 | 含义 |
| --- | --- |
| **A**tomicity（原子性） | 事务中的操作要么全部成功，要么全部回滚 |
| **C**onsistency（一致性） | 事务前后数据满足所有约束规则 |
| **I**solation（隔离性） | 并发事务之间互不干扰 |
| **D**urability（持久性） | 事务提交后，数据永久保存 |

### 3、常用的SQL语句有哪些分类？

SQL 语句主要分为四类：

| 分类 | 全称 | 作用 | 典型语句 |
| --- | --- | --- | --- |
| **DQL** | 数据查询语言 | 查询数据 | `SELECT` |
| **DML** | 数据操作语言 | 增删改数据 | `INSERT` / `UPDATE` / `DELETE` |
| **DDL** | 数据定义语言 | 定义/修改表结构 | `CREATE` / `ALTER` / `DROP` |
| **DCL** | 数据控制语言 | 权限管理 | `GRANT` / `REVOKE` |

---

## 数据库与表

关系型数据库的核心是**用表组织数据**。先理解下面这些概念，后面的示例会更容易对照。

### 1、数据库（Database）

**数据库**是存放一组相关表的容器，通常对应一个业务系统或项目，例如 `school_db`（学校库）、`shop_db`（商城库）。

- 一个 MySQL **实例**里可以有多个数据库
- 每个数据库有独立的表、用户权限等
- 使用前先 `USE school_db;` 切换到目标库

```sql
-- 创建并切换数据库（MySQL 示例）
CREATE DATABASE IF NOT EXISTS school_db
  DEFAULT CHARACTER SET utf8mb4;
USE school_db;
```

### 2、表（Table）

**表**是数据库中存储数据的基本单位，由**行**和**列**组成，类似 Excel 中的一张工作表。

| 概念 | 说明 | 示例 |
| --- | --- | --- |
| **表名** | 标识一张表，通常用名词复数或业务含义命名 | `students`、`courses` |
| **行（Row / Record）** | 一条完整记录，代表一个实体 | 学生「张三，20 岁，北京」 |
| **列（Column / Field）** | 表的属性/字段，定义数据类型与约束 | `name`、`age`、`city` |
| **单元格（Cell）** | 行与列交叉处的单个值 | `'张三'`、`20`、`'北京'` |

以 `students` 表为例：

| id | name | age | city |
| --- | --- | --- | --- |
| 1 | 张三 | 20 | 北京 |
| 2 | 李四 | 22 | 上海 |

- 每一**行** = 一名学生
- 每一**列** = 学生的一个属性
- `id`、`name` 等是**列名**；`1`、`'张三'` 等是**列值**

### 3、主键（Primary Key）

**主键**用来**唯一标识**表中的每一行，具有以下特点：

- **唯一**：不能重复
- **非空**：不能为 `NULL`
- 一张表通常只有**一个**主键（可以是单列，也可以是多列组成的联合主键）

```sql
-- id 列作为主键，并设置自增
CREATE TABLE students (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);
```

常见用法：

| 方式 | 说明 |
| --- | --- |
| 自增整数 `AUTO_INCREMENT` | 最常用，数据库自动生成 id |
| 业务唯一编号 | 如学号、订单号，需保证全局唯一 |
| 联合主键 | 多列组合唯一，如 `(student_id, course_id)` |

> 有了主键，才能可靠地 `UPDATE`、`DELETE` 某一行，也方便其他表引用这条记录。

### 4、外键（Foreign Key）

**外键**用于建立**表与表之间的关联**，引用另一张表的**主键**（或唯一键）。

```sql
-- enrollments.student_id 引用 students.id
FOREIGN KEY (student_id) REFERENCES students(id)
```

含义：`enrollments` 表中的 `student_id`，必须是 `students` 表中已存在的 `id`。

| 作用 | 说明 |
| --- | --- |
| **参照完整性** | 不能插入「不存在的学生 id」 |
| **级联操作** | 可配置删除/更新主表记录时，从表如何处理（`ON DELETE CASCADE` 等） |
| **表达关系** | 一对多、多对多等关系通过外键体现 |

常见关系类型（结合后续示例库）：

| 关系 | 说明 | 示例 |
| --- | --- | --- |
| **一对多** | 一方主键，多方外键 | 一名学生 → 多条选课记录 |
| **多对多** | 通过中间表 + 两个外键 | 学生 ↔ 课程，经 `enrollments` 关联 |

### 5、索引（Index）

**索引**是一种**加速查询**的数据结构，类似书的目录：按索引列查找时，不必逐行扫描全表。

```sql
CREATE INDEX idx_students_city ON students(city);
```

| 特点 | 说明 |
| --- | --- |
| **加快查询** | 对 `WHERE`、`JOIN`、`ORDER BY` 中常用列效果明显 |
| **占用空间** | 索引本身需要额外存储 |
| **影响写入** | `INSERT` / `UPDATE` / `DELETE` 时需同步维护索引 |

索引与主键的区别：

| | 主键 | 普通索引 |
| --- | --- | --- |
| 唯一性 | 必须唯一 | 可唯一（`UNIQUE`）或非唯一 |
| 数量 | 每表通常 1 个 | 可建多个 |
| 主要用途 | 标识行、被外键引用 | 提升查询性能 |

### 6、其他常见约束

除主键、外键、索引外，列上还可附加约束，保证数据质量：

| 约束 | 作用 | 示例 |
| --- | --- | --- |
| `NOT NULL` | 不允许为空 | `name VARCHAR(50) NOT NULL` |
| `UNIQUE` | 值唯一，但可有一个 `NULL` | 邮箱、手机号 |
| `DEFAULT` | 未赋值时使用默认值 | `DEFAULT 0`、`DEFAULT CURRENT_TIMESTAMP` |
| `CHECK` | 检查值是否满足条件 | `CHECK (amount >= 0)` |

### 7、概念关系小结

```text
数据库 (school_db)
  └── 表 (students / courses / enrollments)
        ├── 列 (id, name, age …)  ← 类型 + 约束
        ├── 行 (一条记录)
        ├── 主键 (唯一标识每一行)
        ├── 外键 (关联其他表)
        └── 索引 (加速查询)
```

---

## 示例数据库

后续案例统一使用以下三张表，便于对照学习：

```sql
-- 学生表
CREATE TABLE students (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(50)  NOT NULL,
  age        INT,
  city       VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 课程表
CREATE TABLE courses (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0
);

-- 选课表（学生与课程的多对多关系）
CREATE TABLE enrollments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  score      DECIMAL(5, 2),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id)  REFERENCES courses(id)
);
```

示例数据：

```sql
INSERT INTO students (name, age, city) VALUES
  ('张三', 20, '北京'),
  ('李四', 22, '上海'),
  ('王五', 19, '广州'),
  ('赵六', 21, '北京');

INSERT INTO courses (title, price) VALUES
  ('SQL 入门', 99.00),
  ('Python 基础', 129.00),
  ('数据结构', 159.00);

INSERT INTO enrollments (student_id, course_id, score) VALUES
  (1, 1, 88.5),
  (1, 2, 92.0),
  (2, 1, 76.0),
  (3, 3, 85.5),
  (4, 2, NULL);  -- 尚未出成绩
```

---

## SQL语法

### 1、基本语法规则

- SQL 语句以分号（`;`）结尾
- SQL 关键字不区分大小写，但建议使用大写
- 字符串值用单引号包围（`'张三'`）
- 注释：单行用 `--`，多行用 `/* */`
- 列名、表名若与关键字冲突，可用反引号包裹（MySQL：`` `order` ``）

```sql
-- 单行注释示例
SELECT name FROM students;  /* 查询所有学生姓名 */

/*
  多行注释
  用于说明复杂逻辑
*/
```

### SQL常用关键词及作用

**查询相关：**

- `SELECT` - 选择要查询的列
- `FROM` - 指定查询的表
- `WHERE` - 设置查询条件
- `ORDER BY` - 结果排序
- `GROUP BY` - 数据分组
- `HAVING` - 分组后的条件筛选
- `LIMIT` - 限制返回记录数
- `DISTINCT` - 去重

**操作相关：**

- `INSERT` - 插入新数据
- `UPDATE` - 更新现有数据
- `DELETE` - 删除数据
- `SET` - 在 UPDATE 中指定新值

**表结构相关：**

- `CREATE` - 创建表、索引等
- `ALTER` - 修改表结构
- `DROP` - 删除表、索引等
- `TABLE` - 指定表名

**连接相关：**

- `JOIN` - 表连接
- `INNER JOIN` - 内连接（两表均匹配才返回）
- `LEFT JOIN` - 左外连接（保留左表全部记录）
- `RIGHT JOIN` - 右外连接（保留右表全部记录）
- `ON` - 连接条件

**条件操作符：**

- `AND` / `OR` / `NOT` - 逻辑运算
- `IN` - 值在列表中
- `LIKE` - 模糊匹配（`%` 任意字符，`_` 单个字符）
- `BETWEEN` - 范围查询（含边界）
- `IS NULL` / `IS NOT NULL` - 空值判断

**聚合函数：**

- `COUNT()` - 计数
- `SUM()` - 求和
- `AVG()` - 平均值
- `MAX()` / `MIN()` - 最大/最小值

**约束关键词：**

- `PRIMARY KEY` - 主键（唯一且非空）
- `FOREIGN KEY` - 外键（关联其他表）
- `NOT NULL` - 非空
- `UNIQUE` - 唯一
- `DEFAULT` - 默认值
- `CHECK` - 检查约束

---

## 数据查询语言（DQL）

### 1、基础查询 SELECT

```sql
-- 查询所有列
SELECT * FROM students;

-- 查询指定列，并给列起别名
SELECT name AS 姓名, age AS 年龄, city AS 城市
FROM students;

-- 去重：查询有哪些城市
SELECT DISTINCT city FROM students;
```

### 2、条件筛选 WHERE

```sql
-- 等于、比较
SELECT * FROM students WHERE age >= 20;

-- 多条件组合
SELECT * FROM students
WHERE city = '北京' AND age >= 20;

-- IN：城市在北京或上海
SELECT * FROM students
WHERE city IN ('北京', '上海');

-- LIKE 模糊匹配：姓名以"张"开头
SELECT * FROM students WHERE name LIKE '张%';

-- 范围查询
SELECT * FROM students WHERE age BETWEEN 19 AND 21;

-- 空值判断：尚未出成绩的选课记录
SELECT * FROM enrollments WHERE score IS NULL;
```

> **注意**：`= NULL` 写法是错误的，判断空值必须使用 `IS NULL` 或 `IS NOT NULL`。

### 3、排序 ORDER BY

```sql
-- 按年龄升序（默认 ASC）
SELECT name, age FROM students ORDER BY age;

-- 先按城市升序，再按年龄降序
SELECT name, city, age
FROM students
ORDER BY city ASC, age DESC;
```

### 4、分页 LIMIT

```sql
-- 取前 2 条（MySQL / PostgreSQL 写法）
SELECT * FROM students ORDER BY id LIMIT 2;

-- 跳过第 1 条，取 2 条（分页：第 2 页，每页 2 条）
SELECT * FROM students ORDER BY id LIMIT 2 OFFSET 2;
-- 等价写法：LIMIT 2, 2（MySQL）
```

### 5、聚合与分组 GROUP BY / HAVING

```sql
-- 统计每个城市的学生人数
SELECT city, COUNT(*) AS 人数
FROM students
GROUP BY city;

-- 统计每门课的平均分
SELECT c.title, AVG(e.score) AS 平均分
FROM enrollments e
JOIN courses c ON e.course_id = c.id
GROUP BY c.id, c.title;

-- HAVING：筛选分组结果（平均分大于 80 的课程）
SELECT c.title, AVG(e.score) AS 平均分
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.score IS NOT NULL
GROUP BY c.id, c.title
HAVING AVG(e.score) > 80;
```

> **WHERE 与 HAVING 的区别**：
>
> - `WHERE` 在分组**前**过滤行
> - `HAVING` 在分组**后**过滤组

### 6、表连接 JOIN

```sql
-- INNER JOIN：只返回两表都匹配的记录
SELECT s.name, c.title, e.score
FROM enrollments e
INNER JOIN students s ON e.student_id = s.id
INNER JOIN courses c  ON e.course_id  = c.id;

-- LEFT JOIN：保留左表全部学生，无选课记录时 score 为 NULL
SELECT s.name, c.title, e.score
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses c     ON e.course_id = c.id;

-- 查询没有选课的学生
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
WHERE e.id IS NULL;
```

连接类型对比：

| 类型 | 说明 | 典型场景 |
| --- | --- | --- |
| `INNER JOIN` | 两表均匹配才返回 | 查已选课学生的成绩 |
| `LEFT JOIN` | 保留左表全部 | 查所有学生（含未选课） |
| `RIGHT JOIN` | 保留右表全部 | 查所有课程（含无人选） |

### 7、子查询

```sql
-- 标量子查询：查年龄大于平均年龄的学生
SELECT name, age FROM students
WHERE age > (SELECT AVG(age) FROM students);

-- IN 子查询：选了"SQL 入门"的学生
SELECT name FROM students
WHERE id IN (
  SELECT student_id FROM enrollments
  WHERE course_id = (SELECT id FROM courses WHERE title = 'SQL 入门')
);

-- EXISTS：存在选课记录的学生
SELECT name FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e WHERE e.student_id = s.id
);
```

---

## 数据操作语言（DML）

### 1、插入 INSERT

```sql
-- 插入单行
INSERT INTO students (name, age, city)
VALUES ('孙七', 23, '深圳');

-- 插入多行
INSERT INTO students (name, age, city) VALUES
  ('周八', 24, '杭州'),
  ('吴九', 25, '成都');

-- 从查询结果插入
INSERT INTO students (name, age, city)
SELECT name, age, city FROM backup_students;
```

### 2、更新 UPDATE

```sql
-- 更新单个字段
UPDATE students SET age = 21 WHERE name = '张三';

-- 更新多个字段
UPDATE students
SET age = 22, city = '天津'
WHERE id = 2;

-- 结合子查询更新
UPDATE enrollments
SET score = 90
WHERE student_id = (SELECT id FROM students WHERE name = '李四')
  AND course_id  = (SELECT id FROM courses WHERE title = 'SQL 入门');
```

> **安全提示**：UPDATE / DELETE 务必带 `WHERE`，否则会影响全表数据。

### 3、删除 DELETE

```sql
-- 删除指定记录
DELETE FROM students WHERE id = 5;

-- 清空表数据（保留表结构，可回滚）
DELETE FROM enrollments;

-- 快速清空（不可回滚，重置自增 ID，MySQL）
-- TRUNCATE TABLE enrollments;
```

---

## 数据定义语言（DDL）

### 1、创建与修改表

```sql
-- 创建表（带约束）
CREATE TABLE orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, created_at)  -- 联合唯一约束
);

-- 添加列
ALTER TABLE students ADD COLUMN email VARCHAR(100);

-- 修改列类型
ALTER TABLE students MODIFY COLUMN email VARCHAR(200);

-- 删除列
ALTER TABLE students DROP COLUMN email;

-- 添加索引
CREATE INDEX idx_students_city ON students(city);

-- 删除表
DROP TABLE IF EXISTS orders;
```

### 2、常用数据类型

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `INT` / `BIGINT` | 整数 | 年龄、ID |
| `DECIMAL(M,D)` | 精确小数 | 金额、分数 |
| `VARCHAR(N)` | 变长字符串 | 姓名、标题 |
| `TEXT` | 长文本 | 文章正文 |
| `DATE` / `DATETIME` | 日期/时间 | 创建时间 |
| `BOOLEAN` | 布尔值 | 是否启用 |

---

## 数据控制语言（DCL）

```sql
-- 创建用户并授权（MySQL 示例）
CREATE USER 'readonly'@'localhost' IDENTIFIED BY 'password123';

-- 授予只读权限
GRANT SELECT ON school_db.* TO 'readonly'@'localhost';

-- 撤销权限
REVOKE INSERT ON school_db.* FROM 'readonly'@'localhost';

-- 使权限生效
FLUSH PRIVILEGES;
```

---

## 事务（Transaction）

事务保证一组 SQL 操作的原子性，典型场景：转账、下单扣库存。

```sql
START TRANSACTION;  -- 或 BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 确认无误后提交
COMMIT;

-- 出错时回滚
-- ROLLBACK;
```

---

## 索引与性能

索引类似书的目录，加快查询速度，但会增加写入开销。

```sql
-- 查看执行计划（MySQL）
EXPLAIN SELECT * FROM students WHERE city = '北京';

-- 单列索引
CREATE INDEX idx_city ON students(city);

-- 联合索引（遵循最左前缀原则）
CREATE INDEX idx_city_age ON students(city, age);

-- 删除索引
DROP INDEX idx_city ON students;
```

**何时建索引：**

- 经常出现在 `WHERE`、`JOIN`、`ORDER BY` 的列
- 高基数列（取值种类多，如 user_id）效果更好

**何时慎用：**

- 小表、频繁更新的列
- 低基数列（如性别字段）

---

## 常见错误与最佳实践

| 问题 | 错误写法 | 正确写法 |
| --- | --- | --- |
| 空值比较 | `WHERE score = NULL` | `WHERE score IS NULL` |
| 更新/删除无条件 | `UPDATE students SET age = 18` | 始终加 `WHERE id = ?` |
| `SELECT *` 滥用 | 生产环境查全部列 | 只查需要的列，减少 IO |
| 隐式类型转换 | `WHERE phone = 13800138000` | 字符串列用引号 `'13800138000'` |
| SQL 注入风险 | 拼接用户输入 | 使用参数化查询 / 预编译语句 |

**参数化查询示例（Node.js）：**

```js
// 安全：使用占位符
const [rows] = await db.query(
  'SELECT * FROM students WHERE name = ?',
  [userName]
);

// 危险：直接拼接字符串
// db.query(`SELECT * FROM students WHERE name = '${userName}'`);
```

---

## 学习路线建议

1. **基础**：掌握 `SELECT` / `WHERE` / `ORDER BY` / `LIMIT`
2. **进阶**：理解 `JOIN`、聚合函数、`GROUP BY` / `HAVING`
3. **实战**：练习 `INSERT` / `UPDATE` / `DELETE` 与事务
4. **优化**：学习索引、`EXPLAIN` 执行计划分析
5. **扩展**：窗口函数、存储过程、视图（视数据库版本而定）

推荐练习方式：在本地安装 MySQL 或使用 [SQLite Online](https://sqliteonline.com/) 等在线工具，亲手执行本文所有示例并尝试修改条件观察结果变化。
