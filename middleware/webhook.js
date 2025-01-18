const { clerkClient } = require('@clerk/express');
const { Webhook } = require('svix');
const User = require('../models/User'); 
require('dotenv').config();

// Webhook secret from Clerk Dashboard (add it to your environment variables)
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// Function to handle the webhook events
const webhookHandler = async (req, res) => {
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  // Get the Svix headers from the request
  const svixId = req.headers['svix-id'];
  const svixTimestamp = req.headers['svix-timestamp'];
  const svixSignature = req.headers['svix-signature'];

  // Check if required headers are present
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.log("Missing Svix headers");
    return res.status(400).send("Missing Svix headers");
  }

  // Get the raw body for signature verification
  const payload = req.body;
  console.log("Payload", payload);
  const body = JSON.stringify(payload);

  // Initialize Svix with your secret key
  const wh = new Webhook(WEBHOOK_SECRET);

  let event;

  try {
    // Verify the webhook payload with headers
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }

  // Handle different event types
  const eventType = event.type;
  const eventData = event.data;
  console.log("Event Data", eventData);

  try {
    // Handle the user.created event
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, username, password,phone_numbers } = eventData;
      const userData = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || "",
        firstName: first_name || "",
        lastName: last_name || "",
        phoneNumber: phone_numbers[0].phone_number || null,
        password: password || null  // Set password to null if it's not available
      };
  
      // Save the new user to MongoDB
      const newUser = new User(userData);
      await newUser.save();
  
      // Update Clerk metadata with MongoDB user ID
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id.toString()
        }
      });
  
      return res.status(200).json({
        message: "New user created successfully",
        user: newUser
      });
    }

    // Handle the user.updated event
    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username, phone_numbers } = eventData;

      // Find the user in MongoDB by their Clerk ID and update their details
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0].email_address,
          username: username || "",
          firstName: first_name || "",
          lastName: last_name || "",
          phoneNumber: phone_numbers[0].phone_number
        },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    }

    // Handle the user.deleted event
    if (eventType === 'user.deleted') {
      const { id } = eventData;

      // Find the user in MongoDB by their Clerk ID and delete them
      const deletedUser = await User.findOneAndDelete({ clerkId: id });

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser
      });
    }

    // Handle unhandled event types
    console.log(`Unhandled event type: ${eventType}`);
    return res.status(200).send("Event received");

  } catch (error) {
    console.error("Error handling event:", error);
    return res.status(500).json({
      message: "Error handling event",
      error: error.message
    });
  }
};

module.exports = { webhookHandler };
