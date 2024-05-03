// controllers/postController.js
const Post = require('../models/Post');
const { Op } = require('sequelize');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// Configure AWS S3 connection
aws.config.update({
  accessKeyId: 'your_aws_access_key_id',
  secretAccessKey: 'your_aws_secret_access_key',
  region: 'your_aws_region'
});
const s3 = new aws.S3();

// Configure multer-s3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your_aws_s3_bucket_name',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`)
    }
  })
}).single('image');

exports.getAllPosts = async (req, res) => {
  const { sort, paginate, keyword, tag } = req.query;
  const where = {};

  if (keyword) {
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { desc: { [Op.like]: `%${keyword}%` } }
    ];
  }

  if (tag) {
    where.tag = tag;
  }

  try {
    const posts = await Post.findAll({
      where,
      order: sort ? [[sort.split(':')[0], sort.split(':')[1]]] : [['createdAt', 'DESC']],
      limit: paginate ? parseInt(paginate) : undefined,
      offset: paginate ? (parseInt(req.query.page) - 1) * parseInt(paginate) : undefined
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image', error: err.message });
    }

    const { title, desc, tag } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    try {
      const post = await Post.create({ title, desc, tag, imageUrl });
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: 'Error creating post', error: err.message });
    }
  });
};
