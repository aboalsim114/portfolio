import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  image: {
    type: String,
    required: false
  },
  tags: [{
    type: String,
    required: true
  }],
  author: {
    type: String,
    required: true,
    default: 'Sami Abdulhalim'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number,
    required: true,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour générer le slug avant la sauvegarde
BlogSchema.pre('save', function(next) {
  this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 