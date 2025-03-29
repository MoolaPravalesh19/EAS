// if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//         export const latitude = position.coords.latitude;
//         var longitude = position.coords.longitude;
//     });


// }

// const checkInBtn = document.getElementById("checkInBtn");
// const checkOutBtn = document.getElementById("checkOutBtn");
// const employeeNameInput = document.getElementById("employeeName");

// checkInBtn.addEventListener("click", () => {

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       console.log(latitude);
//       console.log(longitude);
//       const currentdate = new Date();
//       const intime = currentdate.getHours() + ":"
//         + currentdate.getMinutes() + ":" + currentdate.getSeconds();
//       const date = currentdate.toLocaleDateString();
//       const apiURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

//       fetch(apiURL)
//         .then((response) => response.json())
//         .then((data) => {
//           const city = data.city || data.address.city || "Unknown City"; // Fallback if city is not available

//           const dataToPost = {
//             latitude: latitude,
//             longitude: longitude,
//             name: employeeNameInput.value,
//             intime: intime,
//             date: date,
//             city: city,
            
//           };
//           fetch('/checkin', { // Replace with your actual endpoint
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(dataToPost),
//           })
//         });
//     });
//   }

// });

// checkOutBtn.addEventListener("click", () => {
//   const currentdate = new Date();
//   const outtime = currentdate.getHours() + ":"
//     + currentdate.getMinutes() + ":" + currentdate.getSeconds();

//     const dataToPost = {
//       name: employeeNameInput.value,
//       outtime: outtime,
//     };
    
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(function (position) {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         console.log(latitude);
//         console.log(longitude);
//         const currentdate = new Date();
//         const intime = currentdate.getHours() + ":"
//           + currentdate.getMinutes() + ":" + currentdate.getSeconds();
//         const date = currentdate.toLocaleDateString();
//         const apiURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  
//         fetch(apiURL)
//           .then((response) => response.json())
//           .then((data) => {
//             const city = data.city || data.address.city || "Unknown City"; // Fallback if city is not available
  
//             const dataToPost = {
//               latitude: latitude,
//               longitude: longitude,
//               name: employeeNameInput.value,
//               outtime:outtime,
//               date: date,
//               city: city,
              
//             };
//             fetch('/checkout', { // Replace with your actual endpoint
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(dataToPost),
//             })
//               .then(response => {
//                 if (!response.ok) {
//                   throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//               })
//               .then(data => {
//                 console.log('Success:', data);
//                 // Handle success (e.g., show a message to the user)
//               })
//               .catch((error) => {
//                 console.error('Error:', error);
//                 // Handle error (e.g., show an error message to the user)
//               });
//           });
//       });
//     }
    
// })


// const getCoordinates = () => {
//   return new Promise((resolve, reject) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     } else {
//       reject(new Error("Geolocation is not supported by this browser."));
//     }
//   });
// };
// console.log(getCoordinates());
// exports = { getCoordinates };
// Function to get GEO location and populate the form fields
// Function to get GEO location and populate the form fields
function getLocation(isCheckIn) {
  if (!document.getElementById("employeeName").value) {
      alert("Please enter employee name");
      return;
  }

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const currentDate = new Date();
          const intime = currentDate.getHours() + ":"
           + currentDate.getMinutes() + ":" + currentDate.getSeconds();
          console.log(latitude);

          // Get city name using reverse geocoding API
          const apiURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

          fetch(apiURL)
              .then((response) => response.json())
              .then((data) => {
                  const cityName = data.address.city || data.address.town || data.address.village || "Unknown City";

                  if (isCheckIn) {
                      // Populate check-in form fields
                      document.getElementById("latitudeIn").value = latitude;
                      document.getElementById("longitudeIn").value = longitude;
                      document.getElementById("cityIn").value = cityName;
                      document.getElementById("intime").value = intime;
                      document.getElementById("dateIn").value = currentDate.toLocaleDateString();
                      // Submit the check-in form
                      document.getElementById("checkInForm").submit();
                  } else {
                      // Populate check-out form fields
                      document.getElementById("latitudeOut").value = latitude;
                      document.getElementById("longitudeOut").value = longitude;
                      document.getElementById("cityOut").value = cityName;
                      document.getElementById("outtime").value = currentTime;
                      document.getElementById("dateOut").value = currentDate.toLocaleDateString();
                      // Submit the check-out form
                      document.getElementById("checkOutForm").submit();
                  }
              })
              .catch((error) => {
                  console.error("Error fetching city name: ", error);
              });
      });
  } else {
      alert("Geolocation is not supported by this browser.");
  }
}

// Event listeners for Check-In and Check-Out buttons
document.getElementById("checkInBtn").addEventListener("click", () => getLocation(true));
document.getElementById("checkOutBtn").addEventListener("click", () => getLocation(false));