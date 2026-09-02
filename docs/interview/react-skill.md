# React面试题集

‌&emsp;&emsp;React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发并开源。它采用组件化开发模式，通过虚拟 DOM 和高效的 Diff 算法实现高性能的页面渲染。

---

## 基础概念篇

## 1、React是什么？有什么特点？

&emsp;&emsp;**定义**
&emsp;&emsp;React 是一个用于构建用户界面的 JavaScript 库，主要用于构建单页面应用（SPA）。它专注于视图层的开发，通过组件化的方式构建复杂的 UI 界面。

&emsp;&emsp;**核心特点**

&emsp;&emsp;**（1）组件化**
```jsx
// 函数组件
function Welcome(props) {
    return <h1>你好，{props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
    render() {
        return <h1>你好，{this.props.name}</h1>;
    }
}

// 使用组件
const element = <Welcome name="张三" />;
```

&emsp;&emsp;**（2）虚拟DOM**
&emsp;&emsp;React 在内存中维护一个虚拟 DOM 树，当状态变化时，先更新虚拟 DOM，再通过 Diff 算法计算出最小更新方案，最后批量更新真实 DOM。这种机制大大减少了直接操作 DOM 带来的性能开销。

&emsp;&emsp;**（3）单向数据流**
&emsp;&emsp;React 遵循单向数据流原则，数据从父组件流向子组件，通过 props 传递，子组件不能直接修改父组件传来的 props。

```jsx
// 单向数据流示例
function Parent() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>计数器：{count}</p>
            <Child count={count} onIncrement={() => setCount(count + 1)} />
        </div>
    );
}

function Child({ count, onIncrement }) {
    return (
        <div>
            <p>子组件接收到的值：{count}</p>
            <button onClick={onIncrement}>增加</button>
        </div>
    );
}
```

&emsp;&emsp;**（4）JSX语法**
&emsp;&emsp;JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中编写类似 HTML 的代码。

```jsx
// JSX 示例
const element = (
    <div className="container">
        <h1>欢迎来到React世界</h1>
        <p>学习 React 真有趣！</p>
    </div>
);

// 表达式嵌入
const name = '小明';
const greeting = <p>你好，{name}！今天是{new Date().toLocaleDateString()}</p>;

// 条件渲染
const isLoggedIn = true;
const welcome = (
    <div>
        {isLoggedIn ? <h1>欢迎回来</h1> : <h1>请登录</h1>}
    </div>
);
```

---

## 2、React元素与JSX

&emsp;&emsp;**（1）JSX语法规则**
```jsx
// 1. 标签必须闭合
const element1 = <input type="text" />;
const element2 = <div>内容</div>;

// 2. className 替代 class
const element = <div className="box">盒子</div>;

// 3. style 需要是对象
const styleObj = {
    color: 'red',
    fontSize: '16px'
};
const element = <div style={styleObj}>样式</div>;

// 4. 组件首字母大写
function MyComponent() {
    return <div>我的组件</div>;
}
const element = <MyComponent />;

// 5. 注释需要用花括号包裹
const element = (
    <div>
        {/* 这是一个注释 */}
        <h1>标题</h1>
    </div>
);
```

&emsp;&emsp;**（2）React.createElement**
&emsp;&emsp;JSX 会被 Babel 编译成 React.createElement 调用：

```jsx
// JSX写法
const element = <h1 className="greeting">Hello, world!</h1>;

// 编译后
const element = React.createElement(
    'h1',
    { className: 'greeting' },
    'Hello, world!'
);

// createElement返回的对象结构
{
    type: 'h1',
    props: {
        className: 'greeting',
        children: 'Hello, world!'
    }
}
```

---

## 3、State与Props的区别

&emsp;&emsp;**（1）Props（属性）**
&emsp;&emsp;Props 是组件对外的接口，用于父组件向子组件传递数据。

```jsx
// Props只读，不能在子组件中修改
function Student(props) {
    return (
        <div>
            <p>姓名：{props.name}</p>
            <p>年龄：{props.age}</p>
            <p>学校：{props.school}</p>
        </div>
    );
}

// 使用时传入props
<Student name="张三" age={20} school="清华大学" />
```

&emsp;&emsp;**（2）State（状态）**
&emsp;&emsp;State 是组件内部的状态，用于组件内部数据的管理和更新。

```jsx
// State可以在组件内部修改，修改后会触发重新渲染
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        return (
            <div>
                <p>计数：{this.state.count}</p>
                <button onClick={this.increment}>增加</button>
            </div>
        );
    }
}
```

&emsp;&emsp;**（3）Props与State对比**
```
+----------+----------------------------------+------------------------------+
|  特性    |            Props                |          State              |
+----------+----------------------------------+------------------------------+
|  用途    |  父组件向子组件传递数据          |  组件内部管理数据           |
|  可变性  |  只读，不能在子组件中修改         |  可通过setState修改         |
|  触发    |  父组件重新渲染时变化            |  setState调用时变化         |
|  初始化  |  组件调用时传入                  |  constructor中初始化        |
+----------+----------------------------------+------------------------------+
```

