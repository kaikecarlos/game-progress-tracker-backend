const axios = require("axios")

// https://api.igdb.com/v4/games
// fields name, id; search "deus ex";
/**
 * @param {string} query 
 */
async function getGameIdFirstResult (query) {
    let objectResponse = undefined
    let response = await axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': process.env.Client_ID,
            'Authorization': 'Bearer ' + process.env.Authorization,
        },
        data: `fields name, id; search "${query}";`
    })
    return response.data[0]
}
/**
 * @param {string} query 
 * @returns {array}
 */
async function getAllGamesId (query) {
    let response = await axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': process.env.Client_ID,
            'Authorization': 'Bearer ' + process.env.Authorization,
        },
        data: `fields name, id; search "${query}";`
    })
    return response.data
}

/**
 * @param {int} id
 * @returns {string}
 */
async function getCoverId (id) {
    let response = await axios({
        url: "https://api.igdb.com/v4/covers",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': process.env.Client_ID,
            'Authorization': 'Bearer ' + process.env.Authorization,
        },
        data: `fields image_id; where game = ${id};`
    })
    return response.data[0].image_id
}

/**
 * @param {int} id
 * @returns {object}
 */
async function getAllGameData (id) {
    let response = await axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': process.env.Client_ID,
            'Authorization': 'Bearer ' + process.env.Authorization,
        },
        data: `fields name, summary; where id = ${id};`
    })
    let image_id = await getCoverId(id)
    let finalObject = {
        name: response.data[0].name,
        description: response.data[0].summary,
        image_id: image_id
    }
    return finalObject
}
module.exports = {
    getGameIdFirstResult,
    getAllGamesId,
    getCoverId,
    getAllGameData
}