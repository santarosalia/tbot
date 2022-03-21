const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

async function addItem(text) {
    try {
        const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            title: { 
            title:[
            {
            "text": {
            "content": text
            }
            }
        ]
        }
        },
    })
    console.log(response)
    console.log("Success! Entry added.")
    } catch (error) {
    console.error(error.body)
    }
}

const createSomething = async (text)  => {
    try {
        const updateTodo = await notion.pages.create({
            parent : {database_id: databaseId},
            properties : {
                title : {
                    title : [
                        {text:{
                            content : text
                        }}
                    ]
                }
            }

        )

            
        
        
    } catch (e) {
        console.log(e)
    }
}






const allThings = async ()  => {
    try {
        const items = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        })

        return items.results.map((list)=>{
            const properties = JSON.parse(JSON.stringify(list.properties))
            return properties.name.title[0].text.content
        }).reduce((prev, curr)=> `${prev}\n${curr}`)
    } catch (e) {
        console.log(e)
    }
}
module.exports = {createSomething}


// const leftDateFive = async () => {
//     try {
//         const items = await notion.databases.query({
//             database_id: process.env.NOTION_DATABASE_ID,
//             filter: {
//                 property: "left",
//                 formula: {
//                     number: {
//                         less_than : 5
//                     },
//                 },
//             },
//         })
//         return items.results.map((list)=>{
//             const properties = JSON.parse(JSON.stringify(list.properties))
//             return {
//                 name: properties.name.title[0].text.content,
//                 left: properties.left.formula.number
//             }
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// const getTypeList = async () => {
//     try {
//         const items = await notion.databases.query({
//             database_id: process.env.NOTION_DATABASE_ID,
//         })
//         const result = items.results.map((row)=>{
//             const properties = JSON.parse(JSON.stringify(row.properties))
//             return properties.type.select.name
//         })
//         return Array.from(new Set(result));
//     } catch (e) {
//         console.log(e)
//     }
// }

// const typeFilter = async (name) => {
//     try {
//         const items = await notion.databases.query({
//             database_id: process.env.NOTION_DATABASE_ID,
//             filter: {
//                 property: "type",
//                 select: {
//                     equals: name,
//                 },
//             },
//         })
//         return items.results.map((row)=>{
//             const properties = JSON.parse(JSON.stringify(row.properties))
//             return properties.name.title[0].text.content
//         }).reduce((prev, curr)=> `${prev}\n${curr}`)

//     } catch (e) {
//         console.log('typeFilter', e)
//     }
// }

// module.exports = {typeFilter, getTypeList, leftDateFive, allThings}