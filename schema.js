const { buildSchema } = require("graphql")
const schema = buildSchema(`
    type User {
        id: ID
    }

    type Game {
        id: ID,
        igdbId: String,
        progress: Int,
        ownerId: String
        completed: Boolean
    }

    type Query {
        userGames(ownerId: ID!): [Games!]!
    }
`)