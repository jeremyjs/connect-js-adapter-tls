const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const ProtoMessages = require('connect-protobuf-messages')

const createAdapter = require('../index')

const encodeDecode = new EncodeDecode()
const protocol = new ProtoMessages([
  { file: 'CommonMessages.proto'  },
  { file: 'OpenApiMessages.proto' },
])

const codec = new Codec(encodeDecode, protocol)

const adapter = createAdapter(codec)

test.cb('throws error when `host` or `port` are falsey', (t) => {
  protocol.load()
  protocol.build()

  const error = t.throws(() => {
		adapter.connect({ host: null, port: null })
	}, Error)
  
  adapter.disconnect()

  t.is(error.message, 'Invalid value for required parameters host and port: #connect({ host: null, port: null })')

  t.end()
})

test.cb.skip('handles connection errors', (t) => {
  // TODO
})
