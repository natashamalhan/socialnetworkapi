const {User, Thought} = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
    .then((user) =>{
       res.json(user)
    })
    .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>{
         res.json(user)
      })
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>{
        res.json(user)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    },
    deleteUser(req, res) {
      User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>{
            return Thought.deleteMany({ _id: { $in: user.thoughts} });
 
          })
        .then(() =>res.json({message:'User and thoughts deleted'}))
        .catch((err) => res.status(500).json(err));
    },
  addFriend(req,res){
    User.findByIdAndUpdate(
      { _id: req.params.userId},
      { $addToSet: { friends: { '_id': req.params.friendId} } },
      { runValidators: true, new: true }
    )
    .then((user) =>{
    res.json(user)
    })
    .catch((err) => res.status(500).json(err));
},
removeFriend(req,res){
  User.findOneAndUpdate(
    { _id: req.params.userId},
      { $pull: { friends: req.params.friendId  } },
      {new: true }
  )
  .then((user) =>{
  res.json(user)
  })
  .catch((err) => res.status(500).json(err));
},
  
};