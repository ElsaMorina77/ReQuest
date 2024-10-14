import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";

class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filteredPosts: [],
      loading: true,
    };
  }

  /*async componentDidMount() {
    try {
      const response = await axios.get(`${API_URL}/novice/`);
      console.log('Posts data:', response.data); 
      this.setState({ 
        posts: response.data,
        filteredPosts: response.data,
        loading: false 
      });
    } catch (err) {
      console.error('Error fetching posts:', err);
      this.setState({ loading: false });
    }
  }*/

    async componentDidMount() {
        try {
          const response = await axios.get('/novice/');
          const posts = response.data.map(post => ({
            ...post,
            marked: post.marked.data[0] // Convert Buffer to integer
          }));
          this.setState({ 
            posts,
            filteredPosts: posts,
            loading: false 
          });
        } catch (err) {
          console.error('Error fetching posts:', err);
          this.setState({ loading: false });
        }
      }
      


  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.filterPosts();
    }
  }

  filterPosts() {
    const { searchQuery } = this.props;
    const { posts } = this.state;
    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ filteredPosts });
  }

  render() {
  const { filteredPosts, loading } = this.state;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4" style={{ margin: "10px" }}>
      {filteredPosts.length > 0 ?
        filteredPosts.map((post) => (
          <div className="col" key={post.id}>
            <div 
              className="card"
              style={{ backgroundColor: post.marked === 1 ? 'lightgreen' : 'white' }} // Use integer value
            >
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <h6 className="card-tag" style={{ color: "gray" }}>{post.tag}</h6>
                <p className="card-text">{post.content}</p>

              </div>
              <button
                onClick={() => this.props.QIDFromChild({ page: "postDetail", id: post.id })}
                style={{ background:"#0dcaf0", color:"white", border:"none" , margin: "10px" }}
                className="btn btn-primary bt"
              >
                Read more
              </button>
            </div>
          </div>
        ))
        : "No posts found"}
    </div>
  );
}

  
}

HomeView.propTypes = {
  searchQuery: PropTypes.string,
  QIDFromChild: PropTypes.func.isRequired
};

export default HomeView;
