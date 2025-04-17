import React from "react";
import { Typography, Container, Box, Paper, Grid } from "@mui/material";
import Navbar from "./Navbar";

const PrivacyPolicy = () => {
  return (
    <Grid minHeight={"100vh"}>
      <Navbar />
      <Paper sx={{ padding: 3, marginBottom: 3, maxWidth: 900, justifySelf:"center", marginTop:"30px" }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="h6" gutterBottom>
          Information Collection
        </Typography>
        <Typography variant="body1" paragraph>
          We collect basic personal information such as your name and email
          address when you sign up. Additionally, we gather user preferences
          like selected movie genres, moods, and watch history to provide a
          personalized movie recommendation experience.
        </Typography>

        <Typography variant="h6" gutterBottom>
          How We Use Information
        </Typography>
        <Typography variant="body1" paragraph>
          The information collected is used solely to enhance your experience
          within the app. We use your selected genres, moods, and favorite
          movies to recommend films that align with your taste. We may also use
          anonymized data to improve our recommendation algorithms.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Data Sharing
        </Typography>
        <Typography variant="body1" paragraph>
          We do not share your personal information with third parties without
          your explicit consent. All data is processed securely and only used
          within the scope of the app's recommendation and personalization
          features.
        </Typography>

        <Typography variant="h6" gutterBottom>
          User Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You have the right to access, update, or delete your personal data at
          any time. You can manage your preferences and account settings through
          the app’s profile section.
        </Typography>
        <span id="ezoic-privacy-policy-embed"></span>
      </Paper>
    </Grid>
  );
};

export default PrivacyPolicy;
