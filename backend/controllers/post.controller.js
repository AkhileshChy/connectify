import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: {$in: [...req.user.connections, req.user._id]}}).populate("author", "name username profilePicture headline").populate("comments.user", "name profilePicture").sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        let newPost;
        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResult.secure_url
            });
        } else {
            newPost = new Post({
                author: req.user._id,
                content
            })
        }
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.author.toString() !== userId.toString()){
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        if (post.image) {
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in delete post controller", error.message);
		res.status(500).json({ message: "Server error" });
    }
}