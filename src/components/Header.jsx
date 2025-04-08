import React, { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import LanguageSelector from "./LanguageSelector";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { ThemeContext } from "../contexts/ThemeContext";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faCheck } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";

const Header = () => {
  const { selectedCategory } = useContext(AppContext);
  const location = useLocation();
  const { currentTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "FactBurst";
    if (path === "/facts") {
      return selectedCategory
        ? `${
            selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
          } Facts`
        : "Random Facts";
    }
    if (path === "/favorites") return "Favorite Facts";
    return "FactBurst";
  };

  // Inside your Header component, add these state variables
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  // Add this function to your Header component
  const handleResetApp = () => {
    console.log("Resetting app data...");
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    // Clear all localStorage data
    localStorage.removeItem("factStreakData");
    localStorage.removeItem("factProgressData");
    localStorage.removeItem("factFavorites");
    localStorage.removeItem("factCollections");
    localStorage.removeItem("language");
    localStorage.removeItem("theme");
    localStorage.removeItem("viewedFactIds");

    // Clear all sessionStorage data
    sessionStorage.clear();

    // Show success message
    setShowResetConfirm(false);
    setResetComplete(true);

    // Hide success message after 2 seconds and reload page
    setTimeout(() => {
      setResetComplete(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <header
        className={`${currentTheme.navBg} shadow-elegant sticky top-0 z-10 backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-secondary-900">
            {getTitle()}
          </h1>
          <button
            onClick={handleResetApp}
            className="text-sm px-2 py-1 rounded bg-white text-gray-600 hover:bg-gray-100 flex items-center"
            title="Reset app to initial state"
          >
            <FontAwesomeIcon icon={faRedo} className="mr-1" />
            <span>Reset App</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/streak")}
              className={`px-4 py-2 rounded-full ${currentTheme.primaryColor} text-white flex items-center justify-center mx-auto`}
            >
              <FontAwesomeIcon icon={faFire} className="mr-2" />
              Steaks
            </button>
            <ThemeSwitcher />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Render the modal using React Portal */}
      {showResetConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 transform translate-y-[-50%] top-1/2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Reset App Data?
              </h3>
              <p className="text-gray-600 mb-4">
                This will clear all your progress, streaks, favorites, and
                settings. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </div>,
          document.body // The modal will be appended to the body
        )}

      {resetComplete &&
        createPortal(
          <div className="fixed bg-green-500 text-white z-50 px-4 py-2 rounded-full shadow-lg flex items-center">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Reset successful!
          </div>,
          document.body
        )}
    </>
  );
};

export default Header;
