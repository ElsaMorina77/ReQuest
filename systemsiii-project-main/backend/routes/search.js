const express = require("express");
//const { title } = require("process");
const search = express.Router();
const db = require("../db/conn")


//works on postman (FINALLYYYY :,)))))
search.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        console.log('Search query:', q); // Log the search term

        if (!q) {
            return res.status(400).json({ message: 'Query parameter "q" is required' });
        }

        // Use dataPool.searchPosts instead of db.query
        const results = await db.searchPosts(q);

        console.log('Search results:', results); // Log the results

        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching posts' });
    }
});




module.exports = search
