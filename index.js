const fs = require('fs')
const ec = require('./encypt')
const execSync = require('child_process').execSync
const pluginName = 'BannerBuildInfo'

function numberify (n) {
  return Number(n) > 9 ? n : '0' + n
}
// 获取git信息的相关命令
const BRANCH_COMMAND = 'git rev-parse --abbrev-ref HEAD'
const AUTHOR_COMMAND = 'git config --get user.name'
const EMAIL_COMMAND = 'git config --get user.email'
const COMMITID_COMMAND = 'git rev-parse --short HEAD'

class BannerBuildinfoWebpackPlugin {
  constructor (options = {}) {
    this.options = options
  }

  apply (compiler) {
    compiler.hooks.done.tap(pluginName, () => {
      try {
        const {
          branch = true,
          author = true,
          email = true,
          date = true,
          mixup = false,
          commitId = true
        } = this.options

        let str = ''
        let branchStr = ''
        let authorStr = ''
        let emailStr = ''
        let dateStr = ''
        let commitIdStr = ''

        branch && (branchStr = execSync(BRANCH_COMMAND).toString())
        author && (authorStr = execSync(AUTHOR_COMMAND).toString())
        email && (emailStr = execSync(EMAIL_COMMAND).toString())
        commitId && (commitIdStr = execSync(COMMITID_COMMAND).toString())
        if (date) {
          if (mixup) {
            dateStr = Date.now().toString()
          } else {
            const d = new Date()
            dateStr =
              d.getFullYear() +
              '-' +
              numberify(d.getMonth() + 1) +
              '-' +
              numberify(d.getDate()) +
              ' ' +
              numberify(d.getHours()) +
              ':' +
              numberify(d.getMinutes()) +
              ':' +
              numberify(d.getSeconds())
          }
        }
        const arr = [
          { k: 'branch', v: branchStr },
          { k: 'author', v: authorStr },
          { k: 'email', v: emailStr },
          { k: 'date', v: dateStr },
          { k: 'commitId', v: commitIdStr }
        ].filter(x => x.v)

        if (mixup) {
          str =
            'console.log(' +
            ec.Encrypt(
              arr.map(x => x.v.replace(/\n|\r/g, '')).join('$$'),
              pluginName
            ) +
            ')'
        } else {
          arr.forEach(x => {
            str += '  ' + x.k + ': ' + x.v
          })
        }

        str = `
/*!
${str}
*/
`
        fs.writeFileSync(`${compiler.options.output.path}/iii.js`, str)
      } catch (e) {
        throw new Error(e)
      }
    })
  }
}

module.exports = BannerBuildinfoWebpackPlugin