---

## 4、函数组件与类组件的区别

&emsp;&emsp;**（1）基本写法对比**
```jsx
// 函数组件（无状态组件）
function Button(props) {
    return <button>{props.text}</button>;
}

// 类组件（有状态组件）
class Button extends React.Component {
    render() {
        return <button>{this.props.text}</button>;
    }
}
```

&emsp;&emsp;**（2）核心区别**

| 特性 | 函数组件 | 类组件 |
|------|----------|--------|
| 是否有this | 没有 | 有（指向组件实例） |
| 是否有state | Hook之前没有，现在可以通过useState | 有 |
| 是否有生命周期 | Hook之前没有，现在可以通过useEffect | 有 |
| 是否有生命周期方法 | 无 | 有（componentDidMount等） |
| 性能 | 相对更轻量 | 需要实例化，稍微重一些 |

&emsp;&emsp;**（3）生命周期差异**
```jsx
// 函数组件使用Hooks
function UserComponent() {
    const [user, setUser] = useState(null);

    // 相当于 componentDidMount + componentDidUpdate
    useEffect(() => {
        fetchUser().then(setUser);
    }, []); // 空数组表示只执行一次

    return <div>{user?.name}</div>;
}

// 类组件使用生命周期方法
class UserComponent extends React.Component {
    state = { user: null };

    componentDidMount() {
        fetchUser().then(user => this.setState({ user }));
    }

    render() {
        return <div>{this.state.user?.name}</div>;
    }
}
```

---

## 5、事件处理

&emsp;&emsp;**（1）基本事件绑定**
```jsx
// 函数组件
function EventButton() {
    function handleClick() {
        console.log('按钮被点击');
    }

    return <button onClick={handleClick}>点击我</button>;
}

// 类组件
class EventButton extends React.Component {
    handleClick() {
        console.log('按钮被点击');
    }

    render() {
        return <button onClick={this.handleClick.bind(this)}>点击我</button>;
    }
}
```

&emsp;&emsp;**（2）事件对象与参数传递**
```jsx
function EventDemo() {
    // 方式1：箭头函数包裹
    const handleClick = (event) => {
        console.log('事件对象:', event);
        console.log('目标元素:', event.target);
    };

    // 方式2：闭包传递参数
    const handleDelete = (id) => {
        console.log('删除ID:', id);
    };

    return (
        <div>
            <button onClick={handleClick}>查看事件对象</button>
            <button onClick={() => handleDelete(1)}>删除</button>
            <button onClick={(e) => handleDelete(2, e)}>删除2</button>
        </div>
    );
}
```

&emsp;&emsp;**（3）常见事件类型**
```jsx
function EventsDemo() {
    const handleChange = (e) => {
        console.log('输入值:', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止默认行为
        console.log('表单提交');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('按下了回车键');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button type="submit">提交</button>
        </form>
    );
}
```

---

## 6、条件渲染

&emsp;&emsp;**（1）if语句方式**
```jsx
function UserGreeting(props) {
    return <h1>欢迎回来！</h1>;
}

function GuestGreeting(props) {
    return <h1>请先登录。</h1>;
}

function Greeting(props) {
    if (props.isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
}
```

&emsp;&emsp;**（2）三元运算符**
```jsx
function LoginControl() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div>
            {isLoggedIn ? (
                <button onClick={() => setIsLoggedIn(false)}>登出</button>
            ) : (
                <button onClick={() => setIsLoggedIn(true)}>登录</button>
            )}
        </div>
    );
}
```

&emsp;&emsp;**（3）逻辑与运算符 &&**
```jsx
function Mailbox(props) {
    const unreadMessages = props.messages;

    return (
        <div>
            <h1>收件箱</h1>
            {unreadMessages.length > 0 && (
                <h2>您有 {unreadMessages.length} 条未读消息。</h2>
            )}
        </div>
    );
}
```

&emsp;&emsp;**（4）阻止组件渲染**
```jsx
function WarningBanner(props) {
    // 如果warn为false，组件不渲染任何内容
    if (!props.warn) {
        return null;
    }

    return (
        <div className="warning">
            警告！
        </div>
    );
}
```

---

## 7、列表渲染与Key

&emsp;&emsp;**（1）基本列表渲染**
```jsx
function NumberList(props) {
    const numbers = props.numbers;

    // 必须为每个列表元素添加key
    const listItems = numbers.map((number) => (
        <li key={number.toString()}>{number}</li>
    ));

    return <ul>{listItems}</ul>;
}

// 或者直接在JSX中渲染
function NumberList(props) {
    const numbers = props.numbers;

    return (
        <ul>
            {numbers.map((number) => (
                <li key={number.toString()}>{number}</li>
            ))}
        </ul>
    );
}
```

&emsp;&emsp;**（2）Key的作用与最佳实践**
```jsx
// 好的key使用：使用唯一ID
const todoItems = todos.map((todo) => (
    <li key={todo.id}>
        {todo.text}
    </li>
));

// 避免使用索引作为key（当列表顺序可能变化时）
// 不好：如果列表顺序改变，索引会变化
const todoItems = todos.map((todo, index) => (
    <li key={index}>{todo.text}</li>
));

// 好的：使用稳定的唯一标识
const todoItems = todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
));
```

