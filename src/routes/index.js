import Dashboard from "../pages/Admin/Dashboard";
import History from "../pages/Admin/History";
import Players from "../pages/Admin/Players";
import Prizes from "../pages/Admin/Prizes";
import Settings from "../pages/Admin/Settings";
import Login from "../pages/Auth/Login";
import MysteryBox from "../pages/Player/MysteryBox";
import Profile from "../pages/Player/Profile";
import SpinHistory from "../pages/Player/SpinHistory";
import UnboxingHistory from "../pages/Player/UnboxingHistory";
import Wallet from "../pages/Player/Wallet";

export const routes = [
  {
    path: "/",
    page: Login,
  },

  // admin
  {
    path: "/admin",
    page: Dashboard,
  },

  {
    path: "/admin/players",
    page: Players,
  },

  {
    path: "/admin/prizes",
    page: Prizes,
  },

  {
    path: "/admin/history",
    page: History,
  },

  {
    path: "/admin/settings",
    page: Settings,
  },

  // Player
  {
    path: "/player/mysteryBox",
    page: MysteryBox,
  },

  {
    path: "/player/spinHistory",
    page: SpinHistory,
  },

  {
    path: "/player/unboxing-history",
    page: UnboxingHistory,
  },

  {
    path: "/player/wallet",
    page: Wallet,
  },

  {
    path: "/player/profile",
    page: Profile,
  },
];
