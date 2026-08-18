import { NavLink, Outlet } from "react-router-dom";
import { displayName, useSession } from "../lib/session";

export function Layout() {
  const { user, mode, signOut } = useSession();

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to={user ? "/dashboard" : "/"} className="brand">
          <span aria-hidden="true">🔥</span> Ember
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
              <span className="who">
                {displayName(user)}
                <em>{user.plan === "plus" ? "Plus" : "Free"}{mode === "demo" ? " demo" : ""}</em>
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
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">A day with a solve burns 🔥. A quiet day still shows 💤. Keep the board honest.</footer>
    </div>
  );
}
