module.exports = exports = function(mongoose) {

  var Schema = mongoose.Schema

  var AnswerSchema = new Schema({
    question: {
      type: Schema.ObjectId,
      ref: 'Question'
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      default: ''
    },
    sub_answer: {
      type: Schema.Types.Mixed
    },
    answer_type: {
      type: String,
      lowercase: true
    },
    note: {
      type: String,
      default: '',
      trim: true
    },
    answer: {
      type: String,
      default: ''
    }
  });

  var ChecklistSchema = new Schema({
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    points: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'inapto'
    },
    group: {
      type: Schema.ObjectId,
      ref: 'Group'
    },
    protocolo: {
      type: String,
      default: ''
    },

    driver: {
      name: {
        type: String,
        default: '',
        trim: true
      },
      cpf: {
        type: String,
        default: '',
        trim: true
      },
      cadastro: {
        type: String,
        default: '',
        trim: true
      },
      transportadora: {
        type: String,
        default: '',
        trim: true
      }
    },

    vehicle: [{
      placa: {
        type: String,
        default: '',
        uppercase: true
      },
      tipo: {
        type: Schema.ObjectId,
        ref: 'Vehicle'
      },
      rastreador: {
        type: String,
        default: ''
      },
      identificador: {
        type: String,
        default: ''
      }
    }],

    fields: [],

    expires: {
      type: Date,
      default: Date.now
    },
    answers: [AnswerSchema],

    comments: [{
      body: {
        type: String,
        default: ''
      },
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],

    createdAt: {
      type: Date,
      default: Date.now
    }
  })

  ChecklistSchema.pre('remove', function(next) {
    next();
  })

  ChecklistSchema.methods = {

    addComment: function(user, comment, cb) {
      this.comments.push({
        body: comment.body,
        user: user._id
      })

      this.save(cb)
    },

    addField: function(title, type, cb) {
      this.fields.push({
        title: title,
        type: type
      });
      this.save(cb);
    }

  }


  ChecklistSchema.statics = {

    load: function(id, cb) {
      this.findOne({
        _id: id
      })
        .populate('user', 'name email username')
        .populate('vehicle.tipo')
        .populate('comments.user')
        .exec(cb)
    },

    list: function(req, options, cb) {
      if (!req) {
        cb(true, []);
      } else {
        var criteria = options.criteria || {},
          self = this,
          ret = function() {
            self.find(criteria, null, options.pagination || {})
              .populate('user', 'name username')
              .sort({
                'createdAt': -1
              }) // sort by date
            .exec(cb);
          }
        if (req.user.type === 'user-plus' || req.user.type == 'manager') {
          // config.groupUsers(req, function(err, users) {
          //   criteria.user = {
          //     $in: []
          //   };
          //   users.forEach(function(user) {
          //     criteria.user.$in.push(user._id);
          //   });
          //   return ret('user plus');
          // });
        }
        if (req.user.type == 'user') {
          criteria.user = {
            _id: req.user._id
          };
          return ret('user');
        }
        if (req.user.type == 'superuser' || req.user.type == 'user-norisk') {
          // all
          return ret('su nr');
        }
      }
    }

  }

  return {
    Checklist: mongoose.model('Checklist', ChecklistSchema)
  };

}
