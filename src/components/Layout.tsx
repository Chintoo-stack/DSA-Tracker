import { NavLink, Outlet } from "react-router-dom";
import { displayName, useSession } from "../lib/session";

export function Layout() {
  const { user, mode, signOut } = useSession();

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to={user ? "/dashboard" : "/"} className="brand">
          <span>🔥</span> Ember
        </NavLink>
        <nav className="nav">
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Dashboard
              </NavLink>
              <NavLink to="/problems" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Problems
              </NavLink>
              <NavLink to="/plus" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Plus
              </NavLink>
              <span className="muted">
                {displayName(user)} · {user.plan === "plus" ? "Plus" : "Free"}
                {mode === "demo" ? " demo" : ""}
              </span>
              <button className="ghost" type="button" onClick={() => void signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/">Enter</NavLink>
          )}
        </nav>
      </header>
      <Outlet />
      <footer className="footer">Show up daily. Fire for a solve, sleep for a miss.</footer>
    </div>
  );
}