&emsp;&emsp;**（3）渲染复杂列表**
```jsx
function ProductList(props) {
    const { products } = props;

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>价格：¥{product.price}</p>
                    <button>加入购物车</button>
                </div>
            ))}
        </div>
    );
}
```

---

## 8、组件通讯

&emsp;&emsp;**（1）父子组件通讯**
```jsx
// 父组件 -> 子组件：通过props
function Parent() {
    const [message, setMessage] = useState('来自父组件的消息');

    return <Child message={message} onMessageChange={setMessage} />;
}

// 子组件 -> 父组件：通过回调函数props
function Child({ message, onMessageChange }) {
    return (
        <div>
            <p>收到：{message}</p>
            <button onClick={() => onMessageChange('来自子组件的消息')}>
                回复
            </button>
        </div>
    );
}
```

&emsp;&emsp;**（2）跨级组件通讯：Context**
```jsx
// 创建Context
const ThemeContext = React.createContext('light');

// Provider（提供者）
function App() {
    const [theme, setTheme] = useState('dark');

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Toolbar />
        </ThemeContext.Provider>
    );
}

// 消费Context（方式1：Consumer）
function ThemedButton() {
    return (
        <ThemeContext.Consumer>
            {(value) => (
                <button style={{ background: value.theme === 'dark' ? '#333' : '#fff' }}>
                    按钮
                </button>
            )}
        </ThemeContext.Consumer>
    );
}

// 消费Context（方式2：useContext Hook）
function ThemedButton() {
    const { theme } = useContext(ThemeContext);

    return (
        <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
            按钮
        </button>
    );
}
```

&emsp;&emsp;**（3）兄弟组件通讯**
```jsx
// 方案1：提升状态到父组件
function Parent() {
    const [sharedData, setSharedData] = useState('初始数据');

    return (
        <>
            <SiblingA data={sharedData} />
            <SiblingB onDataChange={setSharedData} />
        </>
    );
}

// 方案2：使用事件总线/状态管理库
// 使用EventEmitter或第三方库如pubsub-js
```

---

## 中级进阶篇

## 9、Hooks完全指南

&emsp;&emsp;**Hooks是React 16.8引入的新特性，允许在函数组件中使用state和其他React特性。**

&emsp;&emsp;**（1）useState - 状态管理**
```jsx
// 基本用法
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>计数：{count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <button onClick={() => setCount(count - 1)}>减少</button>
            <button onClick={() => setCount(0)}>重置</button>
        </div>
    );
}

// 函数式更新（当新状态依赖旧状态时）
function Counter() {
    const [count, setCount] = useState(0);

    // 推荐：使用函数式更新，避免依赖外部状态
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };

    return <button onClick={increment}>计数：{count}</button>;
}

// 多个状态
function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);

    return (
        <form>
            <input value={name} onChange={e => setName(e.target.value)} />
            <input value={email} onChange={e => setEmail(e.target.value)} />
            <input value={age} onChange={e => setAge(Number(e.target.value))} />
        </form>
    );
}
```

&emsp;&emsp;**（2）useEffect - 副作用处理**
```jsx
// 基本用法：组件渲染后执行
function UserStatus() {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        // 组件挂载后执行
        const timer = setInterval(() => {
            setIsOnline(Math.random() > 0.5);
        }, 1000);

        // 返回清理函数：组件卸载时执行
        return () => {
            clearInterval(timer);
        };
    }, []); // 空依赖数组：只在挂载时执行一次

    return <div>{isOnline ? '在线' : '离线'}</div>;
}

// 依赖项用法
function User({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]); // userId变化时重新执行

    return <div>{user?.name}</div>;
}

// 条件执行effect
function SearchResults({ query }) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            searchAPI(query).then(setResults);
        }
    }, [query]);

    return <ul>{results.map(r => <li key={r.id}>{r.text}</li>)}</ul>;
}
```

&emsp;&emsp;**（3）useContext - 上下文访问**
```jsx
// 定义主题Context
const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {}
});

// 在组件中使用
function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
            <button onClick={toggleTheme}>切换主题</button>
        </header>
    );
}
```

---

## 10、useRef详细用法

&emsp;&emsp;**（1）访问DOM元素**
```jsx
function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        // 聚焦输入框
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>聚焦</button>
        </div>
    );
}

// 获取DOM属性
function ImageLoader() {
    const imgRef = useRef(null);

    useEffect(() => {
        console.log('图片尺寸:', imgRef.current.width, imgRef.current.height);
    }, []);

    return <img ref={imgRef} src="/image.jpg" alt="测试" />;
}
```

&emsp;&emsp;**（2）保存可变值（不触发重新渲染）**
```jsx
function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        // 保存定时器ID，不触发重新渲染
        intervalRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return <div>计数：{count}</div>;
}
```

