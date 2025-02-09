import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile, signOut,sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, onValue,set,get,update } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js';
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgPxkEiG6AdyeL-ciyflhMkRZeCHO-LF8",
    authDomain: "spave-215af.firebaseapp.com",
    projectId: "spave-215af",
    storageBucket: "spave-215af.appspot.com",
    messagingSenderId: "337436272091",
    appId: "1:337436272091:web:951fdd078824a5f28d73fe",
    measurementId: "G-3L5W2R65YP",
    databaseURL: "https://spave-215af-default-rtdb.firebaseio.com" // Add this line for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getDatabase(app);




function hashEmail(email) {
    // Preprocess the email (convert to lowercase and remove non-alphabet characters)
    const processedEmail = email.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    // Create SHA256 hash using jsSHA library
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(processedEmail);  // Update with the processed email
    var hash = shaObj.getHash("HEX");  // Get the hash in HEX format
    return hash;
}

// Example usage
const email = localStorage.getItem("spave-email"); // Retrieve the email
if(email != null){
const hshedmail = hashEmail(email);  // Get the hashed email
localStorage.setItem("spave-hashed",hshedmail)
}
//console.log(hshedmail);  // Logs the hashed email

// Register Button Click Event
$("#registerBtn").click(function () {
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    let messageBox = $("#message");

    if (!email.includes("@") || !email.includes(".") || email == "") {
        messageBox.text("Enter a valid email address.");
        return;
    }
    if(password == "") {
        messageBox.text("Enter a Password.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            
            sendEmailVerification(user)
                .then(() => {
                    messageBox.css("color", "green").text("Verification email sent! Check your inbox.");
                })
                .catch((error) => {
                    messageBox.text("Enter Valid email");
                });
        })
        .catch((error) => {
            messageBox.text("Enter valid email");
        });
});

$("#signinForm").submit(function (e) {
    e.preventDefault();

    let email = $("#log-email").val();
    let password = $("#log-password").val();
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            if (user.emailVerified) {
                localStorage.setItem("spave-email", email);
                
                if (user.displayName == null) {
                    $("#log-form-div").slideUp();
                    $("#dispname").slideDown();
                } else {
                    localStorage.setItem("spave-name", user.displayName);
                    window.location.href = "/spave/";
                }
            } else {
                $("#message-signin").text("Please verify your email before logging in.");
            }
        })
        .catch((error) => {
            $("#message-signin").text("Invalid email or Password");
        });
});

$("#teamForm").submit(function (e) {
    e.preventDefault();
    
    const teamHead = {
        name: $("#headName").val(),
        
        
        rollNo: $("#headRollNo").val(),
        
    };
    const member2 = {
        name: $("#member2Name").val(),
        
        rollNo: $("#member2RollNo").val(),
        
    };
    const member3 = {
        name: $("#member3Name").val(),
        
        rollNo: $("#member3RollNo").val(),

    };

    const upiid = $("#upiid").val();
    const event = $("#event").val();
    const dept = $("#department").val();
    const collegeval = $("#college").val();
    const titleevent = $("#title").val()
    const phonenumber = $("#phnnumber").val()

    if (event === "poster" && (member3.name != "" || !member3.email != "")) {
       
    let teamData = {
        hshedmail: {
            head: teamHead,
            member2: member2,
            member3: event === "poster" ? null : member3,
            title: titleevent,
            upi: upiid,
            verified: false,
            phone:phonenumber,
        }
    };
    }

    let teamData = {
        details: {
            head: teamHead,
            member2: member2,
            member3: event === "poster" ? null : member3,
            title: titleevent,
            upi: upiid,
            department:dept,
            college:collegeval,
            verified: false,
            phone:phonenumber,
        }
    };
    
    const userEmail = localStorage.getItem("spave-hashed").replace(/\./g, '_'); // Replace dots with underscores for valid path
    const teamRef = ref(db, `teams/${userEmail}/events/${event}`);
    
    set(teamRef, teamData)
        .then(() => {
            alert("Slot Requested after payment verification your slot will be booked kindly check My account for status");
            $("#teamForm")[0].reset();
        })
        .catch((error) => {
            console.error("Error submitting data: ");
        });
});


