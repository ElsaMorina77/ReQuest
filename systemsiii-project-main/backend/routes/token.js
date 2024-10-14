const express = require("express");
//const { title } = require("process");
const token = express.Router();
const db = require("../db/conn")


token.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching tokens for user ID:', userId); // Log the user ID

        if (!userId) {
            return res.status(400).json({ message: 'User ID parameter is required' });
        }

        // Use dataPool.getUserTokens to fetch the tokens
        const tokens = await db.getUserToken(userId, 'Commenter Token');

        console.log('Fetched tokens:', tokens); // Log the fetched tokens

        if (tokens.length === 0) {
            return res.status(404).json({ message: 'No tokens found for this user' });
        }

        res.json(tokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ message: 'Error fetching tokens' });
    }
});


// posting token
token.post('/', async (req, res) => {
    try {
        const { userId, tokenType } = req.body;
        console.log('Awarding token:', { userId, tokenType });

        if (!userId || !tokenType) {
            return res.status(400).json({ message: 'User ID and token type are required' });
        }

        // Check and award token
        await db.checkAndAwardToken(userId);

        res.status(200).json({ message: 'Token awarded successfully' });
    } catch (error) {
        console.error('Error awarding token:', error);
        res.status(500).json({ message: 'Error awarding token' });
    }
});




module.exports = token