&emsp;&emsp;**（3）previous value实现**
```jsx
function Counter() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();

    useEffect(() => {
        // 保存上一次的count值
        prevCountRef.current = count;
    });

    return (
        <div>
            <p>当前：{count}，上次：{prevCountRef.current}</p>
            <button onClick={() => setCount(c => c + 1)}>增加</button>
        </div>
    );
}
```

---

## 11、useMemo与useCallback

&emsp;&emsp;**（1）useMemo - 缓存计算结果**
```jsx
// 避免不必要的重复计算
function ExpensiveList({ items, filter }) {
    // 只有items或filter变化时才重新计算
    const filteredItems = useMemo(() => {
        console.log('执行过滤计算...');
        return items.filter(item => item.name.includes(filter));
    }, [items, filter]);

    return <ul>{filteredItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}

// 性能优化示例
function DataTable({ data, sortKey }) {
    // 缓存排序后的数据
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            return a[sortKey] > b[sortKey] ? 1 : -1;
        });
    }, [data, sortKey]);

    return <Table data={sortedData} />;
}
```

&emsp;&emsp;**（2）useCallback - 缓存回调函数**
```jsx
// 避免子组件不必要的重新渲染
function Parent() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('张三');

    // 每次渲染都创建新函数
    const handleClick = () => {
        console.log('点击');
    };

    // 只有count变化时才创建新函数
    const handleIncrement = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    // 使用函数式更新，无需依赖count
    const handleIncrementFixed = useCallback(() => {
        setCount(c => c + 1);
    }, []); // 空依赖，函数引用保持稳定

    return (
        <div>
            <p>{count}</p>
            <Child onClick={handleClick} />
            <Counter onIncrement={handleIncrement} />
        </div>
    );
}
```

---

## 12、useReducer - 复杂状态管理

&emsp;&emsp;**（1）基本用法**
```jsx
// 定义reducer函数
function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        case 'RESET':
            return { count: 0 };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>计数：{state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
        </div>
    );
}
```

&emsp;&emsp;**（2）复杂状态示例：TODO列表**
```jsx
const initialState = { todos: [] };

function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                todos: [
                    ...state.todos,
                    { id: Date.now(), text: action.text, completed: false }
                ]
            };
        case 'TOGGLE_TODO':
            return {
                todos: state.todos.map(todo =>
                    todo.id === action.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case 'DELETE_TODO':
            return {
                todos: state.todos.filter(todo => todo.id !== action.id)
            };
        default:
            return state;
    }
}

function TodoApp() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [input, setInput] = useState('');

    const addTodo = () => {
        if (input.trim()) {
            dispatch({ type: 'ADD_TODO', text: input });
            setInput('');
        }
    };

    return (
        <div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={addTodo}>添加</button>
            <ul>
                {state.todos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}>
                            删除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

---

## 13、React生命周期

&emsp;&emsp;**类组件生命周期**

&emsp;&emsp;**（1）挂载阶段**
```
constructor() -> static getDerivedStateFromProps() -> render() -> componentDidMount()
```
```jsx
class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: null };
        console.log('1. 构造函数');
    }

    static getDerivedStateFromProps(props, state) {
        // 从props派生state时使用
        return null;
    }

    componentDidMount() {
        console.log('3. 组件挂载完成');
        // 适合：请求数据、添加订阅、操作DOM
        fetch('/api/user')
            .then(res => res.json())
            .then(user => this.setState({ user }));
    }

    render() {
        console.log('2. 渲染');
        return <div>用户信息：{this.state.user?.name}</div>;
    }
}
```

&emsp;&emsp;**（2）更新阶段**
```
props变化 -> static getDerivedStateFromProps() -> shouldComponentUpdate() -> render() -> getSnapshotBeforeUpdate() -> componentDidUpdate()
state变化 -> shouldComponentUpdate() -> render() -> getSnapshotBeforeUpdate() -> componentDidUpdate()
```
```jsx
class Counter extends React.Component {
    state = { count: 0 };

    shouldComponentUpdate(nextProps, nextState) {
        // 返回false可以阻止更新，用于性能优化
        return nextState.count !== this.state.count;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        // 返回值会传递给componentDidUpdate
        return { scrollTop: this.listRef?.scrollTop };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 可以访问更新前的DOM状态
        if (snapshot) {
            this.listRef.scrollTop = snapshot.scrollTop;
        }
    }

    render() {
        return <div>计数：{this.state.count}</div>;
    }
}
```

&emsp;&emsp;**（3）卸载阶段**
```
componentWillUnmount()
```
```jsx
class Timer extends React.Component {
    componentDidMount() {
        this.timerID = setInterval(() => {
            console.log('tick');
        }, 1000);
    }

    componentWillUnmount() {
        // 清理定时器、取消订阅等
        clearInterval(this.timerID);
    }

    render() {
        return <div>计时器组件</div>;
    }
}
```

---

## 14、React.Component常用方法

&emsp;&emsp;**（1）setState详解**
```jsx
class MyComponent extends React.Component {
    state = { count: 0 };

