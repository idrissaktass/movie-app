import React from "react";
import { Typography, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLanding = () => {
        navigate("/");
    };

    return (
        <>
            <Grid 
                position={"relative"} 
                bottom={0} 
                width={"100%"} 
                sx={{background:"linear-gradient(to right,#201003,#934c14)"}}
                display={"flex"} 
                justifyContent={"space-between"} 
                alignItems={"center"} 
                p={"10px 30px 10px 30px"}
            >
                <Typography 
                    onClick={handleLanding} 
                    fontSize={"20px"} 
                    fontWeight={"700"} 
                    color="#de7618" 
                    sx={{ cursor: "pointer" }}
                >
                    CineScope
                </Typography>
                <Grid display="flex" gap={1}>
                {/* <Typography 
                    onClick={() => navigate("/terms-of-service")} 
                    fontSize={"10px"} 
                    color="white" 
                    sx={{ cursor: "pointer" }}
                >
                    Terms of Service
                </Typography>
                <Typography 
                    onClick={() => navigate("/privacy-notice")}
                    fontSize={"10px"} 
                    color="white" 
                    sx={{ cursor: "pointer" }}
                >
                    Privacy Notice
                </Typography>
                <Typography 
                    onClick={() => navigate("/refund-policy")}
                    fontSize={"10px"} 
                    color="white" 
                    sx={{ cursor: "pointer" }}
                >
                    Refund Policy
                </Typography> */}
                </Grid>
                <Typography 
                    fontSize={{xs:"10px", sm:"12px", md:"14px"}} 
                    fontWeight={"400"} 
                    color="white"
                >
                    © {new Date().getFullYear()} CineScope - Tüm Hakları Saklıdır.
                </Typography>
            </Grid>
        </>
    );
}

export default Footer;
