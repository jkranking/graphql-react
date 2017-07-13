const graphql = require('graphql');
const axios = require('axios')
// const _ = require('lodash')
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// const users = [
// 	{id: '23', firstName: 'Mark', age: 25}
// ]

// order of what is defined is important
const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		users: {
			type: new GraphQLList(UserType), // a company has many users
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(resp => resp.data);
			}
		}
	})
});

// instructs graphql on what a user object looks like
// associations are made by just adding the name of the field
const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(resp => resp.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: {id: {type: GraphQLString }},
			resolve(parentValue, args) {
				// return _.find(users, { id: args.id })
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(resp => resp.data);
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString} },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`)
					.then(resp => resp.data);
			}
		}
	}
})

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: {type: new GraphQLNonNull(GraphQLString)}, //cannot be null helper
				age: {type: new GraphQLNonNull(GraphQLInt)}, // cannot be null helper
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, {firstName, age}) {
				return axios.post(`http://localhost:3000/users`, {firstName, age})
					.then(resp => resp.data);
			}
		},
		deleteUser : {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString)},
			},
			resolve(parentValue, {id}) {
				return axios.delete(`http://localhost:3000/users/${id}`)
					.then(resp => resp.data);
			}
		},
		editUser : {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)},
				firstName: {type: GraphQLString }, 
				age: {type: GraphQLInt },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(resp => resp.data);
			}
		}
	}
})


// resolve function is used to go into db and get data you're looking for
// everything else is definging the type of data.
// args is important

module.exports = new GraphQLSchema ({
	query: RootQuery,
	mutation: mutation
});