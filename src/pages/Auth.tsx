import { SignIn, SignUp } from "@clerk/react";
import { Routes, Route } from "react-router-dom";

export default function Auth() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-20">
      <Routes>
        <Route
          path="sign-in/*"
          element={
            <SignIn
              routing="path"
              path="/auth/sign-in"
              signUpUrl="/auth/sign-up"
            />
          }
        />
        <Route
          path="sign-up/*"
          element={
            <SignUp
              routing="path"
              path="/auth/sign-up"
              signInUrl="/auth/sign-in"
            />
          }
        />
      </Routes>
    </div>
  );
}