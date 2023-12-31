const firebaseConfig = {
  apiKey: "AIzaSyDyT_y75Mkz1vm8_BXm284C0VJda31QxOw",
  authDomain: "laser-pay-4b260.firebaseapp.com",
  databaseURL: "https://laser-pay-4b260-default-rtdb.firebaseio.com",
  projectId: "laser-pay-4b260",
  storageBucket: "laser-pay-4b260.appspot.com",
  messagingSenderId: "1059782615257",
  appId: "1:1059782615257:web:241b7ffbafcc99a8641ec8",
  measurementId: "G-9SQ5CBCHHS",
};

//  line 142 imp

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const newData = {};
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js";
let myuuid;
function createuuid() {
  // The uuid library is now loaded and can be used
  const uuidv4 = uuid.v4;

  myuuid = uuidv4();
  console.log(myuuid);
}

// myuuid = "user11";
//expected cols in table
let expectedColumns = ["name", "id", "email"];
// their can be more than this but these are compulsory

let fileText = document.querySelector(".fileText");
let uploadper = document.querySelector(".upload-percentage");
let progress = document.querySelector(".progress");
let fileItem;
let fileName;
let percentageVal;

function getfile(e) {
  let headerIndex = parseInt(document.getElementById("headerIndex").value);
  if (isNaN(headerIndex)) {
    alert("No header is added it consider first row as head");
    headerIndex = 1;
  }
  console.log("getfile");
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  getTable();
  console.log(fileName);
}

let templet_file;
let temp_name;

function gettemp(e) {
  let imageFile = e.target.files[0];

  // Display the image as a preview
  let imagePreview = document.getElementById("imagePreview");
  let imagePreviewContainer = document.getElementById("imagePreviewContainer");

  // Check if the selected file is an image
  if (imageFile && imageFile.type.startsWith("image/")) {
    let reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);
    imagePreviewContainer.style.display = "block"; // Show the preview container
  } else {
    // If the selected file is not an image, hide the preview container
    imagePreviewContainer.style.display = "none";
    alert("Please select a valid image file (JPEG, JPG, or PNG).");
  }
}

