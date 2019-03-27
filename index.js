"use strict";

const tls = require("tls");
const { StateEmitter } = require("state-emitter");

module.exports = function(codec) {
  let socket;
  const connected = true;
  const disconnected = false;
  const state = new StateEmitter();

  return {
    connect: function(port, host) {
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
    }
  };
};
