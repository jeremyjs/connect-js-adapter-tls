const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const ProtoMessages = require('connect-protobuf-messages')

const { host, port } = require('./config')
const createAdapter = require('../index')

const encodeDecode = new EncodeDecode()
const protocol = new ProtoMessages([
  { file: 'CommonMessages.proto'  },
  { file: 'OpenApiMessages.proto' },
])

const codec = new Codec(encodeDecode, protocol)

const adapter = createAdapter(codec)

test.cb.skip('inactive socket should be closed', t => {
  protocol.load()
  protocol.build()

  adapter.onData(() => {})
  
  adapter.onEnd(() => {
    adapter.disconnect()
    t.end()
  })
  
  adapter.connect({ host, port })
})
