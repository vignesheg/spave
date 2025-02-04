
// Function to fetch data from the Firebase Realtime Database
function fetchDataFromDatabase(userEmail) {
  const userRef = ref(db, `/teams/${userEmail}`);

  // Use onValue to listen for changes
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Fetched data from 'teams' node:", data);

    // Output data to the HTML
    document.getElementById('data-output').innerHTML = JSON.stringify(data, null, 2);
  });
}

// Example usage: Call the fetchDataFromDatabase function with a user email hash
const userEmail = localStorage.getItem("spave-hashed"); // Replace with the hashed email or other identifier
fetchDataFromDatabase(userEmail);
