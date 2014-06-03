module.exports = exports = function(passport, app, config) {

  var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config'),
    Schema = mongoose.Schema


  var VehicleSchema = new Schema({
    name: {
      type: String,
      default: '',
      trim: true
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

  var FieldSchema = new Schema({
    title: {
      type: String,
      default: '',
      trim: true
    },
    type: {
      type: String,
      default: 'text',
      trim: true,
      lowercase: true
    },
  });

  var FormSchema = new Schema({
    title: {
      type: String,
      default: '',
      trim: true
    },
    fields: [FieldSchema],
    group: {
      type: Schema.ObjectId,
      ref: 'Group'
    },
    key: {
      type: String,
      default: 'df'
    },
    info: {
      type: String,
      default: '',
      trim: true
    }
  });

  var QuestionSchema = new Schema({
    text: {
      type: String,
      default: ''
    },
    params: {
      type: Schema.Types.Mixed
    },
    form: {
      type: Schema.ObjectId,
      ref: 'Form'
    },
    type: {
      type: String,
      default: ''
    },
    answer_type: {
      type: String,
      default: 'goodbaddontexists'
    },
    keys: [{
      type: Schema.ObjectId,
      ref: 'Vehicle'
    }],
    origin: {
      type: String,
      default: 'master'
    },
    photo_required: {
      type: Boolean,
      default: false
    },
    comments: {
      type: Boolean,
      default: true
    },
    pos: {
      type: Number,
      default: 0
    }
  });

  QuestionSchema.statics = {

    load: function(id, cb) {
      this.findOne({
        _id: id
      })
        .exec(cb)
    },

    set: function(id, n, cb) {
      this.findOne({
        _id: id
      })
        .exec(function(err, i) {
          if (!err && i && n) {
            var q = require('underscore').extend(i, n);
            i.save(cb);
          }
        });
    },


    list: function(options, cb) {
      var criteria = options.criteria || {}
      this.find(criteria)
        .sort(options.sort || {
          'createdAt': -1
        })
        .exec(cb)
    }

  }

  mongoose.model('Form', FormSchema);
  mongoose.model('Question', QuestionSchema);
  mongoose.model('Vehicle', VehicleSchema);

}
