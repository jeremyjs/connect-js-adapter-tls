const test = require('ava')
const { Codec } = require('connect-js-codec')
const EncodeDecode = require('connect-js-encode-decode')
const OpenApiProtocol = require('open-api-protocol')

const createAdapter = require('../index')

const encodeDecode = new EncodeDecode()
const protocol = new OpenApiProtocol()
protocol.load()
protocol.build()

const codec = new Codec(encodeDecode, protocol)

const adapter = createAdapter(codec)

test.cb('throws error when `codec` is falsey', (t) => {
  const error = t.throws(() => {
    const null_codec = null
    createAdapter(null_codec)
	}, Error)

  t.is(error.message, 'Invalid value for required parameter codec: null')

  t.end()
})

test.cb('throws error when `host` or `port` are falsey', (t) => {
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