//add display name

    
    // Function to update display name
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
                window.location.href = "/spave/"
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
        let displayValue = $("#displayName").val().trim()
        console.log(displayValue)
        updateDisplayName(displayValue)
    })

    // Attach event listeners for verification and cancel buttons
    $(".verifyBtn").click(async function() {
        const docId = $(this).data("id");
        const currentStatus = $(this).data("verified");
        const teamRef = ref(db, `teams/${docId}`);
        
        try {
            await update(teamRef, { verified: !currentStatus });
            fetchTeams();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    });

    $(".cancel-btn").click(async function() {
        const docId = $(this).data("id");
        if (confirm("Are you sure you want to delete this record?")) {
            const teamRef = ref(db, `teams/${docId}`);
            try {
                await remove(teamRef);
                $(this).closest("tr").remove();
                alert("Team data deleted successfully!");
            } catch (error) {
                console.error("Error deleting team:", error);
            }
        }
    });

// Logout functionality
$("#logout").click(function() {
    signOut(auth).then(() => {
        
        localStorage.removeItem("spave-email"); 
        localStorage.removeItem("spave-hashed"); 
        localStorage.removeItem("spave-name"); 
        alert("Logged out successfully!");
        window.location.href = "/spave/";
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
    $("#logoutModal").modal('hide');
});

// // profile data
function fetchDataFromDatabase(userEmail) {
    const userRef = ref(db, `/teams/${userEmail}/events`);
  
    // Use onValue to listen for changes
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      
      // Get the tbody element where data will be displayed
      const teamDataProfile = document.getElementById('teamDataProfile');
      teamDataProfile.innerHTML = ""; // Clear any existing rows before adding new ones
  
      // Check if 'poster' exists and display its details
      if (data.hasOwnProperty("poster")) {
        const poster = data.poster.details;
        const posterRow = document.createElement('tr');
        
        posterRow.innerHTML = `
          
          <td>${poster.head.name}</td>
          <td>${poster.title}</td>
          <td>${poster.verified==true?"Confirmed":"Not Confirmed"}</td>
        `;
        
        teamDataProfile.appendChild(posterRow);
      }
  
      // Check if 'paper' exists and display its details
      if (data.hasOwnProperty("paper")) {
        const paper = data.paper.details;
        const paperRow = document.createElement('tr');
        
        paperRow.innerHTML = `
          
          <td>${paper.head.name}</td>
          <td>${paper.title}</td>
          <td>${paper.verified==true?"Confirmed":"Not Confirmed"}</td>
        `;
        
        teamDataProfile.appendChild(paperRow);
      }
  
      // Check if 'project' exists and display its details
      if (data.hasOwnProperty("project")) {
        const project = data.project.details;
        const projectRow = document.createElement('tr');
        
        projectRow.innerHTML = `
          
          <td>${project.head.name}</td>
          <td>${project.title}</td>
          <td>${project.verified==true?"Confirmed":"Not Confirmed"}</td>
        `;
        
        teamDataProfile.appendChild(projectRow);
      }
    });
  }
  
  
  // Example usage: Call the fetchDataFromDatabase function with a user email hash
  const userEmail = localStorage.getItem("spave-hashed"); // Replace with the hashed email or other identifier
  fetchDataFromDatabase(userEmail);


  //reset password
  $("#resetPassword").click(function () {
    let email = $("#log-email").val().trim();
//    console.log("clicked");
//    console.log(email);
   
    if (!email) {
        $("#message-signin").text("Please enter an email").css("color", "red");
        return;
    }

    // Firebase Password Reset
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