    // 方式1：对象形式（可能异步更新）
    handleClick1 = () => {
        this.setState({ count: this.state.count + 1 });
    };

    // 方式2：函数形式（推荐，确保基于最新状态）
    handleClick2 = () => {
        this.setState((state, props) => ({
            count: state.count + 1
        }));
    };

    // 方式3：回调函数（更新完成后执行）
    handleClick3 = () => {
        this.setState(
            { count: this.state.count + 1 },
            () => console.log('状态更新完成')
        );
    };
}
```

&emsp;&emsp;**（2）forceUpdate**
```jsx
class MyComponent extends React.Component {
    handleForceUpdate = () => {
        // 强制组件重新渲染，跳过shouldComponentUpdate
        this.forceUpdate();
    };
}
```

---

## 15、高阶组件（HOC）

&emsp;&emsp;**高阶组件是参数为组件，返回值为新组件的函数。**

&emsp;&emsp;**（1）基本结构**
```jsx
// 高阶组件函数
function withAuthentication(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        if (!isAuthenticated) {
            return <div>请先登录</div>;
        }

        return <WrappedComponent {...props} />;
    };
}

// 使用HOC
const AuthenticatedUserProfile = withAuthentication(UserProfile);

function App() {
    return <AuthenticatedUserProfile />;
}
```

&emsp;&emsp;**（2）HOC高级用法：属性代理**
```jsx
function withStyles(WrappedComponent) {
    return function StyledComponent(props) {
        const style = {
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '8px'
        };

        // 传递新的props
        const newProps = {
            ...props,
            customProp: '额外添加的属性'
        };

        return (
            <div style={style}>
                <WrappedComponent {...newProps} />
            </div>
        );
    };
}
```

&emsp;&emsp;**（3）HOC高级用法：继承反转**
```jsx
function withLoading(WrappedComponent) {
    return class WithLoading extends WrappedComponent {
        render() {
            if (this.props.isLoading) {
                return <div>加载中...</div>;
            }
            return super.render();
        }
    };
}
```

---

## 16、Render Props

&emsp;&emsp;**Render Props是一种在组件之间共享代码的技术，使用一个值为函数的prop。**

&emsp;&emsp;**（1）基本用法**
```jsx
class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };

    handleMouseMove = (e) => {
        this.setState({
            x: e.clientX,
            y: e.clientY
        });
    };

    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        );
    }
}

// 使用render prop
function App() {
    return (
        <MouseTracker
            render={({ x, y }) => (
                <h1>鼠标位置：({x}, {y})</h1>
            )}
        />
    );
}
```

&emsp;&emsp;**（2）children作为函数**
```jsx
// 将children改为函数形式
function MouseTracker({ children }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div onMouseMove={handleMouseMove}>
            {children(position)}
        </div>
    );
}

// 使用
<MouseTracker>
    {({ x, y }) => (
        <div>
            鼠标位置：{x}, {y}
        </div>
    )}
</MouseTracker>
```

---

## 17、组件优化PureComponent与React.memo

&emsp;&emsp;**（1）PureComponent**
```jsx
// 类组件使用PureComponent自动进行浅比较
class MyComponent extends React.PureComponent {
    render() {
        return <div>{this.props.name}</div>;
    }
}

// 注意：如果是引用类型，需要创建新对象
class Parent extends React.PureComponent {
    state = {
        items: [{ id: 1 }]
    };

    // 错误：直接修改会跳过更新
    handleAdd = () => {
        this.state.items.push({ id: 2 });
        this.forceUpdate(); // 需要强制更新
    };

    // 正确：创建新数组
    handleAdd = () => {
        this.setState({
            items: [...this.state.items, { id: 2 }]
        });
    };
}
```

&emsp;&emsp;**（2）React.memo**
```jsx
// 函数组件使用React.memo
const MyComponent = React.memo(function MyComponent(props) {
    return <div>{props.name}</div>;
});

// 自定义比较函数
const MyComponent = React.memo(
    function MyComponent(props) {
        return <div>{props.name}</div>;
    },
    (prevProps, nextProps) => {
        // 返回true表示不需要重新渲染
        return prevProps.name === nextProps.name;
    }
);
```

&emsp;&emsp;**（3）性能优化对比**
```
+------------------+------------------------+------------------------+
|    特性          |    类组件              |     函数组件           |
+------------------+------------------------+------------------------+
|  组件类型        |  Component             |  React.memo            |
|  浅比较          |  PureComponent自动     |  React.memo自动        |
|  自定义比较      |  shouldComponentUpdate |  React.memo第二个参数  |
|  深比较          |  需手动实现            |  需手动实现            |
+------------------+------------------------+------------------------+
```

---

## 18、React中的DOM操作

&emsp;&emsp;**（1）Refs创建与使用**
```jsx
class AutoFocusInput extends React.Component {
    constructor(props) {
        super(props);
        // 创建ref
        this.textInput = React.createRef();
    }

    componentDidMount() {
        // 访问DOM元素
        this.textInput.current.focus();
    }

