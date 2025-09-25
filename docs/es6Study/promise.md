Promise的含义
Promise是一种异步的编程方式，相比一传统的回调函数和事件，Promise更加合理方便。Promise类似与一个对象容器，内部保存着可以获取异步操作的消息。Promise一共有三种状态分别是pending、fulfilled、rejected

Promise的缺点：一旦新建就会立刻执行无法取消；若不设置回调函数就无法将内部抛出的异常反映到外部；处于pending状态时无法得知进展的阶段；对于不断地反复发生的事件使用Stream模式会比Promise更好；
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved');
});

console.log('Hi!');
// Promise
// Hi!
// resolved
```
首先输出Promise，然后.then方法指定的回调函数需要当前所有同步任务执行完后才会执行，所以最后输出resolved。

Promise的使用
Promise是一个构造函数所以需要new关键字来创建实例，默认接受一个函数作为参数而两个传参则是resolve和reject。resolve是将Promise对象状态变为成功，reject的所用是将其变为失败。实例声明后则可以使用.then()方法指定状态的回调函数。
```js
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}
timeout(100).then((value) => {
  console.log(value);
});
```

resolve函数和reject函数在调用时都可以传参，reject通常传递Error对象的实例，resolve除了传递正常值以外还可以传递另一个Promise，而第一个Promise的状态会决定第二个Promise的状态；
```js
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```
注意由于resolve和reject的后续操作应该放在.then方法中，而不是直接写在这两个回调函数后面，所以在Promise中最好在回调函数前加上return防止意外；