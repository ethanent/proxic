# Proxic
> HTTP proxy server via binary protocol

## Run

```
docker run -it -p 5135:5135 -e keysize=4096 ethanent/proxic:1.0.0
```

## Connect

Use an official client (eg. [proxic-client](https://www.npmjs.com/package/proxic-client) for Node.js) to connect to your Proxic instance.

```js
const proxic = require('proxic-client')

let client

proxic.connect({
	'host': 'localhost',
	'port': 5135,
	'rejectUnauthorized': false // Recommended to avoid this in production.
}).then((c) => {
	client = c

	console.log('Connected')
}).catch((err) => {
	// ...
})
```

## Configuration

Feel free to add your own SSL cert into the container using volumes.

```
docker run -it -p 5135:5135 -v /path/to/cert.pem:/main/crypto/cert.pem -v /path/to/key.pem:/main/crypto/key.pem ethanent/proxic
```

