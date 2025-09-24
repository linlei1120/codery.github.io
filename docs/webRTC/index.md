# WebRTC

### ① WebRTC能做什么？
&emsp;&emsp;*WebRTC可以为基于开放标准的应用程序添加实时通信功能，可以使设备的摄像头和麦克风等系统应用实现更高级的视频通话和屏幕共享等应用。WebRTC支持对等点之间发送视频、语音和通用数据。*

### ② WebRTC应用程序的基本流程是什么？
&emsp;&emsp;*WebRTC应用程序的使用通常会经过一个通用的应用程序流程，包括访问媒体设备、打开对等连接、发现对等方并开始流式传输等。*

### ③ WebRTC和JS中的navigator之间的关系
*WebRTC（Web Real-Time Communication）是一套浏览器原生支持的实时音视频通信技术，而 `navigator 对象`是 `JavaScript` 中提供浏览器和设备信息的核心 API。`navigator` 是 `WebRTC` 访问硬件设备的`唯一入口`，而` WebRTC `的通信逻辑（如 RTCPeerConnection）则由其他 API 实现。两者 分工协作，共同完成实时通信功能。*
## 一、媒体设备
### 1、入门基础
&emsp;&emsp;在开发现代网页应用时，WebRTC标准提供了一系列API用于访问计算机或智能手机连接的各种摄像与录音设备，这些设备统称为"媒体设备"。在浏览器中可以访问`navigator.mediaDevices`对象。`navigator.mediaDevices`是只读属性返回一个`MediaDevices对象`，借助该API接口，我们既能枚举所有已连接的媒体设备，也能监听设备变动（例如设备接入或拔出），还能启动设备获取媒体流。

```js
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    /* use the stream */
  })
  .catch((err) => {
    /* handle the error */
});
// getUserMedia({
//   audio: true,
//   video: {
//     width: { min: 1024, ideal: 1280, max: 1920 },
//     height: { min: 576, ideal: 720, max: 1080 },
//   },
// });
```

&emsp;&emsp;其中最常用的方法是`getUserMedia()`函数，该函数会返回一个`Promise对象`，当满足条件的媒体设备就绪时会解析为对应的`MediaStream对象`。该函数接收一个`MediaStreamConstraints参数对象`，用于指定我们所需的设备约束条件。例如，若只需启用默认的摄像头和麦克风，可通过以下方式实现：

&emsp;&emsp;调用`getUserMedia()`将触发权限请求对话框。若用户授权通过，`Promise`将解析为包含一个视频轨道和一个音频轨道的`MediaStream对象`；若拒绝授权，则会抛出`PermissionDeniedError异常`；当系统中没有符合条件的设备时，则会触发`NotFoundError异常`。
```js
// MediaDevices.getDisplayMedia() 提示用户去选择和授权捕获展示的内容或部分内容（如一个窗口）在一个MediaStream 里。
const constraints = window.constraints = {
  audio: true, // 请求音频流
  video: true //请求视频流
}
// 用于设置媒体流的约束条件 同时将这个对象赋值给全局 window 对象的 constraints 属性，这样可以在其他地方访问到这个配置。
const constraints = window.constraints = {
  audio: false, // 不请求音频流
  video: true // 请求视频流
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'OverconstrainedError') {
    errorMsg(`OverconstrainedError: The constraints could not be satisfied by the available devices. Constraints: ${JSON.stringify(constraints)}`);
  } else if (error.name === 'NotAllowedError') {
    errorMsg('NotAllowedError: Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}
async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch(error) {
    handleError(error);
  }
}
```
### 2、查询媒体设备
&emsp;&emsp;在更复杂的应用场景中，通常需要检查所有已连接的摄像头和麦克风设备，并向用户提供相应的选择反馈。这可以通过调用`enumerateDevices()函数`实现，该函数将返回一个`Promise`，最终解析为描述每个已知媒体设备的`MediaDeviceInfo对象数组`。开发者可利用该功能构建用户界面，允许用户自主选择偏好设备。每个`MediaDeviceInfo对象`都包含`kind属`性，其值为`audioinput（音频输入）`、`audiooutput（音频输出）`或`videoinput（视频输入`），明确标识了该媒体设备的类型。
```js
async function getDevices() {
  try {
    // 1、先获取用户权限（浏览器会弹框询问）
    await navigetor.mediaDevices.getUserMedia({ audio:true, video:true});
    // 2、查询所有可用设备
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices); //打印设备列表
    return devices;
  } catch(error) {
    console.log0("获取设备失败",error);
    return [];
  }
}
```
### 3、监听设备变化
&emsp;&emsp;当前主流计算机普遍支持运行时接入各类外设，无论是通过USB连接的网络摄像头、蓝牙耳机，还是外接音响设备。为完善此类场景的支持，网页应用应当实时监测媒体设备的状态变更。开发者可通过为`navigator.mediaDevices`添加`devicechange事件监听器`来实现这一功能。
```js
// 使用提供的一组摄像机更新select元素
function updateCameraList(cameras) {
  const listElement = document.querSelector('select#availableCameras');
  listElement.innnerHTML = '';
  cameras.map(camera => {
    const cameraOption = document.createElement('option');
    cameraOption.label = camera.label;
    cameraOption.value = camera.deviceId;
  }).forEach(cameraOption => listElement.add(cameraOption));
}
// 获取特定类型的设备数组
async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === type);
}

//把最初的一组摄像头连接起来
const videoCameras = getConnectedDevices('videoinput');
updateCameraList(videoCameras);

//监听媒体设备的变化，并相应地更新列表
navigator.mediaDevices.addEventListener('devicechange', event => {
  const newCameraList = getConnectedDevices('video');
  updateCameraList(newCameraList)
})
```

