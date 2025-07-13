document.addEventListener("DOMContentLoaded", function () {
	//accessing HTML ele
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-level");
  const mediumLabel = document.getElementById("medium-level");
  const hardLabel = document.getElementById("hard-level");

  //username validation
  function validateUserName(username) {
    if (username.trim() === "") {
      alert("Username can't be empty!!");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/; // checking acc to LeetCode regex
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username!!!");
    }
    return isMatching;
  }

  //fetching data from API
  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching User...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }

      const data = await response.json();

      if (data.status === "success") {
        displayUserData(data);
        statsContainer.style.display = "block";
      } else {
        statsContainer.innerHTML = `<p>User not found!</p>`;
      }

    } catch (error) {
      statsContainer.innerHTML = `<p>No data found!!</p>`;
      console.error("Error fetching/displaying data:", error);
    } finally {
      searchButton.textContent = "Search User";
      searchButton.disabled = false;
    }
  }

  //displaying fetched response
  function displayUserData(data) {
	document.querySelector('.stats-container').style.display = 'block';
	document.querySelector('.stats-card').style.display = 'flex';

    const totalEasyQuestions = data.totalEasy;
    const totalMediumQuestions = data.totalMedium;
    const totalHardQuestions = data.totalHard;

    const solvedTotalEasyQuestions = data.easySolved;
    const solvedTotalMediumQuestions = data.mediumSolved;
    const solvedTotalHardQuestions = data.hardSolved;

    updateProgress(solvedTotalEasyQuestions, totalEasyQuestions, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQuestions, totalMediumQuestions, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQuestions, totalHardQuestions, hardLabel, hardProgressCircle);

	// Populate cards
	document.getElementById("total-submissions").textContent = `Total Submissions: ${data.totalSolved}`;
	document.getElementById("easy-submissions").textContent = `Easy Submissions: ${data.easySolved}`;
	document.getElementById("medium-submissions").textContent = `Medium Submissions: ${data.mediumSolved}`;
	document.getElementById("hard-submissions").textContent = `Hard Submissions: ${data.hardSolved}`;
  }

  // updating the progress circles
  function updateProgress(solved, total, label, circle) {
    if (!label || !circle) {
      console.warn("Missing DOM element");
      return;
    }
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  // activating search btn related functionalities
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("fetching user name: ", username);
    if (validateUserName(username)) {
      fetchUserDetails(username);
    }
  });
});
