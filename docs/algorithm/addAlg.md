## 求和算法

### 1、两数之和

&emsp;&emsp;**题目：** 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

&emsp;&emsp;**解题核心：** 空间换时间的哈希表策略。

&emsp;&emsp;**解题思路：** 在暴力求和的基础上进行优化，引入哈希表存储数据，通过一个差值查找对应的补值。
```ts
 const addTwoNums = (nums:number[], target:number): number[] {
      const map = new Map<number, number>();
  // 暴力破解
  // for (let i = 0; i <= nums.length; i++) { // n次
  //   for (let j = i + 1; j <= nums.length; j++) { // n次
  //     if (nums[i] + nums[j] === target) { // 1次
  //       return [i, j];
  //     }
  //   }
  // }
  // 时间复杂度总计：n × n × 1 = O(n²)
  for (let i = 0; i < nums.length; i++) {
    // 获取目标函数的补数
    const complement = target - nums[i];

    // 检查哈希表中是否存在目标值的补数
    if (map.has(complement)) {
      //map.get(complement)!表示补数在原数组中的索引，i表示当前数字在原数组中的索引
      //! 是TypeScript的非空断言操作符，表示确信这个值不是undefined
      return [map.get(complement)!, i];
    }

    // 将当前数字和索引存入哈希表，当哈希表为空时将当前值进行存储便于第二次进行对比
    map.set(nums[i], i);
  }
  // 时间复杂度总计：n × (1 + 1) = O(n)
  // 如果没有找到解，返回空数组（根据题目假设，这种情况不会发生）
  return [];
}

// 示例用法和测试
console.log("两数之和示例：");
console.log(twoSum([2, 7, 11, 15], 9)); // 输出: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // 输出: [1, 2]
console.log(twoSum([3, 3], 6)); // 输出: [0, 1]
```
### 2、两数之和的全部组合（进阶）
&emsp;&emsp;**题目：** 在两数求和的基础找出全部组合数字并输出。

&emsp;&emsp;**解题核心：** 空间换时间的哈希表策略，多维空间数据转换。

&emsp;&emsp;**解题思路：** 首先返回结果类型修改为二维数组，同样使用哈希表存储查询的结果，修改之处主要为将所有匹配的索引存入到二维数组中再统一返回。
```ts
function twoSumAll(nums: number[], target: number): number[][] {
  // 差异点一：二维数组结果创建
  const result: number[][] = [];
  const map = new Map<number, number[]>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // 检查哈希表中是否存在补数，如果存在则记录所有匹配的索引对
    if (map.has(complement)) {
      // 差异点二：如果存在，遍历所有该补数的索引位置
      // map.get(complement)! 从哈希表中获取补数对应的索引*数组*，！是TS的非空断言
      for (const index of map.get(complement)!) {
        result.push([index, i]);
      }
    }

    // 差异点三：首次遍历哈希表中没有对应补数，存储多个相同值的索引
    if (!map.has(nums[i])) {
      map.set(nums[i], []);
    }
    map.get(nums[i])!.push(i);
  }

  return result;
}
console.log(twoSumAll([2, 7, 11, 15, 1, 8, 3, 6], 9)); // 输出: [[0, 1]， [4, 5]，[6, 7]]
console.log(twoSumAll([2, 7, 2, 7], 9)); //输出：[[[0, 1]], [2, 3]] 
// 以 twoSumAll([2, 7, 2, 7], 9) 为例：
// i=0时： nums[0] = 2
// 前面代码已创建：map.set(2, [])
// 执行：map.get(2)!.push(0)
// 结果：map 变为 {2: [0]}

// i=1时： nums[1] = 7
// 前面代码已创建：map.set(7, [])
// 执行：map.get(7)!.push(1)
// 结果：map 变为 {2: [0], 7: [1]}

// i=2时： nums[2] = 2（重复值）
// 前面判断 map.has(2) 为 true，不会重新创建空数组
// 执行：map.get(2)!.push(2)
// 结果：map 变为 {2: [0, 2], 7: [1]} ← 关键点

// i=3时： nums[3] = 7（重复值）
// 执行：map.get(7)!.push(3)
// 结果：map 变为 {2: [0, 2], 7: [1, 3]}
```

### 3、三数之和（进阶）
&emsp;&emsp;**题目：** 在两数求和的基础上进行扩展，需寻找出三个数之和为目标数并输出。

&emsp;&emsp;**解题核心：** 降维策略，三数之和 → 两数之和。

&emsp;&emsp;**解题思路：** 将复杂的三数之和问题转化为已知的两数之和问题，通过"固定一个数，求剩余两数"的方式来解决。
```ts
// 三数之和扩展
function threeSum(nums: number[], target: number): number[] {
  // 固定一个数，剩下的变成两数之和问题
  for (let i = 0; i < nums.length; i++) {
    // 固定一个newTarget作为两数之和的目标数
    const newTarget = target - nums[i];
    // 将三元问题转化为二元问题，依次尝试每个数作为第一个数
    // 关键点：nums.slice(i + 1) 创建子数组，在子数组中进行查找，避免重复使用同一个元素
    const twoSumResult = twoSum(nums.slice(i + 1), newTarget);
    // 索引调整与结果返回
    if (twoSumResult.length > 0) {
      return [i, twoSumResult[0] + i + 1, twoSumResult[1] + i + 1];
    }
  }

  return [];
}
console.log(threeSum([2, 7, 11, 15, 1, 8, 3, 6], 9)); // 输出: [0, 4, 7]
```