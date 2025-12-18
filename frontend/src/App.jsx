import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DocumentDetailsPage from "./pages/Documents/DocumentDetailsPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage";
import Flashcardpage from "./pages/Flashcards/Flashcardpage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizzeResultPage from "./pages/Quizzes/QuizzeResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import GenerateArticlePage from "./pages/Article/GenerateArticlePage";
import LandingLayout from "./landingPage/landingLayout";
import GenerateImagePage from "./pages/image/GenerateImagePage";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect root */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/landing" replace />
            )
          }
        />

        {/* Public Pages */}
        <Route path="/landing" element={<LandingLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/write-article" element={<GenerateArticlePage />} />
          <Route path="/documents/:id" element={<DocumentDetailsPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/generate-images" element={<GenerateImagePage />} />
          <Route path="/documents/:id/flashcards" element={<Flashcardpage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizzeResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
