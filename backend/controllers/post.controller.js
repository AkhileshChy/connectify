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

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author", "name username profilePicture headline").populate("comments.user", "name profilePicture username headline");
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPostById controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: { comments: { user: req.user._id, content }}
            },
            { new: true }
        ).populate("author", "name email username headline profilePicture");
        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            });
            await newNotification.save();
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else{
            post.likes.push(userId);
			if (post.author.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});

				await newNotification.save();
			}
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
    }
}