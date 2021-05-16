import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage(post);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }
  try {
    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json(updatePost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }
  try {
    await PostMessage.findByIdAndRemove(_id);
    res.status(200).json({ message: "delete success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.json({ message: "Unanthenticated " });

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }
  try {
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json(updatePost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
