const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const ProtoMessages = require('connect-protobuf-messages')

const createAdapter = require('../index')

const { host, port } = require('./config')

const encodeDecode = new EncodeDecode()
const protocol = new ProtoMessages([
  { file: 'CommonMessages.proto'  },
  { file: 'OpenApiMessages.proto' },
])

const codec = new Codec(encodeDecode, protocol)

// TODO: adapter should be a class
const adapter = createAdapter(codec)

test.cb('send version request and receive response', (t) => {
  const version_req = 2104
  const version_res = 2105
  const payload = {}
  const client_msg_id = 'uuid'

  // TODO: move these into the protocol initializer
  protocol.load()
  protocol.build()

  adapter.onOpen(() => {
    adapter.send({
      payloadType: version_req,
      payload: payload,
      clientMsgId: client_msg_id
    })
  })
  
  adapter.onData((payload_type, response, id) => {
    t.is(version_res, payload_type)
    t.is('60', response.version)
    t.is(client_msg_id, id)
    t.end()
  })
  
  // TODO: host and port should be in a config object
  //   i.e. { host, port }
  adapter.connect(port, host)
})