    render() {
        return (
            <input
                ref={this.textInput}
                type="text"
            />
        );
    }
}
```

&emsp;&emsp;**（2）回调Refs**
```jsx
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = null;
        // 设置回调ref
        this.setTextInputRef = element => {
            this.textInput = element;
        };
    }

    componentDidMount() {
        // 组件挂载后自动聚焦
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    render() {
        return (
            <input
                ref={this.setTextInputRef}
                type="text"
            />
        );
    }
}
```

&emsp;&emsp;**（3）函数组件使用Refs**
```jsx
function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>聚焦</button>
        </div>
    );
}
```

---

## 19、React中的表单处理

&emsp;&emsp;**（1）受控组件**
```jsx
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('用户名:', username, '密码:', password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
            />
            <button type="submit">登录</button>
        </form>
    );
}
```

&emsp;&emsp;**（2）非受控组件**
```jsx
class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        alert(`选择了文件: ${this.fileInput.current.files[0].name}`);
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="file" ref={this.fileInput} />
                <button type="submit">提交</button>
            </form>
        );
    }
}
```

&emsp;&emsp;**（3）多个输入框的处理**
```jsx
function MultiInputForm() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form>
            <input
                name="username"
                value={form.username}
                onChange={handleChange}
            />
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
            />
        </form>
    );
}
```

---

## 高级应用篇

## 20、Redux状态管理

&emsp;&emsp;**（1）Redux核心概念**
```
+----------------+     +----------------+     +----------------+
|    State       | --> |    View        | --> |    Actions      |
|  (单一数据源)  |     |  (React组件)   |     |  (描述意图)     |
+----------------+     +----------------+     +----------------+
       ^                                              |
       |                                              v
       +--------------     +----------------+
                             |    Reducer     |
                             |  (纯函数计算)   |
                             +----------------+
```

&emsp;&emsp;**（2）Redux基本使用**
```jsx
// 1. 定义Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// 2. 创建Action Creators
const addTodo = (text) => ({
    type: ADD_TODO,
    payload: { text, id: Date.now() }
});

const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    payload: { id }
});

// 3. 创建Reducer
const initialState = { todos: [] };

function todoReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        case TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        default:
            return state;
    }
}

// 4. 创建Store
import { createStore } from 'redux';
const store = createStore(todoReducer);

// 5. 使用Store
store.dispatch(addTodo('学习React'));
store.dispatch(toggleTodo(1));

console.log(store.getState());
```

&emsp;&emsp;**（3）React-Redux连接**
```jsx
import { Provider, useSelector, useDispatch } from 'react-redux';

