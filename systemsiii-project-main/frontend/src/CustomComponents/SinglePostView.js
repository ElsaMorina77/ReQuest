import React, { Component } from "react";
import axios from "axios";
import { Button, Card, ListGroup, Form, Alert } from "react-bootstrap";
import PropTypes from 'prop-types';
import { API_URL } from "../Utils/Configuration";




class SinglePostView extends Component {
  state = {
    post: null,
    comments: [],
    newComment: "",
    error: "",
    success: "", // State for success messages
    isLoading: true,
    userId: this.props.userId,
    postId: this.props.postId,
    //
    postAuthor: "", // To store post author username
    commentAuthors: {} // To store usernames for each comment
  };

  componentDidMount() {
    this.fetchPost();
    this.fetchComments();
  }



  /*fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/novice/${this.props.postId}`);
      
      // Convert Buffer to boolean (0 or 1)
      const post = response.data;
      post.marked = post.marked ? post.marked.data[0] === 1 : 0; // Convert Buffer to number
      
      console.log("Fetched post data:", post); // Add logging
      this.setState({ post, isLoading: false });
    } catch (error) {
      console.error("Error fetching post", error);
      this.setState({ error: "Error fetching post", isLoading: false });
    }
  };*/


  fetchPost = async () => {
    try {
      const response = await axios.get(`/novice/${this.props.postId}`);
      const post = response.data;
      post.marked = post.marked ? post.marked.data[0] === 1 : 0;
  
      // Fetch the username of the post author
      const userResponse = await axios.get(`/novice/user/${post.user_id}`);
      const postAuthor = userResponse.data.username;
  
      this.setState({ post, postAuthor, isLoading: false });
    } catch (error) {
      console.error("Error fetching post", error);
      this.setState({ error: "Error fetching post", isLoading: false });
    }
  };
  
  
  

  /*fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/novice/comments/${this.props.postId}`);
      this.setState({ comments: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching comments", error);
      this.setState({ error: "Error fetching comments", isLoading: false });
    }
  };*/


  
  handleCommentChange = (event) => {
    this.setState({ newComment: event.target.value });
  };

  fetchComments = async () => {
    try {
      const response = await axios.get(`/novice/comments/${this.props.postId}`);
      const comments = response.data;
  
      // Fetch usernames for each comment
      const commentAuthors = {};
      await Promise.all(
        comments.map(async (comment) => {
          const userResponse = await axios.get(`/novice/user/${comment.user_id}`);
          commentAuthors[comment.id] = userResponse.data.username;
        })
      );
  
      this.setState({ comments, commentAuthors, isLoading: false });
    } catch (error) {
      console.error("Error fetching comments", error);
      this.setState({ error: "Error fetching comments", isLoading: false });
    }
  };
  





  handleAddComment = async (event) => {
    event.preventDefault();
    const { newComment, userId } = this.state;
    const { postId } = this.props;

    if (newComment.trim() === "") {
      this.setState({ error: "Comment cannot be empty" });
      return;
    }

    try {
      await axios.post('/novice/addcomment', {
        
        post_id: postId,
        user_id: userId,
        content: newComment,
      });
      this.setState({ newComment: "", error: "" });
      this.fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error("Error adding comment", error);
      this.setState({ error: "Error adding comment" });
    }
  };





  handleDeleteComment = async (commentId) => {
    const {userId} = this.props;
    const {comments} = this.state;
    console.log("userid"+ userId)
    console.log("comments"+ comments.user_id);
    console.log("comment user is " +String(this.state.comments.user_id) )
   

    const commentToDelete = comments.find(comment => comment.id === commentId);
    console.log("comment to delete"+ commentToDelete);
    console.log("comment to delete"+ commentToDelete.user_id);
    if(!commentToDelete) {
        this.setState({error: "Comment not found", success: null});
    }


    try {
        if (userId === String(commentToDelete.user_id)){
      await axios.delete(`/novice/delcomment/${commentId}`);
      this.fetchComments(); // Refresh comments after deleting
        }
        else {
            this.setState({ error: 'You are not authorized to delete this comment', success: null });   
        }

    }  catch (error) {
      console.error("Error deleting comment", error);
      this.setState({ error: "Error deleting comment" });
    }
  };

/*
  //////////////
  handleMarkCommentAsHelpful = async (commentId) => {
    try {
      await axios.patch(`${API_URL}/novice/comment/mark-as-helpful/${commentId}`);
      // Update the comments state to reflect the change
      this.fetchComments();
    } catch (error) {
      console.error("Error marking comment as helpful", error);
      this.setState({ error: "Error marking comment as helpful" });
    }
  };
  
  handleMarkCommentAsUnhelpful = async (commentId) => {
    try {
      await axios.patch(`${API_URL}/novice/comment/mark-as-unhelpful/${commentId}`);
      // Update the comments state to reflect the change
      this.fetchComments();
    } catch (error) {
      console.error("Error marking comment as unhelpful", error);
      this.setState({ error: "Error marking comment as unhelpful" });
    }
  };
  
//////////////////////
 */
 
 /* handleDeletePost = async () => {
    try {
      await axios.delete(`${API_URL}/novice/delete/${this.props.postId}`);
      this.setState({ success: "Post deleted successfully" });
      // Redirect or update state to reflect post deletion
      // For example: this.props.history.push('/');
    } catch (error) {
      console.error("Error deleting post", error);
      this.setState({ error: "Error deleting post" });
    }
  };*/

