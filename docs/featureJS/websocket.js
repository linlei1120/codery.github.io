const WebSocket = require('ws');

class WebSocketService {
  // constructor的作用：接收实例化参数；初始化实例的属性和状态；
  constructor(){
    this.wss = null;
    this.clients = new Map(); // 存储所有连接的客户端
    this.rooms = new Map(); // 存储房间信息
    this.userSockets = new Map(); // 存储用户ID与WebSocket的映射
  }

  /**
   * 初始化WebSocket服务器
   * @param {http.Server} server - HTTP服务器实例
  */
  initialize(server) {
    this.wss = new WebSocket.Server({
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    })

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket 服务已启动');
  }
  /**
   * 验证客户端连接
   * @param {Object} info - 连接信息
   * @param {Boolean} 是否允许连接
   * */ 

  verifyClient(info) {
    
  }
}

