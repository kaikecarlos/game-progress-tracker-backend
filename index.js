require("dotenv").config()

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require("cors")

const { makeExecutableSchema } = require('@graphql-tools/schema')
const { GraphQLJSONObject } = require("graphql-type-json")
const cuid = require("cuid")

const { PrismaClient  } = require("@prisma/client")
const { response } = require("express")

const prisma = new PrismaClient()

const { getGameIdFirstResult, getAllGameData } = require("./igdbLogic")
const typeDefs = `
    scalar JSONObject
    type User {
        id: ID
        games: [Game!]!
    }

    type Game {
        id: ID
        progress: Int
        owner: User
        completed: Boolean
        gameInfo: JSONObject
    }

    type Query {
        allUsers: [User]
        specificUser(id: ID!): User
    }

    type Mutation {
        createUser: User,
        insertGame(ownerId: String, igdbId: Int, progress: Int, completed: Boolean): Game
    }
`

const resolvers = {
    JSONObject: GraphQLJSONObject,
    Query: {
        allUsers: () => {
            return prisma.user.findMany()
        },
        specificUser: ({ id }) => {
            return prisma.user.findFirst({where: {id: id}})
        }
    },
    Mutation: {
        createUser: () => {
            return prisma.user.create({
                data: {
                    id: cuid()
                }
            }) 
        },
        insertGame: async (parent, args) => {
            // get game name and description
            let gameData = await getAllGameData(args.igdbId)
            return prisma.game.create({
                data: {
                    progress: args.progress,
                    owner: args.ownerId && {
                        connect: { id: args.ownerId },
                    },
                    completed: args.completed,
                    gameInfo: {
                        name: gameData.name,
                        description: gameData.description,
                        image_id: gameData.image_id
                    }
                }
            })
        }
    },
    User: {
        games: (parent) => {
            return prisma.game.findMany({
                where: { ownerId: parent.id }
            })
        }
    }
}

const schema = makeExecutableSchema({
    resolvers,
    typeDefs
})
function createContext() {
    return { prisma }
}
const app = express()

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };
app.use(cors(corsOptions));
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: createContext(),
    graphiql: true
}))



app.listen(8888)