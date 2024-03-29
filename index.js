const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const mid = require('node-machine-id');
const CryptoJS = require("crypto-js");
const argv = require('yargs').argv
const prompt = require('prompt');
const util = require('util');
const fs = require('fs')

const CONFIG = __dirname + '/.cache.cfg'

const ID = mid.machineIdSync()

if (argv.setup) {
	schema = {
		properties: {
			user: {
			},
			pass: {
				hidden: true
			},
		},
	}
	prompt.start()
	prompt.get(schema, (err, result) => {
		const details = {
			user: result.user,
			pass: result.pass,
		}
		const cipher = CryptoJS.AES.encrypt(JSON.stringify(details), ID)
		fs.writeFile(CONFIG, cipher, function(err) {
			if(err) {
				console.log(err);
				process.exit(1)
			}
			
			console.log("Setup successful.");
			process.exit(0)
		})
	})
} else {
	fs.readFile(CONFIG, function (err, data) {
		if (err) {
			if (err.code === 'ENOENT') {
				console.log('Credentials not found! Try running --setup');
			} else {
				console.log(err);
			}
			process.exit(1)
		}
		bytes = CryptoJS.AES.decrypt(data.toString(), ID)
		auth = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
		
		const login = 'div#content > div.content--inside:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div.wiw-container:nth-child(1) > div.login:nth-child(1) > div.panel:nth-child(1) > div.panel-body:nth-child(1) > div.panel-body-content:nth-child(1) > form.login-form:nth-child(5) > div.row:nth-child(3) > div.col:nth-child(1) > button.btn.btn-primary.btn-login.btn-md.btn-block:nth-child(1)'
		const clock = 'body > header > ul:nth-child(2) > li.clock-in.has-tooltip.right > a'
		const punch = 'body > div.dialog-kit-scroll > div > div.dialog-body > div.buttons > a'

		nightmare
		 .goto('https://login.wheniwork.com')
		 .wait('input#email')
		 .type('input#email', auth.user)
		 .wait('input#password')
		 .type('input#password', auth.pass)
		 .wait(login)
		 .click(login)
		 .wait(clock)
		 .click(clock)
		 .wait(punch)
		 .click(punch)
		 .wait(5000)
		 .end()
		 .then(function (result) {
			  console.log('Operation completed successfully.')
			  process.exit(0)
			})
			.catch(function (error) {
			  console.error('Error:', error);
			  process.exit(1)
			});
	});
}