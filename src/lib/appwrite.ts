import { Account, Client, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('699e1c6d000011275f6d')

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }
