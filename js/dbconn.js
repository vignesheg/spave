import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";

import { 
    getAuth, createUserWithEmailAndPassword, sendEmailVerification, 
    signInWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { 
    getDatabase, ref, set, get, update, onValue 
} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgPxkEiG6AdyeL-ciyflhMkRZeCHO-LF8",
    authDomain: "spave-215af.firebaseapp.com",
    projectId: "spave-215af",
    storageBucket: "spave-215af.appspot.com",
    messagingSenderId: "337436272091",
    appId: "1:337436272091:web:951fdd078824a5f28d73fe",
    measurementId: "G-3L5W2R65YP",
    databaseURL: "https://spave-215af-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

/**
 * Function to get Firebase authentication token
 */
async function getAuthToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();  // Get authentication token
    } else {
        throw new Error("User not authenticated");
    }
}

/**
 * Register a new user
 */
$("#registerBtn").click(function () {
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    let displayValue = $("#displayName").val().trim();
    let messageBox = $("#message");

    if (!email.includes("@") || !email.includes(".") || email === "") {
        messageBox.text("Enter a valid email address.");
        return;
    }
    if (password === "") {
        messageBox.text("Enter a Password.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            let user = userCredential.user;
            updateDisplayName(displayValue);
            await sendEmailVerification(user);
            messageBox.css("color", "green").text("Verification email sent! Check your inbox.");
        })
        .catch(() => {
            messageBox.text("Enter a valid email");
        });
});

/**
 * Login user and store authentication token
 */
$("#signinForm").submit(async function (e) {
    e.preventDefault();

    let email = $("#log-email").val();
    let password = $("#log-password").val();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        let user = userCredential.user;

        if (user.emailVerified) {
            const token = await getAuthToken();  // Fetch token after login
            localStorage.setItem("spave-email", user.uid);
            localStorage.setItem("auth-token", token);  // Store token securely
            
            if (user.displayName == null) {
                $("#log-form-div").slideUp();
                $("#dispname").slideDown();
            } else {
                localStorage.setItem("spave-name", user.displayName);
                window.location.href = "/";
            }
        } else {
            $("#message-signin").text("Please verify your email before logging in.");
        }
    } catch (error) {
        $("#message-signin").text("Invalid email or Password");
    }
});

/**
 * Submit team registration data with authentication token
 */
$("#teamForm").submit(async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("auth-token");  // Get stored auth token
    if (!token) {
        alert("Authentication token missing. Please login again.");
        return;
    }

    const teamHead = { name: $("#headName").val(), rollNo: $("#headRollNo").val() };
    const member2 = { name: $("#member2Name").val(), rollNo: $("#member2RollNo").val() };
    const member3 = { name: $("#member3Name").val(), rollNo: $("#member3RollNo").val() };
    
    const upiid = $("#upiid").val();
    const event = $("#event").val();
    const dept = $("#department").val();
    const collegeval = $("#college").val();
    const titleevent = $("#title").val();
    const phonenumber = $("#phnnumber").val();

    let teamData = {
        details: {
            head: teamHead,
            member2: member2,
            member3: event === "poster" ? null : member3,
            title: titleevent,
            upi: upiid,
            department: dept,
            college: collegeval,
            verified: false,
            phone: phonenumber,
        }
    };

    const userEmail = localStorage.getItem("spave-email").replace(/\./g, '_'); 
    const teamRef = ref(db, `teams/${userEmail}/events/${event}`);

    try {
        await set(teamRef, teamData);
        alert("Slot Requested. Check 'My Account' for status.");
        $("#teamForm")[0].reset();
    } catch (error) {
        console.error("Error submitting data: ", error);
    }
});

/**
 * Logout functionality
 */
$("#logout").click(function() {
    signOut(auth).then(() => {
        localStorage.removeItem("spave-email"); 
        localStorage.removeItem("auth-token");  // Remove token
        localStorage.removeItem("spave-name"); 
        alert("Logged out successfully!");
        window.location.href = "../";
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
    $("#logoutModal").modal('hide');
});
$("#logoutoffcanv").click(function() {
    signOut(auth).then(() => {
        localStorage.removeItem("spave-email"); 
        localStorage.removeItem("auth-token");  // Remove token
        localStorage.removeItem("spave-name"); 
        alert("Logged out successfully!");
        window.location.href = "../";
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
    $("#logoutModal").modal('hide');
});

/**
 * Fetch and display user team data using auth token
 */
async function fetchDataFromDatabase() {
    const token = localStorage.getItem("auth-token");
 

    const userEmail = localStorage.getItem("spave-email").replace(/\./g, '_');
    const userRef = ref(db, `/teams/${userEmail}/events`);

    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const teamDataProfile = document.getElementById('teamDataProfile');
        teamDataProfile.innerHTML = ""; 

        if (data?.poster) {
            const poster = data.poster.details;
            const posterRow = document.createElement('tr');
            posterRow.innerHTML = `<td>${poster.head.name}</td><td>${poster.title}</td><td>${poster.verified ? "Confirmed" : "Not Confirmed"}</td>`;
            teamDataProfile.appendChild(posterRow);
        }

        if (data?.paper) {
            const paper = data.paper.details;
            const paperRow = document.createElement('tr');
            paperRow.innerHTML = `<td>${paper.head.name}</td><td>${paper.title}</td><td>${paper.verified ? "Confirmed" : "Not Confirmed"}</td>`;
            teamDataProfile.appendChild(paperRow);
        }
    });
}

fetchDataFromDatabase();

// Function to update display name
    function updateDisplayName(newDisplayName) {
        const user = auth.currentUser;
        if (user) {
            updateProfile(user, {
                displayName: newDisplayName
            }).then(() => {
                // Success
                console.log("Display name updated successfully.");
                $("#errordisp").text("Display name updated successfully!");
                localStorage.setItem("spave-name", user.displayName);
               window.location.href = "../"
            }).catch((error) => {
                // Handle errors
                
                $("#errordisp").text("Error updating display name: ");
            });
        } else {
            console.log("No user is logged in.");
            $("#errordisp").text("No user is logged in.");
        }
    }

    $("#nextBtn_dispName").click(()=>{
        let displayValue = $("#displayNameForm").val().trim()
        updateDisplayName(displayValue);
    })

    //reset password
    $("#resetPassword").click(function () {
        let email = $("#log-email").val().trim();
    
        if (!email) {
            $("#message-signin").text("Please enter an email").css("color", "red");
            return;
        }
    
        
        // Firebase Password Reset
        sendPasswordResetEmail(auth, email)
            .then(() => {
                document.getElementById("message-signin").innerText = "Password reset email sent!";
                document.getElementById("message-signin").style.color = "green";
            })
            .catch((error) => {
                document.getElementById("message-signin").innerText = error.message;
                document.getElementById("message-signin").style.color = "red";
            });
    });
    
console.log("db connected");
