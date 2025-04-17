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
        <Typography variant="h6" gutterBottom>
            Ezoic Services
        </Typography>
        <Typography>
        Ezoic Services
        This website uses the services of Ezoic Inc. (“Ezoic”), including to manage third-party interest-based advertising. Ezoic may employ a variety of technologies on this website, including tools to serve content, display advertisements and enable advertising to visitors of this website, which may utilize first and third-party cookies.
        A cookie is a small text file sent to your device by a web server that enables the website to remember information about your browsing activity. First-party cookies are created by the site you are visiting, while third-party cookies are set by domains other than the one you're visiting. Ezoic and our partners may place third-party cookies, tags, beacons, pixels, and similar technologies to monitor interactions with advertisements and optimize ad targeting. Please note that disabling cookies may limit access to certain content and features on the website, and rejecting cookies does not eliminate advertisements but will result in non-personalized advertising. You can find more information about cookies and how to manage them <a href="https://allaboutcookies.org/" target="_blank" rel="noopener noreferrer">here</a>.
        <Typography>The following information may be collected, used, and stored in a cookie when serving personalized ads:</Typography>
        <ul>
            <li>IP address</li>
            <li>Operating system type and version</li>
            <li>Device type</li>
            <li>Language preferences</li>
            <li>Web browser type</li>
            <li>Email (in a hashed or encrypted form)</li>
        </ul>
        Ezoic and its partners may use this data in combination with information that has been independently collected to deliver targeted advertisements across various platforms and websites. Ezoic’s partners may also gather additional data, such as unique IDs, advertising IDs, geolocation data, usage data, device information, traffic data, referral sources, and interactions between users and websites or advertisements, to create audience segments for targeted advertising across different devices, browsers, and apps. You can find more information about interest-based advertising and how to manage them <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">here</a>.
        <Typography>You can view Ezoic’s privacy policy <a href="https://www.ezoic.com/privacy/" target="_blank" rel="noopener noreferrer">here</a>, or for additional information about Ezoic’s advertising and other partners, you can view Ezoic’s advertising partners  <a href="https://www.ezoic.com/privacy-policy/advertising-partners/" target="_blank" rel="noopener noreferrer">here</a>.</Typography>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default PrivacyPolicy;
