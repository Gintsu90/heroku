/* eslint-disable no-undef */
const mongoose = require("mongoose");


const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (validate) => {
        return /^\(?([0-9]{2,3})\)?-/.test(validate);
      },
      message: props => `${props.value} is not valid phone number`
    },
    required: [true, "User phone number required"]
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Entry", personSchema);