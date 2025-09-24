# WebRTC 连接

## 一、对等连接
&emsp;&emsp;对等连接（Peer connections）是`WebRTC`规范的核心组件，旨在实现不同终端上两个应用程序通过点对点协议进行通信。这种端到端通信可传输视频、音频或任意二进制数据（支持`RTCDataChannel API`的客户端）。为实现终端间的连接发现，双方客户端都需配置`ICE服务器`——即`STUN或TURN服务器`，其核心功能是为每个客户端生成ICE候选项，再将这些候选项传输至远端对等端。这种ICE候选项的交换过程，通常称为`信令（signaling）交互`。

### （1） 信令
&emsp;&emsp;WebRTC规范虽然包含了与ICE（交互式连接建立）服务器通信的API，但信令机制并不属于该规范范畴。实现两端设备的连接建立，必须通过信令交换连接参数。通常情况下，这需要借助基于HTTP的标准Web API（如REST服务或其他RPC机制），网络应用在发起对等连接前，可通过此类接口中转必要的信令数据。

&emsp;&emsp;下面的代码片段显示了如何使用这个虚构的信令服务来异步发送和接收消息。这将在本指南的其他示例中必要时使用。
```js
//设置异步通信通道
//在建立对端连接时使用
const signalingChannel = new SignalingChannel(remoteClientId);
signalingChannel.addEventListener('message', message => {
  // 从远程客户端获取新的消息
})
//向远程客户端发送异步消息
signalingChannel.send(“你好!”);
```
&emsp;&emsp;信令可以以许多不同的方式实现，并且WebRTC规范不喜欢任何特定的解决方案。

### （2） 启动对等连接
&emsp;&emsp;每个对等连接都由`RTCPeerConnection对象`处理。该类的构造函数接受一个`singleRTCConfiguration对象`作为参数。该节点定义了如何建立对端连接，并且应该包含有关要使用的`ICE服务器`的信息。

&emsp;&emsp;一旦创建了`RTCPeerConnection`，我们需要创建一个`SDP`提供或应答，这取决于我们是呼叫端还是接收端。一旦创建了`SDP`要约或应答，就必须通过不同的通道将其发送到远程对等端。将`SDP对象`传递给远程对等体称为信令，不包括在`WebRTC规范`中。

&emsp;&emsp;要从调用端启动对等连接设置，我们创建一个`RTCPeerConnection对象`，然后调用`createoffer（）`来创建一个`RTCSessionDescription对象`。此会话描述使用`setLocalDescription（）`设置为本地描述，然后通过我们的信令通道发送到接收端。我们还为信令通道设置了一个侦听器，用于从接收端接收到对我们提供的会话描述的应答。

```js
async function makeCall() {
  const configuration = {'iceServers':[{'urls': 'stun:stun.l.goole.com:19302'}]}
  const peerConnection = new RTCPeerConention(configuration);
  signalingChannel.addEventListener('message', async message => {
    if(message.answer) {
      const remoteDesc = newRTCSeesionDescription(message.answer);
      await peerConnection.setRemoteDescription(remoteDesc);
    }
  })
  const offer = await peerConnection.createOffer();
  await peerConnection.setLoaclDescription(offer);
  signalingChannel.send({'offer':offer});
}
```
&emsp;&emsp;在接收端，我们会等待收到通话邀请（offer）后，才创建`RTCPeerConnection实例`。成功创建连接对象后，首先通过`setRemoteDescription()方法`设置远端发来的会话描述。随后调用`createAnswer()`生成应答（answer），使用`setLocalDescription()`将其设置为本地描述，最终通过信令服务器将这个应答回传给发起端。

```js
const peerConnection = new RTCPeerConnection(configuration);
signalingChannel.addEventListener('message', async message => {
    if (message.offer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalingChannel.send({'answer': answer});
    }
});
```
&emsp;&emsp;一旦两个对等点设置了本地和远程会话描述，它们就知道远程对等点的能力。这并不意味着对等点之间的连接已经就绪。要做到这一点，我们需要在每个对等点收集ICE候选者，并（通过信令通道）传输到另一个对等点。

### （3） ICE候选人
&emsp;&emsp;在两端设备通过WebRTC建立通信前，必须交换网络连接信息。由于网络状况受多种因素影响，通常需要借助外部服务来探测可行的连接候选方案。这项服务称为ICE（交互式连接建立），其实现依赖STUN或TURN服务器。

&emsp;&emsp;STUN（NAT会话穿越工具）协议常见于大多数WebRTC应用的底层实现中。而更先进的TURN（中继NAT穿越）协议在STUN基础上发展而来，主流商业级WebRTC服务多采用TURN服务器建立点对点连接。

&emsp;&emsp;WebRTC API原生支持STUN与TURN协议，这些技术被统称为ICE框架。创建WebRTC连接时，开发者通常需要在RTCPeerConnection对象的配置参数中指定一个或多个ICE服务器。

### （4） Trickle ICE
&emsp;&emsp;创建`RTCPeerConnection对象`后，底层框架会利用配置的`ICE服务器`收集连接候选地址（ICE候选）。通过监听`RTCPeerConnection`的`icegatheringstatechange事件`，可以获取`ICE收集`流程的实时状态（新建/收集中/完成）。

&emsp;&emsp;虽然可以等待`ICE收集`全部完成后再处理，但采用"渐进式ICE"技术效率更高——每当发现新候选地址就立即将其传输至远端节点。这种方式能显著降低连接建立耗时，大幅缩短视频通话的初始延迟。

&emsp;&emsp;要实现`ICE候选地址收集`，只需为`icecandidate事件`添加监听器。监听器接收的`RTCPeerConnectionIceEvent事件`对象包含`candidate属性`，该属性即为需要发送至远端节点的新候选地址（参见信令传输部分）。
```js
// 在本地RTCPeerConnection上监听本地ICE候选者
peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        signalingChannel.send({'new-ice-candidate': event.candidate});
    }
});
// 监听远程ICE候选者并将它们添加到本地RTCPeerConnection
signalingChannel.addEventListener('message', async message => {
    if (message.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
```
### （5） 建立连接
&emsp;&emsp;一旦ICE候选者被接收，我们应该期望对等连接的状态最终会改变为连接状态。为了检测这一点，我们在`RTCPeerConnection`中添加一个监听器，用于监听`connectionstatechange事件`。
```js
// 监听本地RTCPeerConnection上的connectionstatechange
peerConnection.addEventListener('connectionstatechange', event => {
  if(peerConnect.xonnectionState === 'connected') {
    console.log("连接完成!")；
  }
})
```
[RTCPeerConnection API](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection)

## 二、远程流

### （1） 入门
&emsp;&emsp;一旦`RTCPeerConnection`连接到远程对等端，就可以在它们之间传输音频和视频。这是我们将从`getUserMedia（）`接收到的流连接到`RTCPeerConnection`的地方。媒体流至少由一个媒体轨道组成，当我们想要将媒体传输到远程对等端时，这些轨道被单独添加到`RTCPeerConnection`中。
```js
const localStream = await getUserMedia({video:true, audio:true});
const peerConnection = new RTCPeerConnection(iceConfig);
localStream.getTracks().forEach(track => {
  peerConenction.addTrack(track, localStream);
})
```
&emsp;&emsp;轨道可以在`RTCPeerConnection`连接到远程对等点之前添加到`RTCPeerConnection`，因此尽早执行此设置而不是等待连接完成是有意义的。

### （2） 添加远程轨道
&emsp;&emsp;为了接收由另一个对等端添加的远程轨道，我们在本地`RTCPeerConnectionlistening`上为轨道事件注册一个侦听器。`RTCTrackEvent`包含一个具有相同`MediaStream`的`MediaStream对象数组`。`Id值`作为对等体对应的本地流。在我们的示例中，每个音轨只与单个流相关联。

&emsp;&emsp;请注意，虽然`MediaStream id`在对等端连接的两端都匹配，但`mediastreamtrack id`通常不是这样。
```js
const remoteVideo = document.querySelector('#remoteVideo');
peerConnection.addEventListener('track', async (event) => {
    const [remoteStream] = event.streams;
    remoteVideo.srcObject = remoteStream;
});
```
## 三、数据通道

### （1） 入门
&emsp;&emsp;`WebRTC标准`还涵盖了通过`RTCPeerConnection`发送任意数据的API。这是通过在`RTCPeerConnection对象`上调用`createdatachannel（）`来完成的，该对象返回一个`RTCDataChannel对象`。
```js
const peerConenction = new RTCPeerConnection(configuration);
const dataChannel = peerConnection.createDataChannel();
```
&emsp;&emsp;远程对等体可以通过监听`RTCPeerConnection对象`上的数据通道事件来接收数据通道。接收到的事件类型为`RTCDataChannelEvent`，并包含一个通道属性，表示在对等体之间连接的`RTCDataChannel`。
```js
const peerConnection = new RTCPeerCOnnection(configuration);
peerConnection.addEventListener('datachannel', event => {
  const dataChannel = event.channel;
})
```

### （2） 打开和关闭事件
&emsp;&emsp;在一个数据通道被用来发送数据之前，客户端需要等待，直到它被打开。这是通过监听开放事件来完成的。同样，当任何一方关闭通道时，也有一个关闭事件。
```js
const messageBox = document.querySelector('#messageBox');
const sendButton = document.querySelector('#sendButton');
const peerConnection = new RTCPeerConnection(configuration);
const dataChannel = peerConnection.createDataChannel();

// 打开时启用文本区和按钮
dataChannel.addEventListener('open', event => {
    messageBox.disabled = false;
    messageBox.focus();
    sendButton.disabled = false;
});

// 关闭时禁用输入
dataChannel.addEventListener('close', event => {
    messageBox.disabled = false;
    sendButton.disabled = false;
});
```
### （3） 消息
&emsp;&emsp;在`RTCDataChannel`上发送消息是通过使用我们想要发送的数据调用`send（）函数`来完成的。这个函数的data参数可以是`字符串`、`Blob`、`ArrayBuffer`或`ArrayBufferView`。
```js
const messageBox = document.querySelector('#messageBox');
const sendButton = document.querySelector('#sendButton');

// 当我们点击按钮时，发送一条简单的短信
sendButton.addEventListener('click', event => {
    const message = messageBox.textContent;
    dataChannel.send(message);
})
```
&emsp;&emsp;远程对等体将通过侦听消息事件接收在`RTCDataChannel`上发送的消息。
```js
const incomingMessages = document.querySelector('#incomingMessages');
const peerConnection = new RTCPeerConnection(configuration);
const dataChannel = peerConnection.createDataChannel();
//将新邮件附加到传入邮件框中
dataChannel.addEventListener('message', event => {
    const message = event.data;
    incomingMessages.textContent += message + '\n';
});
```