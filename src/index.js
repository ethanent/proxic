const path = require('path')
const tls = require('tls')
const fs = require('fs')

const c = require('centra')
const { protospec } = require('protocore')

const schema = fs.readFileSync(path.join(__dirname, 'protocol.pspec'))
const abstractorFactory = () => protospec.importAbstractor(schema)

const server = tls.createServer({
	'key': fs.readFileSync(path.join(__dirname, '..', 'crypto', 'key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '..', 'crypto', 'cert.pem')),
	'requestCert': false,
	'rejectUnauthorized': false,
	'ecdhCurve': 'auto',
	'minVersion': 'TLSv1.1'
})

server.on('secureConnection', (socket) => {
	socket.abstractor = abstractorFactory()

	socket.abstractor.bind(socket)

	socket.abstractor.on('request', (data, res) => {
		const req = c(data.url, data.method)

		if (data.body.length > 0) {
			req.body(data.body)
		}

		req.header(data.headers).timeout(data.timeout).send().then((httpRes) => {
			res({
				'error': '',
				'body': httpRes.body,
				'statusCode': httpRes.statusCode,
				'headers': new Map(Object.entries(httpRes.headers).map((header) => {
					if (Array.isArray(header[1])) {
						header[1] = 'a' + JSON.stringify(header[1])
					}
					else header[1] = 's' + header[1]

					return header
				}))
			})
		}).catch((err) => {
			console.error(err)
			
			res({
				'error': err.message,
				'body': Buffer.from([]),
				'statusCode': 0,
				'headers': new Map([])
			})
		})
	})
})

server.on('tlsClientError', (err) => {
	console.log('>> TLS client experienced error.')
	console.log(err)
})

server.on('error', (err) => {
	console.error('>> Server experienced error.')
	console.error(err)
})

server.listen(5135, () => {
	console.log('> Listening on internal port 5135.')
})
