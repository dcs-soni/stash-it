# Stash It - Your Personal Content Storage Solution 🚀



https://github.com/user-attachments/assets/957f2aa0-611e-4a10-8f15-136ae499df09



Welcome to **Stash It**, a full-stack application designed to help you securely store and manage your important content. Whether it's links, notes, or any other type of information, Stash It provides a seamless experience for organizing your digital life.

## Table of Contents 📚
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features 🌟
- **User Authentication**: Sign up and log in securely with your username and password.
- **Content Management**: Add, view, and delete your stored content effortlessly.
- **Search Functionality**: Quickly find your stashed content with our powerful search feature.
- **AI Integration**: Get intelligent suggestions and insights based on your stored content.
- **Embeddings and Vector Search**: Utilize advanced embeddings for your content, enabling efficient vector searches through ChromaDB.
- **Responsive Design**: Access your content from any device with a user-friendly interface.

## Tech Stack 🛠️
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI Services**: ChromaDB, Hugging Face Transformers
- **Deployment**: Vercel for frontend, Railway for backend

## How It Works 🔍
Stash It leverages **ChromaDB** for efficient storage and retrieval of content. When you add content, it is transformed into embeddings using advanced AI models. These embeddings allow for quick and accurate vector searches, making it easy to find relevant information based on your queries.

### Embeddings
Embeddings are numerical representations of your content that capture its semantic meaning. By converting your text into embeddings, Stash It can perform similarity searches, allowing you to find related content quickly.

### Vector Search
Using ChromaDB, Stash It enables vector search capabilities. When you search for content, the application retrieves the most relevant results based on the embeddings, ensuring you get the best matches for your queries.

## Getting Started 🚀
To get started with Stash It, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/stash-it.git
   cd stash-it
   ```

2. **Install Dependencies**:
   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the client:
     ```bash
     cd client
     npm install
     ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret:
   ```plaintext
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CHROMA_HOST=your_chroma_host
   CHROMA_PORT=your_chroma_port
   ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd client
     npm run dev
     ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000` to start using Stash It!

## Usage 📖
- **Sign Up**: Create a new account to start storing your content.
- **Add Content**: Use the intuitive interface to add links, notes, or any other information.
- **Search**: Utilize the search bar to quickly find your stashed content using vector search.
- **Manage Content**: Edit or delete your content as needed.


## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for checking out Stash It! I hope you find it useful for managing your content. If you have any questions or feedback, feel free to reach out!
