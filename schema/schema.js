const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt
} = graphql;

// instructs graphql on what a user object looks like
const userType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});