const API_URL = "https://api.github.com/users/";
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const reposContainer = document.getElementById("repos-container");
const chips = document.querySelectorAll(".chip");
async function getUser(username) {
  try {
    const response = await fetch(API_URL + username);
    if (!response.ok) {
      throw new Error("User not found");
    }
    const data = await response.json();
    renderProfile(data);
    getRepos(username);
  } catch (error) {
    profileContainer.innerHTML = `<div class="card"><h2 style="color: red;">User Not Found!</h2></div>`;
    reposContainer.innerHTML = "";
  }
}
function renderProfile(user) {
  const profileHTML = `
    <div class="card">
        <div class="img-container"><img src="${user.avatar_url}" alt="${user.name}"></div>
        <div class="user-info">
            <h2>${user.name || user.login}</h2>
            <span class="username">@${user.login}</span>
            <p>${user.bio || "No bio available"}</p>
            <div class="stats">
                <span><strong>${user.public_repos}</strong> repos</span>
                <span><strong>${user.followers}</strong> followers</span>
                <span><strong>${user.following}</strong> following</span>
            </div>

        </div>
    </div>`;
  profileContainer.innerHTML = profileHTML;
}

async function getRepos(username) {
  try {
    const response = await fetch(
      API_URL + username + "/repos?sort=created&per_page=6",
    );
    const repos = await response.json();
    let reposHTML = `<h2 class="repos-header">Latest repositories</h2><div class="repos-grid">`;
    repos.forEach((repo) => {
      reposHTML += `
            <div class="repo-card">
                    <h3><a href="${repo.html_url}" target="_blank" style="color: inherit; text-decoration: none;">${repo.name}</a></h3>
                    <p>${repo.description || "No description"}</p>
                    <span class="stars">⭐ ${repo.stargazers_count}</span>
            </div>`;
    });
    reposHTML += `</div>`;
    reposContainer.innerHTML = reposHTML;
  } catch (error) {
    console.error("Error fetching repos", error);
  }
}
searchBtn.addEventListener("click", () => {
  const username = searchInput.value;
  if (username) {
    getUser(username);
  }
});
searchInput.addEventListener("keypress", () => {
  if (e.key === "Enter") {
    const username = searchInput.value;
    if (username) {
      getUser(username);
    }
  }
});
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const username = chip.getAttribute("data-user");
    searchInput.value = username;
    getUser(username);
  });
});
