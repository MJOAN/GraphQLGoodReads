const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema, 
    GraphQLString,
    GraphQLList
} = require('graphql');

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: (xml, args) => {
                const title = xml.GoodreadsResponse.book[0].title[0]
                return title
            }
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.book[0].isbn[0]
        }
    })
}) 


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => 
                xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: xml => 
                xml.GoodreadsResponse.author[0].books[0].book

        }
    })
})

module.exports = new GraphQLSchema ({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt }
                }, 
                resolve: (root, args) => fetch(
                    `https://www.goodreads.com/author/show.xml?id=${args.id}&key=yZDgZnQEdaODo3yCxplyxA`
                )
                .then(response => response.text())
                .then(parseXML)
            }
        })
    })
})