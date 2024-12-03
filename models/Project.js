import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
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
  longDescription: {
    type: String,
    required: false
  },
  tools: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'URL invalide'
    }
  },
  github: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/github\.com\/[^ "]+$/.test(v);
      },
      message: 'URL GitHub invalide'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
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
ProjectSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  next();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 