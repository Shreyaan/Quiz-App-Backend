# 

# **Quiz App Backend**

The backend for the Quiz App is a server-side application that provides an API for the front-end to interact with. It uses Firebase for authentication, MongoDB as the main database for storing quiz data and highscores, and Redis for storing and tracking current running games. The backend enables users to sign up, sign in, create their own quizzes with full CRUD support, play any quiz from the list of available quizzes, and track their scores with a highscore system. The game session lasts 60 minutes after which it is deleted. The tech stack used to build the backend includes Firebase, MongoDB, Redis, Node.js, and Express.

## **Features**

- User authentication using Firebase
- CRUD support for creating your own quizzes with as many questions as you need.
- Ability to play any quiz from the list of available quizzes
- Highscore system to track the top scores for each quiz
- session lasts 60 minutes after which it's deleted so you have 1 hour to complete the quiz. You can even play it on different devices because it's all synced

## **Firebase Authentication**

The backend uses Firebase Authentication to authenticate users. Users can sign up and sign in using their email and password.

## **MongoDB**

The backend uses MongoDB as the main database for storing quiz data and highscores. The quiz data is stored in a collection of documents where each document represents a quiz. The quiz documents contain the quiz's title, questions, and options.

## **Redis**

The backend uses Redis to store and track current running games. When a user starts a quiz, a new session is created in Redis. The session lasts for 60 minutes after which it is deleted. The session data contains the quiz questions and the user's current score. This data is updated in real-time as the user answers questions. The Redis session data allows the user to play the quiz on multiple devices and continue where they left off.

## **Game Flow**

1. Sign up or log in to the app
2. The user selects a quiz to play.
3. The front-end sends a GET request to the backend's question endpoint to receive the first question.
4. The user answers the question by sending a POST request to the backend's answer endpoint with their answer.
5. The front-end sends another GET request to the backend's question endpoint to receive the next question.
6. Steps 3 and 4 are repeated until the user has answered all the questions or the session has expired.

## **Tech Stack**

- Firebase for authentication
- MongoDB for main database
- Redis for storing and tracking current running games
- Node.js for server-side logic
- Express for building the server

## **Deployment**

The backend is built using Node.js, Express and MongoDB, with Redis for storing the current running games. To deploy the application, make sure you have these dependencies installed and set up. The MongoDB database and Firebase authentication credentials will need to be set up and configured in the code.

## **Conclusion**

The Quiz App Backend is a robust and scalable application that provides a seamless experience for users who want to play quizzes and create their own. The use of Firebase for authentication, MongoDB for storing quiz data and highscores, and Redis for storing and tracking current running games ensure that the app can handle large amounts of data and handle multiple users playing quizzes at the same time. The Node.js and Express tech stack provides a solid foundation for the backend, making it easy to develop, maintain, and scale.
