const { clerkClient } = require('@clerk/express');


// Create a new user in Clerk and save the user data in MongoDB
const createUser = async (req, res) => {
    const {username, email, password, firstName, lastName,phoneNumber} = req.body;
  try {

    // Create a user in Clerk
    const clerkUser = await clerkClient.users.createUser({
        firstName,
        lastName,
        emailAddress:[email],
        phoneNumber:[phoneNumber],
        username,
        password, // Min 8 Character Required
    });

    console.log("ClerkUser User data", clerkUser)

    res.status(201).json({
      message: 'User created successfully',
      user: clerkUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const {username, email, firstName, lastName,phoneNumber } = req.body;
  const { userId } = req.param;
try {

  if(!userId){
      return res.status(404).json({ Status: 0, message: 'User Id not found' });
  }
  
  // Update a user in Clerk
  const clerkUser = await clerkClient.users.updateUser(
      { userId },
      {
          firstName,
          lastName,
          emailAddress:[email],
          phoneNumber:[phoneNumber],
          username,
      }
  );

  console.log("ClerkUser User data", clerkUser)

  res.status(202).json({
    message: 'User updated Successfully',
    user: clerkUser
  });
} catch (error) {
  console.error('Error Updating user:', error);
  res.status(500).json({ message: 'Error updating user', error: error.message });
}
};

// Delete a user from Clerk
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {

    if(!userId){
        return res.status(404).json({ Status: 0, message: 'User Id not found' });
    }
    // Delete the user from Clerk
    const clerkResponse = await clerkClient.users.deleteUser(userId);


    // Return success response
    res.status(200).json({
      message: `User with ID ${userId} deleted successfully.`,
      clerkResponse
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = { createUser , updateUser, deleteUser };
