const express = require('express');
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema')

const app = express();


app.use('/graphql', expressGraphQL({
	schema, // => this is schema: schema (es6 syntax)
	graphiql: true
}))

app.listen(4000, ()=> {
	console.log('listening');
});

