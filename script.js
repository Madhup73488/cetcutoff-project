// Load data from JSON file (data.json)
const dataUrl = "data.json"; // path to your data file
let combinedData = [];

// Fetch the data when the page loads
fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    // Combine all table data into one array
    Object.keys(data).forEach((key) => {
      combinedData = combinedData.concat(data[key]);
    });
    populateColleges();
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Add an event listener to show the dropdown when focusing on the search input
document.getElementById("collegeSearch").addEventListener("focus", () => {
  document.getElementById("collegeDropdown").style.display = "block";
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("collegeDropdown");
  if (!dropdown.contains(event.target) && event.target.id !== "collegeSearch") {
    dropdown.style.display = "none";
  }
});

// Function to populate the custom dropdown
function populateColleges() {
  const collegeDropdown = document.getElementById("collegeDropdown");
  collegeDropdown.innerHTML = ""; // Clear the existing options

  const validData = combinedData.filter((item) => item && item.college);
  const colleges = [...new Set(validData.map((item) => item.college))];

  colleges.forEach((college) => {
    const div = document.createElement("div");
    div.classList.add("dropdown-item");
    div.textContent = college;
    div.onclick = () => selectCollege(college);
    collegeDropdown.appendChild(div);
  });
}

// Function to select a college
function selectCollege(college) {
  document.getElementById("collegeSearch").value = college; // Set the input value
  document.getElementById("collegeDropdown").style.display = "none"; // Hide the dropdown
  handleCollegeSelect(college); // Trigger the next step (populating branches)
}

// Function to filter the colleges in the dropdown
function filterColleges() {
  const input = document.getElementById("collegeSearch").value.toLowerCase();
  const items = document.querySelectorAll(".dropdown-item");

  items.forEach((item) => {
    if (item.textContent.toLowerCase().includes(input)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Function to handle college selection and populate the branch dropdown
function handleCollegeSelect(selectedCollege) {
  const branchSelect = document.getElementById("branchSelect");

  // Enable the branch dropdown and reset its content
  branchSelect.disabled = false;
  branchSelect.innerHTML = '<option value="">Select Branch</option>';

  // Filter branches for the selected college
  const branches = [
    ...new Set(
      combinedData
        .filter((item) => item && item.college === selectedCollege)
        .map((item) => item.branch)
    ),
  ];

  // Populate branch dropdown
  branches.forEach((branch) => {
    const option = document.createElement("option");
    option.value = branch;
    option.textContent = branch;
    branchSelect.appendChild(option);
  });

  branchSelect.addEventListener("change", handleBranchSelect);
}

// Handle branch selection and enable the category dropdown
function handleBranchSelect() {
  const selectedBranch = this.value;
  const categorySelect = document.getElementById("categorySelect");

  // Enable and reset category dropdown
  categorySelect.disabled = false;
  categorySelect.innerHTML = '<option value="">Select Category</option>';

  // Define the categories
  const categories = [
    "1G",
    "1K",
    "1R",
    "2AG",
    "2AK",
    "2AR",
    "2BG",
    "2BK",
    "2BR",
    "3AG",
    "3AK",
    "3AR",
    "3BG",
    "3BK",
    "3BR",
    "GM",
    "GMK",
    "GMR",
    "SCG",
    "SCK",
    "SCR",
    "STG",
    "STK",
    "STR",
  ];

  // Populate category dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Handle form submission
document
  .getElementById("selectionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    handleCategorySelect.call(document.getElementById("categorySelect"));
  });

function handleCategorySelect() {
  const selectedCollege = document.getElementById("collegeSearch").value;
  const selectedBranch = document.getElementById("branchSelect").value;
  const selectedCategory = this.value;
  const cutoffTable = document.getElementById("cutoffTable");
  const tbody = cutoffTable.querySelector("tbody");
  const resultSection = document.getElementById("result");

  // Clear previous results
  tbody.innerHTML = "";

  // Ensure valid data before finding the cutoff
  const result = combinedData.find(
    (item) =>
      item && item.college === selectedCollege && item.branch === selectedBranch
  );

  if (result) {
    // Get the cutoff for the selected category or show "--" if not available
    const cutoff = result[selectedCategory] || "--";
    const displayCutoff = cutoff === "--" ? "Not Sure" : cutoff;

    // Display the cutoff in the table
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${selectedCategory}</td>
        <td>${displayCutoff}</td>
      `;
    tbody.appendChild(row);

    cutoffTable.style.display = "block"; // Ensure the table is displayed
    resultSection.style.display = "flex"; // Show the results section
  } else {
    // Hide the cutoff table if no result found
    cutoffTable.style.display = "none";
  }
}
