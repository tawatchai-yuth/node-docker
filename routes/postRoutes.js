const express = require("express");

const postController = require("../controllers/postController");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

router
    .route("/")
    .get(protect, postController.getAllPost)
    .post(protect, postController.createPost);

router
    .route("/:id")
    .get(protect, postController.getOnePost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost);

module.exports = router;