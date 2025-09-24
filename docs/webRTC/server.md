# TURN 服务器
法直接建立连接（除非它们处于同一局域网）。通用的解决方案是使用 TURN 服务器，该术语全称为「NAT 中继穿透协议」，专门用于中继网络流量。

目前有多类 TURN 服务器可选，既包含自托管方案（如开源项目 COTURN），也有云端托管服务。

当 TURN 服务器部署就绪后，只需在客户端应用中配置正确的 RTCConfiguration 即可使用。以下代码示例展示了如何配置 RTCPeerConnection：假设 TURN 服务器主机名为 my-turn-server.mycompany.com，运行在 19403 端口。配置对象还支持 username 和 credentials 属性，用于服务器安全认证——连接 TURN 服务器时这些凭证必不可少。

```js
const iceConfiguration = {
    iceServers: [
        {
            urls: 'turn:my-turn-server.mycompany.com:19403',
            username: 'optional-username',
            credentials: 'auth-token'
        }
    ]
}
const peerConnection = new RTCPeerConnection(iceConfiguration);
```