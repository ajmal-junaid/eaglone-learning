const Community = require('../models/community')

module.exports = {
  joinRoom: async (roomId) => {
    try {
      const room = await Community.findOne({ roomId: roomId })
      if (!room) {
        const success = await Community.create({ roomId: roomId })
        return success
      }
      return room
    } catch (error) {
      return error
    }
  },
  addMessage: async (data) => {
    try {
      Community.findOneAndUpdate(
        { roomId: data.room },
        { $push: { messages: data } },
        { new: true },
        (err, doc) => {
          if (err) return err
          else return doc
        }
      )
    } catch (error) {
      console.log(error)
      return error
    }
  },
  getMessages: async (req, res) => {
    try {
      const { room } = req.query
      const messages = await Community.findOne({ roomId: room })
      return res.status(200).json({
        err: false,
        message: 'message fetched successfully',
        data: messages,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ err: true, message: 'something went wrong', error })
    }
  },
}
