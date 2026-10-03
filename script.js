document.addEventListener("DOMContentLoaded", function () {

    const searchButton =
        document.getElementById("searchButton");

    const usernameInput =
        document.getElementById("username");


    // ==============================
    // ELEMENTS
    // ==============================

    const loading =
        document.getElementById("loading");

    const errorMessage =
        document.getElementById("errorMessage");


    const profileUsername =
        document.getElementById("profileUsername");

    const realName =
        document.getElementById("realName");

    const ranking =
        document.getElementById("ranking");

    const userAvatar =
        document.getElementById("userAvatar");


    const totalSolved =
        document.getElementById("totalSolved");

    const totalProblems =
        document.getElementById("totalProblems");

    const overallBar =
        document.getElementById("overallBar");

    const overallPercentage =
        document.getElementById("overallPercentage");


    const easyLabel =
        document.getElementById("easy-label");

    const mediumLabel =
        document.getElementById("medium-label");

    const hardLabel =
        document.getElementById("hard-label");


    const easySolved =
        document.getElementById("easySolved");

    const mediumSolved =
        document.getElementById("mediumSolved");

    const hardSolved =
        document.getElementById("hardSolved");


    const easyTotal =
        document.getElementById("easyTotal");

    const mediumTotal =
        document.getElementById("mediumTotal");

    const hardTotal =
        document.getElementById("hardTotal");


    const easyPercentage =
        document.getElementById("easyPercentage");

    const mediumPercentage =
        document.getElementById("mediumPercentage");

    const hardPercentage =
        document.getElementById("hardPercentage");


    const easyCircle =
        document.getElementById("easyCircle");

    const mediumCircle =
        document.getElementById("mediumCircle");

    const hardCircle =
        document.getElementById("hardCircle");


    const rankingCard =
        document.getElementById("rankingCard");

    const reputation =
        document.getElementById("reputation");

    const country =
        document.getElementById("country");

    const company =
        document.getElementById("company");


    // ==============================
    // VALIDATE USERNAME
    // ==============================

    function validateUsername(username) {

        if (username.trim() === "") {

            alert("Please enter a LeetCode username.");

            return false;
        }


        const regex =
            /^[a-zA-Z0-9-]{1,15}$/;


        if (!regex.test(username)) {

            alert(
                "Invalid LeetCode username."
            );

            return false;
        }


        return true;

    }


    // ==============================
    // FORMAT NUMBER
    // ==============================

    function formatNumber(number) {

        return Number(number || 0)
            .toLocaleString();

    }


    // ==============================
    // PERCENTAGE
    // ==============================

    function calculatePercentage(
        solved,
        total
    ) {

        if (!total) {

            return 0;

        }


        return (
            (solved / total) * 100
        );

    }


    // ==============================
    // UPDATE CIRCLE
    // ==============================

    function updateCircle(
        circle,
        percentage
    ) {

        circle.style.setProperty(
            "--percentage",
            `${percentage}%`
        );

    }


    // ==============================
    // FETCH USER DETAILS
    // ==============================

    async function fetchUserDetails(username) {

        try {

            // Loading

            loading.classList.remove("hidden");

            errorMessage.classList.add("hidden");

            searchButton.textContent =
                "Searching...";

            searchButton.disabled = true;


            // Reset

            profileUsername.textContent =
                "Loading...";


            const response =
                await fetch(
                    `/api/leetcode/${username}`
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch user data."
                );

            }


            const data =
                await response.json();


            console.log(
                "LeetCode Data:",
                data
            );


            // ==============================
            // USER
            // ==============================

            const user =
                data?.data?.matchedUser;


            if (!user) {

                throw new Error(
                    "User not found."
                );

            }


            // ==============================
            // PROFILE
            // ==============================

            const profile =
                user.profile || {};


            profileUsername.textContent =
                user.username;


            realName.textContent =
                profile.realName ||
                "LeetCode Developer";


            ranking.textContent =
                profile.ranking
                    ? `#${formatNumber(profile.ranking)}`
                    : "N/A";


            rankingCard.textContent =
                profile.ranking
                    ? `#${formatNumber(profile.ranking)}`
                    : "N/A";


            reputation.textContent =
                formatNumber(
                    profile.reputation
                );


            country.textContent =
                profile.countryName ||
                "Not specified";


            company.textContent =
                profile.company ||
                "Not specified";


            // Avatar

            if (profile.userAvatar) {

                userAvatar.innerHTML = `
                    <img
                        src="${profile.userAvatar}"
                        alt="User avatar"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            border-radius:50%;
                        "
                    >
                `;

            }


            // ==============================
            // SOLVED STATS
            // ==============================

            const stats =
                user
                    ?.submitStatsGlobal
                    ?.acSubmissionNum || [];


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


            // ==============================
            // TOTAL PROBLEMS
            // ==============================

            const questionCounts =
                data?.data?.allQuestionsCount || [];


            const easyTotalValue =
                questionCounts.find(
                    item =>
                        item.difficulty === "Easy"
                )?.count || 0;


            const mediumTotalValue =
                questionCounts.find(
                    item =>
                        item.difficulty === "Medium"
                )?.count || 0;


            const hardTotalValue =
                questionCounts.find(
                    item =>
                        item.difficulty === "Hard"
                )?.count || 0;


            const total =
                easy + medium + hard;


            const totalAvailable =
                easyTotalValue +
                mediumTotalValue +
                hardTotalValue;


            // ==============================
            // PERCENTAGES
            // ==============================

            const easyPercent =
                calculatePercentage(
                    easy,
                    easyTotalValue
                );


            const mediumPercent =
                calculatePercentage(
                    medium,
                    mediumTotalValue
                );


            const hardPercent =
                calculatePercentage(
                    hard,
                    hardTotalValue
                );


            const overallPercent =
                calculatePercentage(
                    total,
                    totalAvailable
                );


            // ==============================
            // TOTAL
            // ==============================

            totalSolved.textContent =
                formatNumber(total);


            totalProblems.textContent =
                ` / ${formatNumber(totalAvailable)}`;


            overallPercentage.textContent =
                `${overallPercent.toFixed(1)}%`;


            overallBar.style.width =
                `${Math.min(overallPercent, 100)}%`;


            // ==============================
            // EASY
            // ==============================

            easyLabel.textContent =
                formatNumber(easy);


            easySolved.textContent =
                formatNumber(easy);


            easyTotal.textContent =
                ` / ${formatNumber(easyTotalValue)}`;


            easyPercentage.textContent =
                `${easyPercent.toFixed(1)}%`;


            updateCircle(
                easyCircle,
                easyPercent
            );


            // ==============================
            // MEDIUM
            // ==============================

            mediumLabel.textContent =
                formatNumber(medium);


            mediumSolved.textContent =
                formatNumber(medium);


            mediumTotal.textContent =
                ` / ${formatNumber(mediumTotalValue)}`;


            mediumPercentage.textContent =
                `${mediumPercent.toFixed(1)}%`;


            updateCircle(
                mediumCircle,
                mediumPercent
            );


            // ==============================
            // HARD
            // ==============================

            hardLabel.textContent =
                formatNumber(hard);


            hardSolved.textContent =
                formatNumber(hard);


            hardTotal.textContent =
                ` / ${formatNumber(hardTotalValue)}`;


            hardPercentage.textContent =
                `${hardPercent.toFixed(1)}%`;


            updateCircle(
                hardCircle,
                hardPercent
            );


        }


        catch (error) {

            console.error(
                "Error:",
                error
            );


            errorMessage.textContent =
                error.message === "User not found."
                    ? "User not found. Please check the username."
                    : "Unable to load LeetCode data.";


            errorMessage.classList.remove(
                "hidden"
            );


            profileUsername.textContent =
                "Search a user";

        }


        finally {

            loading.classList.add(
                "hidden"
            );


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


            if (!validateUsername(username)) {

                return;

            }


            await fetchUserDetails(
                username
            );

        }
    );


    // ==============================
    // ENTER KEY
    // ==============================

    usernameInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchButton.click();

            }

        }
    );

});