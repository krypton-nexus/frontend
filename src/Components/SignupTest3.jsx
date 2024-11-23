import React, { useEffect } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import CryptoJS from "crypto-js"; // Import the whole module

// Cognito Configuration (Replace with your actual values)
const poolData = {
  UserPoolId: "ap-south-1_z7LlV43Z1", // Your Cognito User Pool ID
  ClientId: "76mvqvob9ttth1jb9dlng1rjlj", // Your Cognito App Client ID
  ClientSecret: "13h30uvv6atrcstpr3g18sm6e9dupcqiuosjqffqbrhb971l2ug9", // Your Cognito App Client Secret (found in AWS Cognito console)
};

const userPool = new CognitoUserPool(poolData);

// Function to generate the SECRET_HASH
const generateSecretHash = (email, clientId, clientSecret) => {
  const message = email + clientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret); // Correct usage
  return hash.toString(CryptoJS.enc.Base64); // Base64-encoded SECRET_HASH
};

const SignupTest3 = () => {
  useEffect(() => {
    // Hardcoded values for testing
    const userData = {
      email: "sutharsirajan@gmail.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1234567890",
      password: "Test1234!",
      faculty: "Engineering",
      department: "Computer Science",
      year: "2024",
      courseName: "Computer Science",
      studentNumber: "12345",
      dob: "2000-01-01",
    };

    // Generate SECRET_HASH for the sign-up
    const secretHash = generateSecretHash(
      userData.email,
      poolData.ClientId,
      poolData.ClientSecret
    );

    // Log the user data and the generated secret hash for debugging
    console.log("User data (hardcoded): ", userData);
    console.log("Generated SECRET_HASH: ", secretHash);

    // Create Cognito user attributes from the hardcoded data
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: userData.email,
      }),
      new CognitoUserAttribute({
        Name: "given_name",
        Value: userData.firstName,
      }),
      new CognitoUserAttribute({
        Name: "family_name",
        Value: userData.lastName,
      }),
      new CognitoUserAttribute({
        Name: "phone_number",
        Value: userData.phoneNumber,
      }),
      new CognitoUserAttribute({
        Name: "custom:faculty",
        Value: userData.faculty,
      }),
      new CognitoUserAttribute({
        Name: "custom:department",
        Value: userData.department,
      }),
      new CognitoUserAttribute({
        Name: "custom:year",
        Value: userData.year,
      }),
      new CognitoUserAttribute({
        Name: "custom:courseName",
        Value: userData.courseName,
      }),
      new CognitoUserAttribute({
        Name: "custom:studentNumber",
        Value: userData.studentNumber,
      }),
      new CognitoUserAttribute({
        Name: "birthdate",
        Value: userData.dob,
      }),
    ];

    // Sign up the user with the hardcoded values and SECRET_HASH
    const signUpUser = async () => {
      try {
        const signUpData = await new Promise((resolve, reject) => {
          userPool.signUp(
            userData.email,
            userData.password,
            attributeList,
            { secretHash },
            (err, result) => {
              if (err) {
                console.log("Error during sign-up:", err);
                reject(err);
              } else {
                console.log("Signup result:", result);
                resolve(result);
              }
            }
          );
        });

        console.log("Signup successful: ", signUpData);
        alert("Signup successful! Please check your email to confirm.");
      } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up. Please try again.");
      }
    };

    // Call the signUp function
    signUpUser();
  }, []);

  return (
    <div className="signup-test-container">
      <h2>Signup Test - Hardcoded</h2>
      <p>Check the console for logs and the alert for success.</p>
    </div>
  );
};

export default SignupTest3;