// 连接到React组件
function Counter() {
    const count = useSelector(state => state.counter.count);
    const dispatch = useDispatch();

    return (
        <div>
            <p>计数：{count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
        </div>
    );
}

// 使用Provider包裹应用
function App() {
    return (
        <Provider store={store}>
            <Counter />
        </Provider>
    );
}
```

---

## 21、React Router路由

&emsp;&emsp;**（1）基本路由配置**
```jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">首页</Link>
                <Link to="/about">关于</Link>
                <Link to="/user/123">用户</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

&emsp;&emsp;**（2）路由参数获取**
```jsx
// URL参数
function User() {
    const { id } = useParams();
    return <div>用户ID: {id}</div>;
}

// 查询参数
function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const page = searchParams.get('page') || 1;

    return (
        <div>
            <p>搜索: {query}</p>
            <p>页码: {page}</p>
            <button onClick={() => setSearchParams({ q: 'new query' })}>
                改变参数
            </button>
        </div>
    );
}

// 程序式导航
function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // 登录逻辑...
        navigate('/dashboard', { replace: true });
    };

    return <button onClick={handleLogin}>登录</button>;
}
```

&emsp;&emsp;**（3）嵌套路由**
```jsx
function App() {
    return (
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
        </Routes>
    );
}

function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside>
                <nav>
                    <Link to="/admin">仪表盘</Link>
                    <Link to="/admin/users">用户管理</Link>
                </nav>
            </aside>
            <main>
                {/* 嵌套路由内容在这里渲染 */}
                <Outlet />
            </main>
        </div>
    );
}
```

---

## 22、React性能优化

&emsp;&emsp;**（1）代码分割**
```jsx
// React.lazy 懒加载
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
    return (
        <div>
            <Suspense fallback={<div>加载中...</div>}>
                <OtherComponent />
            </Suspense>
        </div>
    );
}

// 路由级别代码分割
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}
```

&emsp;&emsp;**（2）组件卸载优化**
```jsx
// 列表虚拟化（长列表优化）
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            {items[index].name}
        </div>
    );

    return (
        <FixedSizeList
            height={400}
            itemCount={items.length}
            itemSize={50}
            width={300}
        >
            {Row}
        </FixedSizeList>
    );
}
```

&emsp;&emsp;**（3）避免不必要的渲染**
```jsx
// 使用React.memo包装组件
const MemoizedComponent = React.memo(Component);

// 使用key帮助Diff算法
function List({ items }) {
    return (
        <ul>
            {items.map(item => (
                // 使用唯一稳定的key
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// 组件拆分为小颗粒
// 好的：将变化频繁的部分单独提取
function ProductPage({ product, onAddToCart }) {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div>
            <ProductDetails product={product} />
            <OptionSelector
                selected={selectedOption}
                onChange={setSelectedOption}
            />
            <AddToCartButton onClick={() => onAddToCart(product)} />
        </div>
    );
}
```

---

## 23、React中的错误边界

&emsp;&emsp;**（1）定义错误边界**
```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // 更新state使下一次渲染能够显示错误UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 记录错误信息
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>出错了</h1>
                    <p>{this.state.error.toString()}</p>
                    <button onClick={() => window.location.reload()}>
                        刷新页面
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
```

&emsp;&emsp;**（2）使用错误边界**
```jsx
function App() {
    return (
        <ErrorBoundary>
            <Header />
            <ErrorBoundary>
                <MainContent />
            </ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}
```

---

## 24、React与TypeScript

&emsp;&emsp;**（1）组件类型定义**
```tsx
// 函数组件类型
interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    variant = 'primary',
    disabled = false
}) => {
    return (
        <button
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};
```

&emsp;&emsp;**（2）Props类型定义**
```tsx
// children类型
interface CardProps {
    title: string;
    children: React.ReactNode;
}

// 事件处理类型
interface InputProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
}

// 泛型组件
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
    return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}
```

&emsp;&emsp;**（3）常用Hooks类型**
```tsx
// useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useRef
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<number | null>(null);

// useReducer
interface State { count: number; }
type Action = { type: 'increment' } | { type: 'decrement' };

const [state, dispatch] = useReducer((state: State, action: Action) => {
    // ...
}, { count: 0 });

// useContext
const ThemeContext = createContext<{ theme: string; toggle: () => void } | null>(null);
```

---

## 25、React 18新特性

&emsp;&emsp;**（1）自动批处理（Automatic Batching）**
```jsx
// React 18之前：多次setState只在事件处理函数结束时批处理一次
// React 18：所有setState都会自动批处理

function App() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);

    const handleClick = () => {
        fetch('/api').then(() => {
            // React 17中只有一次渲染，React 18中也只有一次
            setCount(c => c + 1);
            setFlag(f => !f);
        });
    };

    return <button onClick={handleClick}>点击</button>;
}
```

&emsp;&emsp;**（2）新的Root API**
```jsx
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import ReactDOM from 'react-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 支持卸载
root.unmount();
```

&emsp;&emsp;**（3）Suspense改进**
```jsx
// 路由级别的Suspense
<Suspense fallback={<Loading />}>
    <Routes>
        <Route path="/" element={<Home />} />
    </Routes>
</Suspense>

// 结合React.lazy使用
const LazyComponent = lazy(() => new Promise(resolve => {
    setTimeout(() => resolve({ default: Component }), 1000);
}));
```

&emsp;&emsp;**（4）useId**
```jsx
function LoginForm() {
    const id = useId();

    return (
        <div>
            <label htmlFor={id}>用户名</label>
            <input id={id} type="text" />
        </div>
    );
}
```

&emsp;&emsp;**（5）useTransition**
```jsx
function SearchResults() {
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (newQuery) => {
        startTransition(() => {
            setQuery(newQuery);
            setResults(searchAPI(newQuery));
        });
    };

    return (
        <div>
            <input onChange={(e) => handleSearch(e.target.value)} />
            {isPending ? <Spinner /> : <ResultsList results={results} />}
        </div>
    );
}
```

---

## 26、React状态管理进阶

&emsp;&emsp;**（1）Zustand使用**
```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
    reset: () => set({ bears: 0 })
}));

function BearCounter() {
    const bears = useStore((state) => state.bears);
    return <h1>{bears} 只熊</h1>;
}
```

&emsp;&emsp;**（2）Jotai使用**
```jsx
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);

function Counter() {
    const [count, setCount] = useAtom(countAtom);
    const [doubled] = useAtom(doubledAtom);

    return (
        <div>
            <p>计数: {count}</p>
            <p>双倍: {doubled}</p>
            <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
    );
}
```

---

## 27、React测试

&emsp;&emsp;**（1）Jest + React Testing Library**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

// 测试组件渲染
test('renders counter with initial value', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('计数：5')).toBeInTheDocument();
});

// 测试交互
test('increments counter when button is clicked', async () => {
    render(<Counter initialCount={0} />);
    const button = screen.getByRole('button', { name: '增加' });

    fireEvent.click(button);
    expect(screen.getByText('计数：1')).toBeInTheDocument();

    // 使用userEvent更接近真实用户行为
    await userEvent.click(button);
    expect(screen.getByText('计数：2')).toBeInTheDocument();
});

