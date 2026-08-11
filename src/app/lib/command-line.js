/**
 * command line support
 */

const { packInfo, isTest } = require('../common/app-props')
const { version } = packInfo

let helpInfo
let options
let program

function parseCommandLine (argv, options) {
  const { Command } = require('commander')
  const prog = new Command()

  prog
    .version(version)
    .name('electerm-mini')
    .usage('[options] sshServer')
    .description(`
### Connect ssh server from command line examples:
- electerm-mini user@xx.com
- electerm-mini user@xx.com:22
- electerm-mini --password password --set-env "SECRET=xxx USER=hhhh" user@xx.com:22
- electerm-mini -l user -P 22 -i /path/to/private-key -pw password xx.com -T -t "XX Server"

### Other params examples:
- server port:
electerm-mini -sp 30976
- load and run batch operation from json file:
electerm-mini -bo "/home/root/works.json"

### other connection types
- telnet:
electerm-mini -tp "telnet" -opts '{"host":"192.168.1.1","port":21","username":"root","password":"123456"}'
- rdp: electerm-mini -tp "rdp" -opts '{"host":"192.168.1.1","port":3389","username":"root","password":"123456"}'
- vnc: electerm-mini -tp "vnc" -opts '{"host":"192.168.1.1","port":3389","username":"root","password":"123456"}'
- serial: electerm-mini -tp "serial" -opts '{"port":"COM1","baudRate":115200,"dataBits":8,"stopBits":1,"parity":"none"}'
- local: electerm-mini -tp "local" -opts '{"title": "local terminal"}'

### Environment variables:
- DATA_PATH:
DATA_PATH=/custom/path/to/electerm-mini-data electerm-mini

- NO_PROXY_SERVER:
NO_PROXY_SERVER=1 electerm-mini

- PROXY_BYPASS_LIST:
PROXY_BYPASS_LIST="127.0.0.1, 127.0.0.1" electerm-mini

- PROXY_PAC_URL:
PROXY_PAC_URL="http://proxy.example.com/pac" electerm-mini

- PROXY_SERVER:
PROXY_SERVER="socks5://127.0.0.1:1080" electerm-mini
`)
    .option('-t, --title [Tab Name]', 'Specify the title of the new tab')
    .option('-l, --user <user>', 'specify a login name')
    .option('-P, --port <port>', 'specify ssh port')
    .option('-bo, --batch-op <batchOpFile>', 'load and run batch operation from json file')
    .option('-sp, --server-port <serverPort>', 'specify server port, default is')
    .option('-i, --private-key-path <path>', 'specify an SSH private key path')
    .option('-ps, --passphrase <passphrase>', 'specify an SSH private key passphrase')
    .option('-pw, --password <password>', 'specify ssh server password')
    .option('-se, --set-env <setEnv>', 'specify envs')
    .option('-so, --sftp-only', 'only show sftp panel')
    .option('-d, --init-folder <initFolder>', 'init folder got init terminal')
    .option('-tp, --tp <tp>', 'specify connection type')
    .option('-opts, --opts <opts>', 'specify connection options, json string')
    .allowUnknownOption()
    .exitOverride()

  try {
    prog.parse(argv, options)
  } catch (err) {
    if (err.message.includes('outputHelp')) {
      process.exit(0)
    }
  }
  return prog
}

if (!isTest) {
  program = parseCommandLine()
  options = program.opts()
  helpInfo = program.helpInformation()
}

exports.initCommandLine = function () {
  if (isTest) {
    return false
  }
  return {
    options,
    argv: program.args,
    helpInfo
  }
}
