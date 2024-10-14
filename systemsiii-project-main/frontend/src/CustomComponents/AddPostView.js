import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { API_URL } from '../Utils/Configuration';

const cookies = new Cookies();

class AddPostView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: "",
            tag: "",
            title: "",
            content: "",
            error: null,
            success: null
        };
    }

    componentDidMount() {
        const user = cookies.get('user');

        if (user) {
            if (typeof user === 'string') {
                try {
                    const parsedUser = JSON.parse(user);
                    this.setState({ user_id: parsedUser.id });
                } catch (e) {
                    console.error("Error parsing user cookie:", e);
                    this.setState({ error: "Failed to retrieve user information. Please log in again." });
                }
            } else {
                // Handle the case where the cookie is already an object
                this.setState({ user_id: user.id });
            }
        } else {
            this.setState({ error: "User not logged in. Please log in to add a post." });
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { user_id, tag, title, content } = this.state;

        if (!user_id) {
            this.setState({ error: "User not logged in. Please log in to add a post.", success: null });
            return;
        }

        try {
            const response = await axios.post('/novice/create', { user_id, tag, title, content });
            this.setState({ success: response.data.message, error: null });
        } catch (error) {
            this.setState({ error: error.response ? error.response.data.message : "Error creating post", success: null });
        }
    };

    render() {
        const { tag, title, content, error, success } = this.state;

        return (
            <div>
                <p></p>
                <h2>Create a New Post</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Tag:</label>
                        <input type="text" name="tag" value={tag} onChange={this.handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Title:</label>
                        <input type="text" name="title" value={title} onChange={this.handleChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Content:</label>
                        <textarea name="content" value={content} onChange={this.handleChange} className="form-control" required />
                    </div>
                    <p></p>
                    <button  type="submit" className="btn btn-primary" style={{ background:"#0dcaf0", color:"white", border:"none" }}>Create Post</button>
                </form>
            </div>
        );
    }
}

export default AddPostView;

