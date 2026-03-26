import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Proflle";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Navbar from "./components/layout/Navbar";
import AuthProvider from "./context/AuthContext"
import { dark } from '@clerk/ui/themes'

import { ClerkProvider } from '@clerk/react'
const App = () => {
  return (
     <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}  appearance={{
    theme: dark
    
  }}>
      <AuthProvider>

      
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/account/*" element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </AuthProvider>
    </ClerkProvider>

  );
};

export default App;
