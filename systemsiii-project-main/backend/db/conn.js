const { rejects } = require("assert")
const mysql = require("mysql2")
const { resolve } = require("path")
const process = require("process")


const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
   
})




let dataPool = {};

// Post Operations

dataPool.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Post', (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};




dataPool.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Post WHERE id = ?', [id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};





//made marked as default 0 in db 
dataPool.createPost = (user_id, tag, title, content, views) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Post (user_id, tag, title, content, views) VALUES (?, ?, ?, ?, ?)';
        conn.query(query, [user_id, tag, title, content, views], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};




dataPool.deletePost = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Post WHERE id = ?';
        conn.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};



dataPool.markPostAsFound = (postId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Post SET marked = 1 WHERE id = ?';
        conn.query(query, [postId], (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};

dataPool.markPostAsUnfound = (postId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Post SET marked = 0 WHERE id = ?';
        conn.query(query, [postId], (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};



//edit post here 

dataPool.updatePost = (postId, title, tag, content) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE Post 
            SET title = ?, tag = ?, content = ?
            WHERE id = ?`;
        conn.query(query, [title, tag, content, postId], (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};

dataPool.incrementPostViews = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Post SET views = views + 1 WHERE id = ?';
        conn.query(query, [id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};



//User Operations 

//adding the user here 
//aka sign up 
dataPool.AddUser=(name, surname, username, email, password )=>{
    return new Promise ((resolve, reject)=>{
      conn.query(`INSERT INTO User (name, surname, username, email, password) VALUES (?,?,?,?,?)`, [name, surname,username, email, password], (err,res)=>{
        if(err){return reject(err)}
        return resolve(res)
      })
    })
  }
  

//authenticating the user 
// aka login 
dataPool.GetUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM User WHERE email = ?`, [email], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res[0]); // Return the first matching user
        });
    });
};





//Comment Operations 

dataPool.addComment = (post_id, user_id, content) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Comment (post_id, user_id, content) VALUES (?, ?, ?)';
        conn.query(query, [post_id, user_id, content], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};



dataPool.getCommentsByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Comment WHERE post_id = ?';
        conn.query(query, [post_id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};



dataPool.deleteComment = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM Comment WHERE id = ?';
        conn.query(query, [id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};


//TOKENS tba later
/*dataPool.getUserCommentCount = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM Comment WHERE user_id = ?';
        conn.query(query, [user_id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0].count);
        });
    });
};*/


/*dataPool.getUserToken = (user_id, token_type) => {
    return new Promise((resolve, reject) => {
        console.log(`Fetching token for user_id: ${user_id}, token_type: ${token_type}`);
        const query = 'SELECT * FROM Token WHERE user_id = ? AND token_type = ?';
        conn.query(query, [user_id, token_type], (err, results) => {
            if (err) {
                console.error('Error fetching tokens:', err);
                return reject(err);
            }
            console.log('Retrieved tokens:', results);
            resolve(results);
        });
    });
};*/


/*dataPool.awardTokenToUser = (user_id, token_type) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Token (token_type, total_nr, user_id) VALUES (?, ?, ?)';
        const earned_date = new Date();
        conn.query(query, [token_type, 1, user_id, earned_date], (err, results) => {
            if (err) {
                console.error('Error inserting token:', err);
                return reject(err);
            }
            console.log('Inserted token ID:', results.insertId);
            resolve(results.insertId);
        });
    });
};*/


/*dataPool.checkAndAwardToken = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const commentCount = await dataPool.getUserCommentCount(user_id);
            console.log(`User ${user_id} has ${commentCount} comments`); // Debug log

            if (commentCount >= 10) {
                const existingToken = await dataPool.getUserToken(user_id, 'Commenter Token');
                console.log('Existing tokens:', existingToken); // Debug log

                if (existingToken.length === 0) {
                    await dataPool.awardTokenToUser(user_id, 'Commenter Token');
                    console.log(`Token awarded to user ${user_id}`); // Debug log
                }
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};*/

/*dataPool.checkAndAwardToken = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const commentCount = await dataPool.getUserCommentCount(user_id);
            console.log(`User ${user_id} has ${commentCount} comments`);

            // Calculate the number of tokens to award
            const tokensToAward = Math.floor(commentCount / 10);
            console.log(`Tokens to award: ${tokensToAward}`);

            for (let i = 0; i < tokensToAward; i++) {
                // Award token of any type, for simplicity 'Commenter Token' is used
                await dataPool.awardTokenToUser(user_id, 'Commenter Token');
                console.log(`Token awarded to user ${user_id}`);
            }

            resolve();
        } catch (err) {
            console.error('Error in checkAndAwardToken:', err);
            reject(err);
        }
    });
};
*/
/*
dataPool.checkAndAwardToken = async (user_id) => {
    try {
        const commentCount = await dataPool.getUserCommentCount(user_id);

        if (commentCount >= 10) {
            const existingToken = await dataPool.getUserToken(user_id, 'Commenter Token');

            if (existingToken.length === 0) {
                await dataPool.awardTokenToUser(user_id, 'Commenter Token');
                console.log(`Token awarded to user ${user_id}`);
            }
        }
    } catch (err) {
        console.error('Error in checkAndAwardToken:', err);
        throw err; // Re-throw the error to be caught in the route
    }
};



// if i want to add tokens later on i comment the addComment above and use this one.
dataPool.addComment = (post_id, user_id, content) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Comment (post_id, user_id, content) VALUES (?, ?, ?)';
        
        conn.query(query, [post_id, user_id, content], async (err, res) => {
            if (err) {
                return reject(err);
            }

            try {
                // Check and award token if applicable
                await dataPool.checkAndAwardToken(user_id);
                resolve(res);
            } catch (tokenErr) {
                return reject(tokenErr);
            }
        });
    });
};

*/

conn.connect(err=> {
    if(err){
        console.log("ERROR: " + err.message)
        return
    }
    console.log("Connection Established")
})


module.exports = dataPool