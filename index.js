const firebaseConfig = {
  apiKey: "AIzaSyDyT_y75Mkz1vm8_BXm284C0VJda31QxOw",
  authDomain: "laser-pay-4b260.firebaseapp.com",
  projectId: "laser-pay-4b260",
  storageBucket: "laser-pay-4b260.appspot.com",
  messagingSenderId: "1059782615257",
  appId: "1:1059782615257:web:241b7ffbafcc99a8641ec8",
  measurementId: "G-9SQ5CBCHHS",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
  console.log("getfile");
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  console.log(fileName);
  getTable();
}

let email_col;
function getTable() {
  let msg = document.getElementById("upload_msg");
  msg.innerHTML = "this is uploaded data";
  let fileInput = document.getElementById("inputFile");
  let file = fileInput.files[0]; // Get the selected file

  if (file) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);

      // Convert Excel data to HTML table
      let table = convertExcelToTable(data, expectedColumns);
      if (table == null) {
        console.log("not matched");
      }
      // Append the table to a container element in the HTML
      let container = document.getElementById("table-container");
      container.innerHTML = ""; // Clear previous data
      container.appendChild(table);
    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("No file selected!");
  }
}

function convertExcelToTable(data, expectedColumns) {
  let workbook = XLSX.read(data, { type: "array" });
  let sheetName = workbook.SheetNames[0];
  let sheet = workbook.Sheets[sheetName];
  let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 2 });
  let table = document.createElement("table");
  table.classList.add("excel-table");

  let headerRow = document.createElement("tr");
  let i = 0;
  Object.keys(jsonData[0]).forEach(function (key) {
    i++;
    let th = document.createElement("th");
    th.textContent = key;
    if (key == "email" || key == "Email") {
      email_col = i;
      console.log(i);
    }
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Check if all expected columns are present
  let missingColumns = expectedColumns.filter(function (column) {
    return !Object.keys(jsonData[0]).includes(column);
  });

  if (missingColumns.length > 0) {
    console.error("Missing columns:", missingColumns);
    return null; // or handle the error as needed
  }

  jsonData.forEach(function (row) {
    let tr = document.createElement("tr");
    let j = 0;
    Object.values(row).forEach(function (value) {
      j++;

      let td = document.createElement("td");
      td.textContent = value;

      if (j == email_col) {
        console.log(value);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  return table;
}

// function convertExcelToTable(data) {
//   let workbook = XLSX.read(data, { type: "array" });
//   let sheetName = workbook.SheetNames[0];
//   let sheet = workbook.Sheets[sheetName];
//   let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//   let table = document.createElement("table");

//   // Add CSS class to the table for styling
//   table.classList.add("excel-table");

//   let headerRow = document.createElement("tr");
//   Object.keys(jsonData[0]).forEach(function (key) {
//     let th = document.createElement("th");
//     th.textContent = key;
//     headerRow.appendChild(th);
//   });
//   table.appendChild(headerRow);

//   jsonData.forEach(function (row) {
//     let tr = document.createElement("tr");
//     Object.values(row).forEach(function (value) {
//       let td = document.createElement("td");
//       td.textContent = value;
//       tr.appendChild(td);
//     });
//     table.appendChild(tr);
//   });

//   return table;
// }

//let progressBar = document.getElementById("uploadProgress");

function uploadFile() {
  let storageref = firebase.storage().ref("files/" + fileName);
  let uploadTask = storageref.put(fileItem);
  let statusDiv = document.getElementById("upload-percentage");
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log(snapshot);
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log(progress);
      // Update progress bar value
      //progressBar.innerHTML = "" + progress + "%";

      // Update status message
      statusDiv.innerText = "Uploading... " + progress.toFixed(2) + "%";
      percentageVal = Math.floor(
        (snapshot.bytesTranferred / snapshot.TotalBytes) * 100
      );
      uploadper.innerHTML = percentageVal + "%";
    },
    function (error) {
      // Handle error
      console.error("Upload error:", error);
    },
    function () {
      // Handle successful upload
      console.log("Upload complete!");
      let msg = document.getElementById("upload_msg");

      msg.innerText = "Upload complete!";
    }
  );
}
