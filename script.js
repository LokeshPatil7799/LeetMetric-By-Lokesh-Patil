document.addEventListener("DOMContentLoaded", function () {

    const searchButton =
        document.getElementById("searchButton");

    const usernameInput =
        document.getElementById("username");

    const easyProgressCircle =
        document.querySelector(".easy-progress");

    const mediumProgressCircle =
        document.querySelector(".medium-progress");

    const hardProgressCircle =
        document.querySelector(".hard-progress");

    const easyLabel =
        document.getElementById("easy-label");

    const mediumLabel =
        document.getElementById("medium-label");

    const hardLabel =
        document.getElementById("hard-label");

    const cardStatsContainer =
        document.querySelector(".stats-cards");


    // ==============================
    // VALIDATE USERNAME
    // ==============================

    function validateUsername(username) {

        if (username.trim() === "") {

            alert("Username should not be empty.");

            return false;
        }


        const regex =
            /^[a-zA-Z0-9-]{1,15}$/;


        if (!regex.test(username)) {

            alert("Invalid LeetCode username.");

            return false;
        }


        return true;
    }


    // ==============================
    // FETCH USER DETAILS
    // ==============================

    async function fetchUserDetails(username) {

        try {

            searchButton.textContent =
                "Searching...";

            searchButton.disabled = true;


            // Call our Node.js server

            const response = await fetch(
                `/api/leetcode/${username}`
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch user data"
                );
            }


            const data =
                await response.json();


            console.log(
                "LeetCode Data:",
                data
            );


            // Get user

            const user =
                data?.data?.matchedUser;


            if (!user) {

                cardStatsContainer.innerHTML = `
                    <p class="error">
                        User not found.
                    </p>
                `;

                return;
            }


            // ==============================
            // SUBMISSION STATS
            // ==============================

            const stats =
                user.submitStatsGlobal
                    .acSubmissionNum;


            const easyData =
                stats.find(
                    item =>
                        item.difficulty === "Easy"
                );


            const mediumData =
                stats.find(
                    item =>
                        item.difficulty === "Medium"
                );


            const hardData =
                stats.find(
                    item =>
                        item.difficulty === "Hard"
                );


            const easy =
                easyData?.count || 0;


            const medium =
                mediumData?.count || 0;


            const hard =
                hardData?.count || 0;


            const total =
                easy + medium + hard;


            // ==============================
            // DISPLAY NUMBERS
            // ==============================

            easyLabel.textContent = easy;

            mediumLabel.textContent = medium;

            hardLabel.textContent = hard;


            // ==============================
            // PROGRESS CIRCLES
            // ==============================

            const easyPercentage =
                Math.min(easy, 100);


            const mediumPercentage =
                Math.min(medium, 100);


            const hardPercentage =
                Math.min(hard * 2, 100);


            easyProgressCircle.style
                .setProperty(
                    "--percentage",
                    easyPercentage + "%"
                );


            mediumProgressCircle.style
                .setProperty(
                    "--percentage",
                    mediumPercentage + "%"
                );


            hardProgressCircle.style
                .setProperty(
                    "--percentage",
                    hardPercentage + "%"
                );


            // ==============================
            // PROFILE
            // ==============================

            const profile =
                user.profile;


            // ==============================
            // CARDS
            // ==============================

            cardStatsContainer.innerHTML = `

                <div class="stat-card">

                    <h3>Username</h3>

                    <p>
                        ${user.username}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>Total Solved</h3>

                    <p>
                        ${total}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>Ranking</h3>

                    <p>
                        ${profile.ranking || "N/A"}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>Reputation</h3>

                    <p>
                        ${profile.reputation || 0}
                    </p>

                </div>

            `;

        }


        catch (error) {

            console.error(
                "Error:",
                error
            );


            cardStatsContainer.innerHTML = `
                <p class="error">
                    Unable to load user data.
                </p>
            `;

        }


        finally {

            searchButton.textContent =
                "Search";

            searchButton.disabled =
                false;

        }

    }


    // ==============================
    // SEARCH BUTTON
    // ==============================

    searchButton.addEventListener(
        "click",
        async function () {

            const username =
                usernameInput.value.trim();


            console.log(
                "Entered Username:",
                username
            );


            if (!validateUsername(username)) {

                return;
            }


            await fetchUserDetails(
                username
            );

        }
    );


    // ENTER KEY

    usernameInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchButton.click();

            }

        }
    );

});