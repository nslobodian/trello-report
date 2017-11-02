const https = require('https')
const trelloApi = 'https://api.trello.com/1/boards/N8KJDAYo'
const key = 'your_key'
const token = 'your_token'

console.log('\n *START* \n')

const argvs = process.argv
let myYnitial = ''
let jsonFile = ''
let cards
let members

if (argvs.length > 2) {
  myYnitial = argvs[2]
} else {
  throw new Error('No enough arguments. Need -myYnitial-')
}

function parseCards (cards, members) {
  console.log('\n *Start parsing cards* \n')
  const myId = members.find(({ initials }) => initials === myYnitial).id

  const names = cards
    .filter(({ dateLastActivity }) => new Date(dateLastActivity).toDateString() === new Date().toDateString())
    .filter(({ idMembers }) => idMembers.length > 0 && idMembers.includes(myId))
    .map(({ name, idShort }) => `[${idShort}]: ${name}`)

  console.log(names.join(',\n'))
  console.log('\n *EXIT* \n')
}

function getTrelloData(url) {
  return new Promise((resolve, reject) => {
    https.get(`${trelloApi}/${url}&key=${key}&token=${token}`, (res) => {
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          console.log('\n *GET members* \n')

          resolve(JSON.parse(rawData))
        } catch (e) {
          reject(e.message)
        }
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}

getTrelloData('cards?fields=dateLastActivity,idMembers,name,idShort').then(cards => {
  console.log('\n *GET cards* \n')

  getTrelloData('members?fields=initials,id').then(members => {
    console.log('\n *GET members* \n')

    parseCards(cards, members)
  })
})
