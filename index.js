console.log('\n *START* \n')

const argvs = process.argv
let myYnitial = ''
let jsonFile = ''

if (argvs.length > 3) {
  myYnitial = argvs[2]
  jsonFile = argvs[3]
} else {
  throw new Error('No enough arguments. Need -myYnitial- -jsonFile-')
}

const obj = require(jsonFile)
const cards = obj.cards
const members = obj.members

const myId = members.find(({ initials }) => initials === myYnitial).id

const names = cards
  .filter(({ dateLastActivity }) => new Date(dateLastActivity).toDateString() === new Date().toDateString())
  .filter(({ idMembers }) => idMembers.length > 0 && idMembers.includes(myId))
  .map(({ name, idShort }) => `[${idShort}]: ${name}`)

console.log(names.join(',\n'))
console.log('\n *EXIT* \n')