let email_col;
function getTable() {
  let msg = document.getElementById("upload_msg");
  msg.style.backgroundColor = "";
  msg.style.color = "";
  msg.style.fontSize = "";
  msg.style.border = "";

  let fileInput = document.getElementById("inputFile");
  let file = fileInput.files[0]; // Get the selected file

  if (file) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);

      // Convert Excel data to HTML table

      let table = convertExcelToTable(data, expectedColumns, headerIndex);
      if (table == null) {
        console.log("not matched");
      }
      // Append the table to a container element in the HTML
      let container = document.getElementById("table-container");
      container.innerHTML = ""; // Clear previous data
      container.appendChild(table);
      msg.innerHTML = "this is uploaded data";
    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("No file selected!");
  }
}
let check = false;
function convertExcelToTable(data, expectedColumns, headerRowIndex) {
  if (isNaN(headerRowIndex)) {
    headerRowIndex = 1;
  }
  let workbook = XLSX.read(data, { type: "array" });
  let sheetName = workbook.SheetNames[0];
  let sheet = workbook.Sheets[sheetName];
  let jsonData = XLSX.utils.sheet_to_json(sheet, {
    header: headerRowIndex - 1,
  });
  let table = document.createElement("table");
  table.classList.add("excel-table");

  let headerRow = document.createElement("tr");
  let emailColIndex = null; // Variable to store the index of the email column

  let headers = jsonData[headerRowIndex - 1];
  Object.keys(headers).forEach(function (key, i) {
    let th = document.createElement("th");
    th.textContent = key;
    if (key.toLowerCase() === "email") {
      emailColIndex = i + 1; // Store the index of the email column (add 1 since indexes start from 0)
    }
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Validate the presence of the email column
  if (emailColIndex === null) {
    let msg = document.getElementById("upload_msg");
    msg.innerHTML = "Email column is missing.";
    msg.style.backgroundColor = "red";
    msg.style.color = "white";
    msg.style.fontSize = "24px";
    let uploadBtn = document.getElementById("uploadbutton");
    uploadBtn.disabled = true;
    return null; // or handle the error as needed
  }

  jsonData.forEach(function (row, rowIndex) {
    if (rowIndex === headerRowIndex) return; // Skip the header row
    let tr = document.createElement("tr");
    let isEmailValid = true; // Flag to track if email is valid
    Object.values(row).forEach(function (value, j) {
      let td = document.createElement("td");
      td.textContent = value;

      if (j + 1 === emailColIndex) {
        if (!validateEmail(value)) {
          td.style.backgroundColor = "red"; // Change background color if email is not valid
          isEmailValid = false;
          check = true;
        }
      }
      tr.appendChild(td);
    });

    if (!isEmailValid) {
      tr.style.backgroundColor = "lightpink"; // Change row color if email is not valid
      let uploadBtn = document.getElementById("uploadbutton");
      // uploadBtn.disabled = true;
    }

    table.appendChild(tr);
  });

  return table;
}

// function convertExcelToTable(data, expectedColumns) {
//   let workbook = XLSX.read(data, { type: "array" });
//   let sheetName = workbook.SheetNames[0];
//   let sheet = workbook.Sheets[sheetName];
//   let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 2 });
//   let table = document.createElement("table");
//   table.classList.add("excel-table");

//   let headerRow = document.createElement("tr");
//   let i = 0;
//   let emailColIndex = null; // Variable to store the index of the email column
//   Object.keys(jsonData[0]).forEach(function (key) {
//     i++;
//     let th = document.createElement("th");
//     th.textContent = key;
//     if (key.toLowerCase() === "email") {
//       emailColIndex = i; // Store the index of the email column
//     }
//     headerRow.appendChild(th);
//   });
//   table.appendChild(headerRow);

//   // Validate the presence of the email column
//   if (emailColIndex === null) {
//     let msg = document.getElementById("upload_msg");
//     msg.innerHTML = "Email column is missing.";
//     msg.style.backgroundColor = "red";
//     msg.style.color = "white";
//     msg.style.fontSize = "24px";
//     let uploadBtn = document.getElementById("uploadbutton");
//     uploadBtn.disabled = true;
//     return null; // or handle the error as needed
//   }

//   jsonData.forEach(function (row) {
//     let tr = document.createElement("tr");
//     let j = 0;
//     let isEmailValid = true; // Flag to track if email is valid
//     Object.values(row).forEach(function (value) {
//       j++;

//       let td = document.createElement("td");
//       td.textContent = value;

//       if (j === emailColIndex) {
//         if (!validateEmail(value)) {
//           td.style.backgroundColor = "red"; // Change background color if email is not valid
//           isEmailValid = false;
//         }
//       }
//       tr.appendChild(td);
//     });

//     if (!isEmailValid) {
//       tr.style.backgroundColor = "lightpink"; // Change row color if email is not valid
//       let uploadBtn = document.getElementById("uploadbutton");
//       uploadBtn.disabled = true;
//     }

//     table.appendChild(tr);
//   });

//   return table;
// }

// Function to validate email format

function validateEmail(email) {
  // Regular expression to validate email format
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// function convertExcelToTable(data, expectedColumns) {
//   let workbook = XLSX.read(data, { type: "array" });
//   let sheetName = workbook.SheetNames[0];
//   let sheet = workbook.Sheets[sheetName];
//   let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 2 });
//   let table = document.createElement("table");
//   table.classList.add("excel-table");

//   let headerRow = document.createElement("tr");
//   let i = 0;
//   Object.keys(jsonData[0]).forEach(function (key) {
//     i++;
//     let th = document.createElement("th");
//     th.textContent = key;
//     if (key == "email" || key == "Email") {
//       email_col = i;
//       console.log(i);
//     }
//     headerRow.appendChild(th);
//   });
//   table.appendChild(headerRow);

//   // Check if all expected columns are present
//   let missingColumns = expectedColumns.filter(function (column) {
//     let lowerCaseColumn = column.toLowerCase();
//     return !Object.keys(jsonData[0]).some(function (key) {
//       return key.toLowerCase() === lowerCaseColumn;
//     });
//   });

//   if (missingColumns.length > 0) {
//     let msg = document.getElementById("upload_msg");
//     msg.innerHTML = "not correct data";
//     // alert("wrong data!");
//     msg.style.backgroundColor = "red";
//     msg.style.color = "white";
//     msg.style.fontSize = "24px";
//     // msg.style.border = "2px solid black";
//     //  alert("not correct data");
//     alert("Missing columns");
//     let uploadBtn = document.getElementById("uploadbutton");
//     uploadBtn.disabled = true;
//     return null; // or handle the error as needed
//   }

//   jsonData.forEach(function (row) {
//     let tr = document.createElement("tr");
//     let j = 0;
//     Object.values(row).forEach(function (value) {
//       j++;

//       let td = document.createElement("td");
//       td.textContent = value;

//       if (j == email_col) {
//         console.log(value);
//       }
//       tr.appendChild(td);
//     });
//     table.appendChild(tr);
//   });

//   return table;
// }

let fileList = [];

let furl = "dfa",
  iurl = "asdf";
function uploadFile() {
  createuuid();
  if (check) {
    alert("enter correct data!!!");
    return;
  }
  let fileInput = document.getElementById("inputFile");
  let imageInput = document.getElementById("imageInput");

  if (!fileInput.files[0] || !imageInput.files[0]) {
    alert("Please select Excel and Image files.");
    return;
  }
  let fileName = fileInput.files[0].name;
  let fileExtension = fileName.split(".").pop();

  // Upload Excel file to Firebase Storage
  let fstorage = firebase.storage();
  let storageRef = fstorage.ref().child("files/" + myuuid + "/" + fileName);
  let uploadTask = storageRef.put(fileInput.files[0]);

  uploadTask
    .then(() => {
      storageRef
        .getDownloadURL()
        .then((url) => {
          console.log("Download URL:", url);
          fileList.push([fileName, url]);
          furl = url;
          add_to_realtdb("fileurl", url);
          add_to_realtdb("fileName", fileName);
          // You can now use the 'url' to access the uploaded file
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
    })
    .catch((error) => {
      console.error("Upload error:", error);
    });
  // firebase.initializeApp(firebaseConfig);

  // Upload Image file to Firebase Storage
  let imageName = imageInput.files[0].name;
  let imageRef = firebase
    .storage()
    .ref()
    .child("files/" + myuuid + "/" + imageName);
  let imageUploadTask = imageRef.put(imageInput.files[0]);
  imageUploadTask
    .then(() => {
      imageRef
        .getDownloadURL()
        .then((url) => {
          console.log("Download URL:", url);
          iurl = url;
          fileList.push([imageName, url]);
          add_to_realtdb("imageurl", url);
          add_to_realtdb("imageName", fileName);
          // You can now use the 'url' to access the uploaded file
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
    })
    .catch((error) => {
      console.error("Upload error:", error);
    });

  // You can use Promise.all() to handle all uploads together
  Promise.all([uploadTask, imageUploadTask])
    .then((snapshots) => {
      console.log("All files uploaded successfully!");
      let msg = document.getElementById("upload_msg");
      msg.innerText = "All files uploaded successfully!";
    })
    .catch((error) => {
      console.error("Error uploading files:", error);
    });

  // newData[23] = 23342;
}

// function populateFilesTable() {
//   // Assuming fileList is an array of file information (name and URL)
//   // Each element of fileList should be [fileName, url]

//   // Get the container element
//   const fileTableContainer = document.getElementById("fileTable");

//   // Generate the table HTML
//   let tableHTML = "<table><tr><th>File Name</th><th>Download</th></tr>";

//   fileList.forEach((fileInfo) => {
//     const fileName = fileInfo[0];
//     const url = fileInfo[1];

//     // Add a new row with file name and download button
//     tableHTML += `
//     <tr>
//       <td>${fileName}</td>
//       <td><a href="${url}" download><button>Download</button></a></td>
//     </tr>
//   `;
//   });

//   tableHTML += "</table>";

//   // Set the generated HTML to the container
//   fileTableContainer.innerHTML = tableHTML;
// }

function add_to_realtdb(key, value) {
  console.log("asdf");
  console.log(key);
  console.log(value);
  const database = firebase.database();
  const data = {};
  data[key] = value;
  const uploadPath = `uploads/ ${myuuid} /`;
  //`;
  const dataRef = database.ref().child(uploadPath);
  dataRef
    .update(data)
    .then(() => {
      console.log("Data uploaded successfully");
    })
    .catch((error) => {
      console.error("Error uploading data:", error);
    });
}

// Get a reference to the table body
const tableBody = document.getElementById("table-body");

// Function to display data in the table
function displayDataInTable(data) {
  tableBody.innerHTML = ""; // Clear previous data

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const item = data[key];
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const descriptionCell = document.createElement("td");

      nameCell.textContent = item.name;
      descriptionCell.textContent = item.description;

      row.appendChild(nameCell);
      row.appendChild(descriptionCell);
      tableBody.appendChild(row);
    }
  }
}

function populateFilesTable() {
  // Initialize Firebase

  // Get a reference to the database
  const dbRef = firebase.database().ref("uploads");

  // Get a reference to the table body
  const tableBody = document.getElementById("table-body");

  // Function to display data in the table
  function displayData(data) {
    tableBody.innerHTML = ""; // Clear previous data

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const item = data[key];
        const row = document.createElement("tr");
        const fileNameCell = document.createElement("td");
        const fileUrlCell = document.createElement("td");
        const imageNameCell = document.createElement("td");
        const imageUrlCell = document.createElement("td");

        fileNameCell.textContent = item.fileName;
        fileUrlCell.innerHTML = `<a href="${item.fileurl}" target="_blank">Download File</a>`;
        imageNameCell.textContent = item.imageName;

        // Make the image clickable to download
        const imageLink = document.createElement("a");
        const image = document.createElement("img");
        imageLink.href = item.imageurl;
        imageLink.target = "_blank";
        imageLink.download = item.imageName; // Set the download attribute to the image's name
        image.src = item.imageurl;
        image.alt = "Image";
        image.style.maxWidth = "100px";
        image.style.maxHeight = "100px";
        imageLink.appendChild(image);
        imageUrlCell.appendChild(imageLink);
        row.appendChild(fileNameCell);
        row.appendChild(fileUrlCell);
        row.appendChild(imageNameCell);
        row.appendChild(imageUrlCell);
        tableBody.appendChild(row);
      }
    }
  }

  // Retrieve data from the database
  dbRef
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      displayData(data);
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
    });
}
