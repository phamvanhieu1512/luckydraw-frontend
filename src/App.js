import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

import LayoutAdmin from "./components/Admin/LayoutAdmin";
import HeaderPlayer from "./components/Player/Header";
import NotFoundPage from "./pages/NotFoundPage";

export function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const Page = route.page;

          const isLogin = route.path === "/";
          const isAdmin = route.path.startsWith("/admin");
          const isPlayer = route.path.startsWith("/player");

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                isLogin ? (
                  <Page />
                ) : isAdmin ? (
                  <LayoutAdmin>
                    <Page />
                  </LayoutAdmin>
                ) : isPlayer ? (
                  <>
                    <HeaderPlayer />
                    <Page />
                  </>
                ) : (
                  <Page />
                )
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
