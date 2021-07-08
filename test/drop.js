const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const OpenApiProtocol = require('open-api-protocol')

const { host, port } = require('./config')
const createAdapter = require('../index')

const encodeDecode = new EncodeDecode()
const protocol = new OpenApiProtocol()
protocol.load()
protocol.build()

const codec = new Codec(encodeDecode, protocol)

const adapter = createAdapter(codec)

test.cb.skip('inactive socket should be closed', t => {
  adapter.onData(() => {})
  
  adapter.onEnd(() => {
    adapter.disconnect()
    t.end()
  })
  
  adapter.connect({ host, port })
})
