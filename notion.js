const { Client } = require("@notionhq/client")
const { getDatabase } = require("@notionhq/client/build/src/api-endpoints")
const { response } = require("express")

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

const registCoin = async (chatId,market)  => {
    try {
        await notion.pages.create({
            parent : {database_id: databaseId},
            properties : {
                title : {
                    title: [
                        {   
                            text:{
                            content : chatId
                        }
                    }
                    ]
                },
                "market" : {
                    rich_text : [
                        {
                            text :{
                                content : market 
                            }
                        }
                    ]
                }
            }     
        }
        )
    } catch (e) {
        console.log(e)
    }
}



const myRegist = async (chatId)  => {
    try {
        const items = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter : {
                and : [
                    {property : "chatId",
                    rich_text : {
                        equals : chatId
                    }
                    
                }

                    

                ]
            }
            
        })
        items.results.map((item)=>{
            const properties = JSON.parse(JSON.stringify(item.properties));
            const chatId = properties.chatId.title[0].content;
            
            
            return chatId;

        });
        
    } catch (e) {
        console.log(e)
    }
}
module.exports = {registCoin,myRegist}


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