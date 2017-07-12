const graphql = require('graphql');
const axios = require('axios')
// const _ = require('lodash')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

// const users = [
// 	{id: '23', firstName: 'Mark', age: 25}
// ]

// instructs graphql on what a user object looks like
const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: {id: {type: GraphQLString }},
			resolve(parentValue, args) {
				// return _.find(users, { id: args.id })
				return axios.get(`http://localhost:3000/users/23`)
					.then(resp => resp.data);
			}
		}
	}
})

// resolve function is used to go into db and get data you're looking for
// everything else is definging the type of data.
// parentValue is worthless - just go with it
// args is important

module.exports = new GraphQLSchema ({
	query: RootQuery 
});