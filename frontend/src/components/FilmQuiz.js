import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, Box, Fade, Grid } from '@mui/material';
import Navbar from './Navbar';
import { Helmet } from "react-helmet-async";

const FilmQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [blur, setBlur] = useState(true);
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    axios.get('https://movie-app-backend-liard.vercel.app/api/questions')
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Seçildiyse tekrar seçilmesin
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 10);
    }
    setShowResult(true);
    setBlur(false);

    setTimeout(() => {
      setShowResult(false);
      if (currentQuestion < questions.length - 1) {
        setLoadingNextQuestion(true);
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer('');
          setBlur(true);
          setIsImageLoading(true);
          setLoadingNextQuestion(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setQuizFinished(true);
          setBlur(false);
        }, 1000);
      }
    }, 2000);
  };

  const isLoading = isImageLoading || loadingNextQuestion;

  return (
    <Grid>
          <Helmet>
      <title>Movie Quiz - Test Your Film Knowledge!</title>
      <meta name="description" content="Challenge yourself with our exciting movie quiz. Test your film knowledge and see how many movies you can recognize!" />
      <meta name="keywords" content="Movie Quiz, Film Quiz, Movie Trivia, Film Knowledge Test, Movie Games" />
      <meta name="author" content="idrisaktas.online" />
      <meta property="og:title" content="Movie Quiz - Test Your Film Knowledge!" />
      <meta property="og:description" content="Challenge yourself with our exciting movie quiz. Test your film knowledge and see how many movies you can recognize!" />
      <meta property="og:type" content="website" />
    </Helmet>
      <Navbar/>
      <Grid container p={2} justifyContent={"center"}>
        <Grid item xs={12} md={10} lg={8} xl={6}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: '700px', md: '750px' }, overflow: 'hidden', borderRadius: 2, mb: 2 }}>
            {/* Background */}
            {questions.length > 0 && (
              <Box
                component="img"
                src={questions[currentQuestion]?.imageUrl || '/default-image.jpg'}
                alt="Movie Poster"
                onLoad={() => setIsImageLoading(false)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                  filter: blur ? 'blur(22px)' : 'blur(1px)',
                  transition: isLoading ? 'none' : 'filter 1s ease',
                }}
              />
            )}
            {isLoading && (
              <Box sx={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: 'gray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}>
                <CircularProgress color="inherit" />
              </Box>
            )}

            {/* Overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(1px)',
            }}>
              {questions.length > 0 ? (
                isLoading ? (
                  <CircularProgress color="inherit" size={60} sx={{ display: "none" }} />
                ) : (
                  <Grid display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Movie Quiz
                    </Typography>

                    {!quizFinished && (
                      <>
                        <Fade in={showResult} timeout={500}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: selectedAnswer === questions[currentQuestion].correctAnswer ? 'lightgreen' : 'tomato',
                              mb: 2,
                            }}
                          >
                            {selectedAnswer === questions[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect!'}
                          </Typography>
                        </Fade>

                        <Typography variant="h6" gutterBottom>
                          {questions[currentQuestion].question}
                        </Typography>

                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          mt: 2,
                        }}>
                          {questions[currentQuestion].choices.map((choice, index) => {
                            const isCorrect = choice === questions[currentQuestion].correctAnswer;
                            const isSelected = choice === selectedAnswer;
                            return (
                              <Button
                                key={index}
                                variant="contained"
                                onClick={() => handleAnswer(choice)}
                                disabled={!!selectedAnswer}
                                sx={{
                                  width: '220px',
                                  mx: 'auto',
                                  backgroundColor: selectedAnswer
                                    ? (isCorrect ? 'green !important' : isSelected ? 'red !important' : 'primary.main')
                                    : 'primary.main',
                                  '&:hover': {
                                    backgroundColor: selectedAnswer
                                      ? (isCorrect ? 'green !important' : isSelected ? 'red !important' : 'primary.dark')
                                      : 'primary.dark',
                                  },
                                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                                  transform: selectedAnswer && isSelected ? 'scale(1.05)' : 'none',
                                }}
                              >
                                {choice}
                              </Button>
                            );
                          })}
                        </Box>
                      </>
                    )}

                    {quizFinished && (
                      <Fade in={quizFinished} timeout={500}>
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="h4" fontWeight="bold" sx={{ color: score >= 50 ? 'lightgreen' : 'tomato' }}>
                            {score >= 50 ? 'Great Job!' : 'Better luck next time!'}
                          </Typography>
                          <Typography variant="h6" mt={2}>
                            Your Score: {score}
                          </Typography>
                        </Box>
                      </Fade>
                    )}
                  </Grid>
                )
              ) : (
                <CircularProgress color="inherit" />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FilmQuiz;
