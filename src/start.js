const path = require('path')
const fs = require('fs')
const cp = require('child_process')

let keysize = 4096

if (process.env.hasOwnProperty('keysize')) {
	if (!isNaN(process.env.keysize)) {
		keysize = Number(process.env.keysize)
	}
	else {
		console.error('>> keysize is not a number')
		process.exit(1)
	}
}

try {
	fs.readFileSync(path.join(__dirname, '..', 'crypto', 'key.pem'))

	console.log('> Found premade crypto/key.pem')

	fs.readFileSync(path.join(__dirname, '..', 'crypto', 'cert.pem'))

	console.log('> Found premade crypto/cert.pem')
}
catch (err) {
	console.log('> Failed to find previous crypto certificate or key. Will generate them. Using key size ' + keysize + '.')

	cp.execSync('mkdir crypto', {
		'cwd': path.join(__dirname, '..')
	})

	cp.execSync('openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -subj \"/CN=proxic/\" -days 10000', {
		'cwd': path.join(__dirname, '..', 'crypto')
	})
}

console.log('> Crypto completed.')

require('./index.js')