  handleDeletePost = async () => {
    const { postId } = this.props;
    const {userId} = this.props; 
    //some debugging 
    //const post = this.post;
    //console.log("post id" + postId);
    //console.log("user id"+ userId);
    //console.log("the post" + post)
    //console.log("props"+ this.props)
    //console.log("this.state.post.user_id" +this.state.post.user_id)

    try {
      // Check if the user is the author of the post
      if (userId === String(this.state.post.user_id)) {

       // console.log("this.props.user.id" + this.props.user.id)
        await axios.delete(`/novice/delete/${postId}`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        this.setState({ success: 'Post deleted successfully', error: null });
        // Redirect or update state to reflect post deletion
        // For example: this.props.history.push('/');
      } else {
        this.setState({ error: 'You are not authorized to delete this post', success: null });
      }
    } catch (error) {
      console.error('Error deleting post', error);
      this.setState({ error: 'Error deleting post', success: null });
    }
  };


 


  /*handleMarkAsFound = async () => {
    try {
      await axios.patch(`${API_URL}/novice/mark-as-found/${this.props.postId}`);
      this.fetchPost(); // Refresh post to update the UI
    } catch (error) {
      console.error("Error marking post as found", error);
      this.setState({ error: "Error marking post as found" });
    }
  };*/

  /*handleMarkAsFound = async () => {
    try {
      const response = await axios.patch(`${API_URL}/novice/mark-as-found/${this.props.postId}`);
      if (response.status === 200) {
        this.fetchPost(); // Refresh post to update the UI
        this.setState({ success: "Post marked as found" });
      }
    } catch (error) {
      console.error("Error marking post as found", error);
      this.setState({ error: "Error marking post as found" });
    }
  };*/

  handleMarkAsFound = async () => {
    //const { postId } = this.props;
    const {userId} = this.props; 
    //const post = this.post;

    try {
        if (userId === String(this.state.post.user_id)) {
      const response = await axios.patch(`/novice/mark-as-found/${this.props.postId}`);
      console.log("Mark as found response:", response.data); // Add logging
      this.fetchPost(); // Refresh post to update the UI
        }
        else {
            this.setState({ error: 'You are not authorized to mark this post as found', success: null });
        }
    } catch (error) {
      console.error("Error marking post as found", error);
      this.setState({ error: "Error marking post as found" });
    }
  };
  
  handleMarkAsUnfound = async () => {

    const {userId} = this.props; 


    try {
        if(userId === String(this.state.post.user_id)) {
      const response = await axios.patch(`/novice/mark-as-unfound/${this.props.postId}`);
      console.log("Mark as unfound response:", response.data); // Add logging
      this.fetchPost(); // Refresh post to update the UI
       }  

       else {
        this.setState({ error: 'You are not authorized to mark as unfound this post', success: null });
    }

    } catch (error) {
      console.error("Error marking post as unfound", error);
      this.setState({ error: "Error marking post as unfound" });
    }
  };
  


  /*handleMarkAsUnfound = async () => {
    try {
      await axios.patch(`${API_URL}/novice/mark-as-unfound/${this.props.postId}`);
      this.fetchPost(); // Refresh post to update the UI
    } catch (error) {
      console.error("Error marking post as unfound", error);
      this.setState({ error: "Error marking post as unfound" });
    }
  };*/

  /*handleMarkAsUnfound = async () => {
    try {
      const response = await axios.patch(`${API_URL}/novice/mark-as-unfound/${this.props.postId}`);
      if (response.status === 200) {
        this.fetchPost(); // Refresh post to update the UI
        this.setState({ success: "Post marked as unfound" });
      }
    } catch (error) {
      console.error("Error marking post as unfound", error);
      this.setState({ error: "Error marking post as unfound" });
    }
  };*/




  render() {
    const { post, comments, newComment, error, success, isLoading , postAuthor, commentAuthors } = this.state;

    

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div>
        {success && <Alert variant="success">{success}</Alert>}
        {post && (
          <Card style={{ backgroundColor: post.marked ? 'lightgreen' : 'white' }}>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>Author: {postAuthor}</Card.Text> {/* Display post author */}
              <Card.Text>{post.tag}</Card.Text>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text>Views: {post.views}</Card.Text> {/* Display view count */}
              <Button onClick={this.handleDeletePost}>Delete Post</Button>
              {post.marked ? (
                <Button onClick={this.handleMarkAsUnfound}>Unmark as Found</Button>
              ) : (
                <Button onClick={this.handleMarkAsFound}>Mark as Found</Button>
              )}
            </Card.Body>
          </Card>
        )}



        <div>
          <Form onSubmit={this.handleAddComment}>
            <Form.Group controlId="comment">
              <Form.Label>New Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={this.handleCommentChange}
              />
            </Form.Group>
            <Button type="submit">Add Comment</Button>
          </Form>

          <ListGroup>
            {comments.map((comment) => (
               <ListGroup.Item
               key={comment.id}>
                <p>{comment.content}</p>
                <p>Author: {commentAuthors[comment.id]}</p> {/* Display comment author */}
                <Button onClick={() => this.handleDeleteComment(comment.id)}>Delete Comment</Button>
                {/*<Button onClick={() => this.handleMarkCommentAsHelpful(comment.id)}>Mark as Helpful</Button>
                <Button onClick={() => this.handleMarkCommentAsUnhelpful(comment.id)}>Mark as Unhelpful</Button>*/}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}

SinglePostView.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired // Added userId to propTypes
};

export default SinglePostView;
