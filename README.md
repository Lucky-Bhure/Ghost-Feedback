# 👻 Ghost Feedback

An anonymous feedback application built with **Next.js (App Router)** and **TypeScript**. This platform allows users to create a public profile to receive anonymous messages, with a unique integration of **Google Gemini AI** to suggest conversation starters.

🔗 **Repository:** [https://github.com/Lucky-Bhure/Ghost-Feedback.git](https://github.com/Lucky-Bhure/Ghost-Feedback.git)

🔗 **Browse:** [https://ghost-feedback.netlify.app/](https://ghost-feedback.netlify.app/)


## 🚀 Features

  * **Authentication & Security**:
      * Secure Sign-up and Sign-in functionality.
      * Email verification via OTP (`verify-code`).
      * Real-time username uniqueness check (`check-username-unique`).
  * **Dashboard Management**:
      * View received anonymous messages.
      * Delete messages.
      * Toggle switch to Accept/Reject new messages.
  * **AI Integration**:
      * **Google Gemini** powered message suggestions to help users send engaging feedback.
  * **Public Profile**:
      * Unique public URL for every user (`/user/[username]`).
      * Anonymous message submission interface.
  * **Tech Stack**: Fully typed with TypeScript and built on the Next.js 13+ App Router.

## 🛠️ Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/) (App Router)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)
  * **AI Model:** [Google Gemini API](https://ai.google.dev/)
  * **Authentication:** [NextAuth.js](https://next-auth.js.org/)
  * **Database:** MongoDB (via Mongoose)
  * **Validation:** Zod
  * **Styling:** Tailwind CSS (Assumed)
  * **Emails:** Resend (for verification codes)

## 📂 Project Structure

Based on the source code, the project follows the modern Next.js App Router structure:

```text
src/
├── app/
│   ├── (app)/              # Protected application routes (Dashboard)
│   ├── (auth)/             # Authentication routes (Sign-in, Sign-up)
│   ├── api/                # Backend API Routes
│   │   ├── auth/           # NextAuth handlers
│   │   ├── get-messages/   # Fetch user messages
│   │   ├── suggest-messages/# AI suggestions (Gemini)
│   │   ├── verify-code/    # OTP Logic
│   │   └── ...             # Other API endpoints
│   ├── verify/[username]/  # Verification Page
│   └── user/[username]/    # Public Profile Page
└── components/             # Reusable UI components
```

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

  * Node.js (v18 or higher)
  * npm or yarn
  * A MongoDB database URI
  * A Google Gemini API Key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Lucky-Bhure/Ghost-Feedback.git
    cd Ghost-Feedback
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following keys:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    RESEND_API_KEY=your_resend_api_key
    NEXTAUTH_SECRET=your_nextauth_secret
    GEMINI_API_KEY=your_api_key depending on your setup
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 🤖 AI Integration (Gemini)

This project uses Google's Gemini AI to enhance the user experience. The logic for this is handled in:
`src/app/api/suggest-messages/route.ts`

It generates context-aware or fun questions that visitors can ask the profile owner without having to type manually.

## 🤝 Contributing

Contributions are welcome\! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

*Developed by [Lucky Bhure](https://github.com/Lucky-Bhure)*