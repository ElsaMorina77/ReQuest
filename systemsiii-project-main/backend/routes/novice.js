const express = require("express");
//const { title } = require("process");
const novice = express.Router();
const db = require("../db/conn")




//getting all the posts 
//works on postman 
novice.get("/", async (req,res,next)=>{
    try{
        let queryResult = await db.getAllPosts()
        res.json(queryResult) // send to frontend as a json file 

    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }

})


//get one post only 
//works on postman 

novice.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters
        
        // incremet the views 
        await db.incrementPostViews(postId);

        //post details 
        let queryResult = await db.getPostById(postId);
        
        // Check if the post exists
        if (queryResult.length === 0) {
            res.status(404).json({ message: "Post not found" });
        } else {
            res.json(queryResult[0]); // Send the post data as JSON
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});






//insert new post 
//works on postman 
novice.post("/create", async (req, res, next) => {
    try {
        const { user_id, tag, title, content, views, marked } = req.body;
        
        if (!user_id || !tag || !title || !content) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let queryResult = await db.createPost(user_id, tag, title, content, views || 0, marked || 0);
        res.status(201).json({ message: "Post created successfully", postId: queryResult.insertId });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});



//works on postman 
novice.delete("/delete/:id" , async (req, res, next) => {
    const postId = req.params.id;
    //const userId = req.user.id;

    try {
        const result = await db.deletePost(postId); // get result directly 
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Post deleted successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post" });
    }
});






//works on postman 
novice.patch("/mark-as-found/:id", async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters

        // Ensure the postId is provided and valid
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Update the post to mark it as found
        const result = await db.markPostAsFound(postId);

        // Check if the post was updated
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Post marked as found successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error marking post as found" });
    }
});


novice.patch("/mark-as-unfound/:id", async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters

        // Ensure the postId is provided and valid
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Update the post to mark it as found
        const result = await db.markPostAsUnfound(postId);

        // Check if the post was updated
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Post marked as unfound successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error marking post as found" });
    }
});



//edit post 
//works on postman 
novice.put("/edit/:id", async (req, res) => {
    try {
        const postId = req.params.id; // Get  post id from the request parameters
        const { title, tag, content, views, marked } = req.body;

        // are the required fields provided
        if (!title || !tag || !content) {
            return res.status(400).json({ message: "Title, tag, and content are required" });
        }

        // Update the post in the database
        const result = await db.updatePost(postId, title, tag, content, views || 0, marked || 0);

        // Check if the post was updated
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Post updated successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating post" });
    }
});


//Comments


//create comment
novice.post("/addcomment", async (req, res) => {
    try {
        const { post_id, user_id, content } = req.body;

        // Ensure all required fields are provided
        if (!post_id || !user_id || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Add the comment to the database
        const result = await db.addComment(post_id, user_id, content);

        // Respond with success
        res.status(201).json({ message: "Comment added successfully", commentId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding comment" });
    }
});


//get comments for a post 
novice.get("/comments/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await db.getCommentsByPostId(postId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching comments" });
    }
});


novice.delete("/delcomment/:id", async (req, res) => {
    try {
        const commentId = req.params.id;

        // Delete the comment from the database
        const result = await db.deleteComment(commentId);

        // Check if the comment was deleted
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Comment not found" });
        } else {
            res.status(200).json({ message: "Comment deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting comment" });
    }
});




module.exports = novice 