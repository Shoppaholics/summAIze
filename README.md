# summAIze

summAIze is a project or Hack For Good Hackathon 2025, designed as a PA system to arrange and schedule meetings, automate tasks, generate summaries of emmails and arrange meetings.

## Features

- Sign up using email
- Connect email
- Generate tasks from input text
- Delete tasks
- Summarise emails and generate tasks
- Access internal calendar

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **NPM**: Comes with Node.js, used for managing project dependencies.
- **Git**: [Download and install Git](https://git-scm.com/)

## Environment Setup

1. **Clone the Repository**

   Clone the project repository to your local machine using Git:

   ```bash
   git clone https://github.com/your-username/summAIze.git
   cd summAIze
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the required Node.js packages:

   ```bash
   npm install
   ```

3. **Create an environemnt file**
   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   NYLAS_CLIENT_ID=your_nylas_client_id
   NYLAS_API_KEY=your_nylas_api_key
   NYLAS_API_URI=https://api.us.nylas.com
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

      Replace `your_nylas_client_id`, `your_nylas_api_key`, `your_supabase_url`, `your_supabase_anon_key`, and `your_gemini_api_key` with your actual Client ID, API keys and URL.


   You can get these details from the following websites:

   - **Nylas**: Sign up at [Nylas](https://www.nylas.com/) and create a new application to get your `Client ID` and `API Key`.
   - **Supabase**: Sign up at [Supabase](https://supabase.com/dashboard/sign-in?returnTo=%2Fprojects) and go to the API section of your project to obtain your URL and Anon key.
   - **Google Gemini**: Sign up at [Google Cloud](https://cloud.google.com/) to get your API key.

## Running the project

1. **Start the server**
    
    Navigate to the `summAIze/src/api` directory and run the following command to start the Express server:

    ```
    node server.js
    ```

    The server will start running on `http://localhost:3001`.

2. **Run the project**

    Enter the following command in a new terminal window:

    ```
    npm start
    ```

    The project will start running on `http://localhost:3000`.

## Features 

### Sign up using email

- For first time users, click on the `Sign Up` button and create an account with your email and password.
- After signing up, click the `Log In` button to login with your email address.
- To log out, click the `Sign Out` button at the top right of the screen.

### Connect email

- To connect your email to be used for fetching and summarising your emails, followed by creating relevant tasks, click the `Connect Email` button in the header.
- You will be redirected to Nyla's page to login in through your Gmail account.
- After logging in through your gmail account, you will be redirected back to summAIze's Home page.
