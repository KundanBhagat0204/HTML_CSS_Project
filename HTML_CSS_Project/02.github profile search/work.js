const url = "https://api.github.com/users"; // Correct API URL
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");
const profileContainerEl = document.getElementById("profileContainer");
const loadingEl = document.getElementById("loading");

// Function to generate profile card
const generateProfile = (profile) => {
    return `
    <div class="profile-box">
        <div class="top-section">
            <div class="left">
                <div class="avatar">
                    <img src="${profile.avatar_url}" alt="avatar" />
                </div>
                <div class="self">
                    <h1>${profile.name || "No Name Available"}</h1>
                    <h2>@${profile.login}</h2>
                </div>
            </div>
            <a href="${profile.html_url}" target="_blank">
                <button class="searchBtn">Check Profile</button>
            </a>
        </div>
        <div class="about">
            <h2>About</h2>
            <p>${profile.bio || "No bio available"}</p>
        </div>
        <div class="status">
            <div class="status-item">
                <h3>Followers</h3>
                <p>${profile.followers}</p>
            </div>
            <div class="status-item">
                <h3>Following</h3>
                <p>${profile.following}</p>
            </div>
            <div class="status-item">
                <h3>Repos</h3>
                <p>${profile.public_repos}</p>
            </div>
        </div>
    </div>`;
};

// Function to fetch GitHub profile
const fetchProfile = async (event) => {
    event.preventDefault(); // Prevent form submission

    const username = searchInputEl.value.trim();

    if (!username) {
        loadingEl.innerText = "Please enter a username";
        loadingEl.style.color = "red";
        profileContainerEl.innerHTML = "";
        return;
    }

    loadingEl.innerText = "Searching...";
    loadingEl.style.color = "black";

    try {
        const res = await fetch(`${url}/${username}`);

        if (!res.ok) {
            throw new Error(`User not found (Status: ${res.status})`);
        }

        const data = await res.json();
        console.log("GitHub API Response:", data); // Debugging step
        profileContainerEl.innerHTML = generateProfile(data);
        loadingEl.innerText = "";
    } catch (error) {
        console.error("Error fetching user:", error);
        loadingEl.innerText = "User not found! Please check the username.";
        loadingEl.style.color = "red";
        profileContainerEl.innerHTML = "";
    }
};

// Event listener for search button
searchButtonEl.addEventListener("click", fetchProfile);

// Allow pressing "Enter" to search
searchInputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchProfile(event);
    }
});
let btnmode=document.querySelector("#mode");
let body=document.querySelector("body");
let currMode="light";
btnmode.addEventListener("click",()=>{
    if (currMode==="light") {
        currMode="dark";
        body.classList.add("dark");
        body.classList.remove("light");
    }else{
        currMode="light";
        body.classList.add("light");
        body.classList.remove("dark");
    }

    console.log(currMode);
});