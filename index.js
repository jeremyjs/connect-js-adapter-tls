"use strict";

const tls = require("tls");
const { StateEmitter } = require("state-emitter");

module.exports = function (codec) {
  if (!codec) {
    throw new Error(
      `Invalid value for required parameter codec: ${codec}`
    )
  }
  
  let socket;
  const connected = true;
  const disconnected = false;
  const state = new StateEmitter();

  return {
    connect: function({ host, port }) {
      if (!host || !port) {
        throw new Error(
          'Invalid value for required parameters host and port: ' +
          `#connect({ host: ${host}, port: ${port} })`
        )
      }
      
      socket = tls.connect(port, host, function() {
        state.next(connected);
      });
      
      socket.on("data", codec.decode.bind(codec));
      
      socket.on("end", function() {
        state.next(disconnected);
      });
      
      socket.on("error", function() {
        state.next(disconnected);
      });
    },

    disconnect: function() {
      if (socket) {
        socket.end();
        socket.unref();
        socket.destroy();
        socket = null
      }
    },
    
    send: function(message) {
      const { payloadType, payload, clientMsgId } = message
      socket.write(
        codec.encode(payloadType, payload, clientMsgId)
      );
    },
    
    onOpen: function(callback) {
      state.whenEqual(connected, callback);
    },
    
    onEnd: function(callback) {
      state.whenEqual(disconnected, callback);
    },
    
    onError: function(callback) {
      state.whenEqual(disconnected, callback);
    },
    
    onData: function(callback) {
      codec.subscribe(callback);
    },
  };
};
