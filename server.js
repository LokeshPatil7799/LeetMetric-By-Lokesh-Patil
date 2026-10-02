const express = require("express");

const app = express();


// ==============================
// PORT
// ==============================

const PORT = process.env.PORT || 3000;


// ==============================
// SERVE FRONTEND FILES
// ==============================

app.use(express.static(__dirname));


// ==============================
// LEETCODE API
// ==============================

app.get("/api/leetcode/:username", async (req, res) => {

    const username = req.params.username;

    try {

        const query = `
            query userProfile($username: String!) {

                matchedUser(username: $username) {

                    username

                    profile {

                        realName
                        userAvatar
                        ranking
                        reputation
                        aboutMe
                        school
                        countryName
                        company

                    }

                    submitStatsGlobal {

                        acSubmissionNum {

                            difficulty
                            count
                            submissions

                        }

                    }

                }

            }
        `;


        const response = await fetch(
            "https://leetcode.com/graphql/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0"
                },

                body: JSON.stringify({

                    query: query,

                    variables: {
                        username: username
                    }

                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `LeetCode returned ${response.status}`
            );

        }


        const data = await response.json();


        console.log(
            "LeetCode Response:",
            data
        );


        res.json(data);

    }


    catch (error) {

        console.error(
            "Server Error:",
            error
        );


        res.status(500).json({

            error: "Unable to fetch LeetCode data"

        });

    }

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`LeetMetric running on port ${PORT}`);
});