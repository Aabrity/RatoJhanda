import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    numberOfLikes: {
      type: Number,
      default: 0,
      select: false, // hide from default query unless explicitly needed
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Use a virtual instead of numberOfLikes
commentSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
