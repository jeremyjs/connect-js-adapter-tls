const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const ProtoMessages = require('connect-protobuf-messages')

const createAdapter = require('../index')

const port = 5035
const host = null

const encodeDecode = new EncodeDecode()
const protocol = new ProtoMessages([
  { file: 'CommonMessages.proto'  },
  { file: 'OpenApiMessages.proto' },
])

const codec = new Codec(encodeDecode, protocol)

const adapter = createAdapter(codec)

test.cb('handle connect error', t => {
  protocol.load()
  protocol.build()

  adapter.onData(() => {})
  adapter.onError(() => {
    t.end()
  })
  
  adapter.connect(port, host)
})