// 测试异步操作
test('fetches and displays user data', async () => {
    render(<UserProfile userId={1} />);

    // 等待数据加载
    expect(await screen.findByText('加载中...')).toBeInTheDocument();
    expect(await screen.findByText('张三')).toBeInTheDocument();
});
```

---

## 28、React最佳实践

&emsp;&emsp;**（1）组件设计原则**
```
1. 单一职责原则（SPR）：每个组件只做一件事
2. 组件纯度：相同props总是渲染相同结果
3. 状态最小化：尽可能使用props和Context
4. 派生状态：尽量减少派生状态的使用
```

&emsp;&emsp;**（2）Hooks使用规范**
```jsx
// 1. 只在顶层调用Hooks
function CorrectComponent() {
    const [count, setCount] = useState(0); // ✅
    const [name, setName] = useState('');  // ✅

    if (condition) {
        // ❌ 不要在条件语句中调用
        const [temp, setTemp] = useState(null);
    }

    // 2. 只在React函数中调用
    // 3. 自定义Hooks以use开头
}

// 自定义Hook示例
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}
```

&emsp;&emsp;**（3）性能优化清单**
```
□ 使用生产版本进行测试
□ 避免不必要的重渲染
□ 列表渲染时添加唯一key
□ 使用React.memo包装纯组件
□ 使用useMemo缓存计算结果
□ 使用useCallback缓存回调函数
□ 使用代码分割和懒加载
□ 正确设置依赖数组
□ 清理副作用
□ 避免匿名函数和对象
```

---

## 29、React常见面试题

&emsp;&emsp;**（1）虚拟DOM的工作原理**
&emsp;&emsp;虚拟DOM是真实DOM的JavaScript对象表示。当状态变化时，React会：
1. 创建新的虚拟DOM树
2. 与旧的虚拟DOM树进行Diff比较
3. 计算出最小更新集合
4. 批量更新真实DOM

&emsp;&emsp;**（2）React Fiber是什么**
&emsp;&emsp;React Fiber是React 16引入的新协调引擎，将协调工作拆分成小单元，可以中断、恢复和复用，提高了应用的响应性和流畅度。

&emsp;&emsp;**（3）key的作用**
&emsp;&emsp;Key帮助React识别哪些元素改变了，添加、删除或重新排序。应该使用数据中的唯一标识作为key，避免使用索引。

&emsp;&emsp;**（4）React中的diffing算法**
&emsp;&emsp;React的diffing算法遵循三个策略：
1. 不同类型的元素产生不同的树
2. 相同类型的元素对比属性
3. 相同类型的组件元素，递归对比子元素

&emsp;&emsp;**（5）为什么需要useEffect的依赖数组**
&emsp;&emsp;依赖数组告诉React只有在指定值变化时才执行effect。空数组表示只在挂载时执行一次。缺少依赖可能导致使用过期值或无限循环。

---

## 30、综合实战：Todo应用

&emsp;&emsp;**完整的功能性Todo应用示例：**
```jsx
import React, { useState, useEffect, useRef } from 'react';

// Todo项组件
function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className={todo.completed ? 'completed' : ''}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>删除</button>
        </li>
    );
}

// Todo列表组件
function TodoList({ todos, onToggle, onDelete, filter }) {
    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case 'active': return !todo.completed;
            case 'completed': return todo.completed;
            default: return true;
        }
    });

    return (
        <ul>
            {filteredTodos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

// 主应用组件
function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('all');
    const inputRef = useRef(null);

    // 从localStorage加载
    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            setTodos(JSON.parse(saved));
        }
    }, []);

    // 保存到localStorage
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (input.trim()) {
            setTodos([
                ...todos,
                {
                    id: Date.now(),
                    text: input.trim(),
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ]);
            setInput('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.length - activeCount;

    return (
        <div className="todo-app">
            <h1>Todo App</h1>

            <div className="input-section">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="添加新任务..."
                />
                <button onClick={addTodo}>添加</button>
            </div>

            <div className="filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    全部 ({todos.length})
                </button>
                <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    待办 ({activeCount})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    已完成 ({completedCount})
                </button>
            </div>

            <TodoList
                todos={todos}
                filter={filter}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />

            {completedCount > 0 && (
                <button onClick={clearCompleted} className="clear-btn">
                    清除已完成
                </button>
            )}
        </div>
    );
}

export default TodoApp;
```

---

## 附录：React生态常用工具

&emsp;&emsp;**（1）开发工具**
```
- create-react-app: 快速创建React项目
- Vite: 更快的开发服务器和构建工具
- Next.js: React服务端渲染框架
- Remix: 全栈React框架
```

&emsp;&emsp;**（2）UI组件库**
```
- Material-UI (MUI): Google Material Design风格
- Ant Design: 蚂蚁金服企业级组件库
- Chakra UI: 可访问性优先的组件库
- Tailwind CSS: 原子化CSS框架
```

&emsp;&emsp;**（3）状态管理**
```
- Redux: 最流行的状态管理库
- MobX: 响应式状态管理
- Zustand: 轻量级状态管理
- Jotai: 原子化状态管理
- Recoil: Facebook官方状态管理
```

&emsp;&emsp;**（4）其他常用库**
```
- React Router: 路由管理
- React Query / TanStack Query: 服务端状态管理
- Formik / React Hook Form: 表单处理
- React Spring / Framer Motion: 动画
- Styled Components / Emotion: CSS-in-JS
```
