const awsconfig = {
  Auth: {
    region: "ap-south-1", // AWS region where your User Pool is hosted
    userPoolId: "ap-south-1_OtiDkJbCq", // Your User Pool ID
    userPoolWebClientId: "56imsa32nklkmdptaasa723u05", // Your App Client ID
    mandatorySignIn: true, // Enforce user sign-in for accessing the app
  },
};

export default awsconfig;
