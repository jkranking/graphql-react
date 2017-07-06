const graphql = require('graphql');
const _ = require('lodash'); // helper library that helps walk through collections of data (basically active record)
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

const users = [
	{ id: '23', firstName: 'Bill', age: 20},
	{ id: '47', firstName: 'Samantha', age: 21}
]

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
				// just working with hard coded data for now defined up top- no db
				return _.find(users, { id: args.id })

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