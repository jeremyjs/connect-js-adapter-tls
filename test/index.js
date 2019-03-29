const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const OpenApiProtocol = require('open-api-protocol')

const createAdapter = require('../index')

const { host, port } = require('./config')

const encodeDecode = new EncodeDecode()
const protocol = new OpenApiProtocol()

// TODO: move these into the protocol initializer
protocol.load()
protocol.build()

const codec = new Codec(encodeDecode, protocol)

// TODO: adapter should be a class
const adapter = createAdapter(codec)

test.cb('send version request and receive response', (t) => {
  const version_req = 2104
  const version_res = 2105
  const payload = {}
  const client_msg_id = 'uuid'

  adapter.onOpen(() => {
    adapter.send({
      payloadType: version_req,
      payload: payload,
      clientMsgId: client_msg_id
    })
  })
  
  adapter.onData((payload_type, response, id) => {
    adapter.disconnect()
    
    t.is(version_res, payload_type)
    t.is('60', response.version)
    t.is(client_msg_id, id)

    t.end()
  })
  
  adapter.connect({ host, port })
})
