const { Thought, User } = require('../models');


module.exports = {
  getThoughts(req, res) { 
    Thought.find()
    .then((thought) =>{
      res.json(thought)
    }).catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>{
        res.json(thought)

  }).catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>{
      res.json('Created the thought')
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>{
        res.json(thought)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>{
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } }, 
          { new: true }
        )})
      .then((user) =>{
        res.json({ message: 'thought successfully deleted!' })
      })
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>{
      res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions:{'_id': req.params.reactionId }} },
      { new: true }
    )
      .then((thought) =>{
      res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
};