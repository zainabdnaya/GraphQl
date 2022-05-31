const domain = 'dev.01-edu.org'
// access_token is the token provided by gitea
const access_token = ''
const client = await createClient({
  domain,
  access_token,
});

client.run('query {user{id, login}}').then(console.log)
console.log(client.storage.get('hasura-jwt-token'))