### 4、媒体限制
&emsp;&emsp;约束对象必须实现`MediaStreamConstraints（）接口`，我们将其作为参数传递给`getUserMedia()`，它允许我们打开匹配特定需求的媒体设备。这个要求可以是非常松散的（音频和/或视频），也可以是非常具体的（最低相机分辨率或确切的设备ID）。建议使用`getUserMedia() API`的应用程序首先检查现有设备，然后使用`deviceId`约束指定与确切设备匹配的约束。如果可能的话，设备也将根据约束进行配置。
```js
 async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices;
  return devices.filter(device => device.kind === type);
 }
 //打开相机，至少具有minWidth和minHeight功能
 async function openCamera(cameraId, minWidth, minHeight) {
    const constraints = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': cameraId,
            'width': {'min': minWidth},
            'height': {'min': minHeight}
            }
        }
    return await navigator.mediaDevices.getUserMedia(constraints);
}
const cameras = getConnectedDevices('videoinput');
if (cameras && cameras.length > 0) {
    // 打开第一台分辨率为1280x720像素的摄像机
    const stream = openCamera(cameras[0].deviceId, 1280, 720);
}
```

### 5、本地回放
&emsp;&emsp;一旦媒体设备被打开，并且`MediaStream`可用，我们就可以将其分配给视频或音频元素，以便在本地播放流。
```js
async function playVideoFromCamera() {
    try {
        const constraints = {'video': true, 'audio': true};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}
```
&emsp;&emsp;`getUserMedia（）`使用的典型视频元素所需的`HTML`通常具有`autoplay`和`playsinline属性`。`autoplay属性`将导致分配给元素的新流自动播放。`playsinline属性`允许视频在某些移动浏览器上内联播放，而不是全屏播放。还建议对直播流使用`controls="false"`，除非用户应该能够暂停它们。
```html
<html>
<head><title>Local video playback</video></head>
<body>
    <video id="localVideo" autoplay playsinline controls="false"/>
</body>
</html>
```

## 二、媒体捕获和约束
&emsp;&emsp;WebRTC的媒体部分涵盖了如何访问能够捕获视频和音频的硬件，如摄像头和麦克风，以及媒体流如何工作。它还涵盖了显示媒体，即应用程序如何进行屏幕捕获。

### 1、媒体设备
&emsp;&emsp;支持的所有摄像头和麦克风浏览器是通过`Navigator`导航器访问和管理的。`mediaDevices对象`。应用程序可以检索连接设备的当前列表，也可以侦听变化，因为许多相机和麦克风通过USB连接，并且可以在应用程序的生命周期中连接和断开。由于媒体设备的状态可以随时更改，因此建议应用程序注册设备更改，以便正确处理更改。

#### （1） 约束
&emsp;&emsp;在访问媒体设备时，最好提供尽可能详细的约束条件。虽然可以通过一个简单的约束来打开默认的相机和麦克风，但它可能会提供对应用程序来说远非最佳的媒体流。

&emsp;&emsp;特定的约束在`MediaTrackConstraint对象`中定义，一个用于音频，一个用于视频。该对象的属性类型为`ConstraintLong`、`ConstraintBoolean`、`ConstraintDouble`或`ConstraintDOMString`。这些可以是一个特定的值（例如，一个数字，布尔值或字符串），一个范围（具有最小值和最大值的`LongRange`或`DoubleRange`）或具有理想或精确定义的对象。对于一个特定的值。

&emsp;&emsp;浏览器将尝试选择尽可能接近的东西。对于一个范围，将使用该范围中的最佳值。当指定了`exact`时，只有`media`要确定媒体流的某个轨道的实际配置，我们可以调用`mediastreamtrack` . `getsettings()`，它返回当前应用的`MediaTrackSettings`。

&emsp;&emsp;通过在轨道上调用`applyconstraints()`，也可以从我们打开的媒体设备更新轨道的约束。这允许应用程序重新配置媒体设备，而不必首先关闭现有的流。

#### （2） 显示媒体

&emsp;&emsp;希望能够执行屏幕捕获和记录的应用程序必须使用`Display Media API`。函数`getDisplayMedia()`（它是navigator的一部分）`mediaDevices`类似于`getUserMedia()`，用于打开显示的内容（或其中的一部分，例如窗口）。返回的`mediastreams`与使用`getUserMedia（）`时的工作原理相同。

&emsp;&emsp;`getDisplayMedia（）`的约束不同于用于常规视频或音频输入的约束。

```js
{
    video: {
        cursor: 'always' | 'motion' | 'never',
        displaySurface: 'application' | 'browser' | 'monitor' | 'window'
    }
}
```

### 2、流和轨道

&emsp;&emsp;`MediaStream`表示媒体内容流，它由音频和视频的音轨`（MediaStreamTrack）`组成。您可以通过调用`MediaStream`从`MediaStream`检索所有曲目。`getTracks()`，它返回`MediaStreamTrack对象`的数组。

#### (1) 媒体流跟踪

&emsp;&emsp;`MediaStreamTrack`有一个`kind属性`，可以是`audio`或`video`，表示它所代表的媒体类型。每个轨道可以通过切换其启用属性来静音。轨道有一个布尔属性`remote`，指示它是由`RTCPeerConnection`来源的，还是来自远程对等点。