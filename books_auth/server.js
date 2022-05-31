const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const app = express();

const authors = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Sara' },
    { id: 3, name: 'Mike' },
    { id: 4, name: 'Peter' },
    { id: 5, name: 'Jean' }
]

const books = [
    { id: 1, name: 'heloo1', authorId: 1 },
    { id: 2, name: 'heloo2', authorId: 2 },
    { id: 3, name: 'heloo3', authorId: 3 },
    { id: 4, name: 'heloo4', authorId: 4 },
    { id: 5, name: 'heloo5', authorId: 5 },
    { id: 6, name: 'heloo6', authorId: 1 },
    { id: 7, name: 'heloo7', authorId: 3 },
    { id: 8, name: 'heloo8', authorId: 1 },
    { id: 9, name: 'heloo9', authorId: 2 },
    { id: 10, name: 'heloo10', authorId: 4 }
]


const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this represent a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            rsolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this represent a author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Single book',
            argd: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => {
                books.find(book => book.id === args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addbook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parents, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }

        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parents, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name
                }
                authors.push(author)
                return author
            }

        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL
    ({
        schema: schema,
        graphiql: true
    })
)

app.listen(5000, () => console.log('Server Running'))