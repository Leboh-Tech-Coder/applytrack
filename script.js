
let applications = [];
let editingIndex = null;

function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}

function loadApplications() {
    const storedApplications = localStorage.getItem("applications");

    if (storedApplications) {
        applications = JSON.parse(storedApplications);

        applications.forEach(function (application, index) {
            displayApplication(application, index);
        });
    }

    updateStatistics();
}


const addApplicationBtn = document.getElementById("addApplicationBtn");


addApplicationBtn.addEventListener("click", function () {
    applicationForm.style.display = "block";
});

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const applicationForm = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");
const saveButton = document.getElementById("saveButton");

applicationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;
    const status = document.getElementById("status").value;

    const application = {
        company: company,
        position: position,
        status: status
    };

    if (editingIndex !== null) {

        applications[editingIndex] = application;

        editingIndex = null;

    } else {

        applications.push(application);
    }

    saveApplications();

    renderApplications();
    updateStatistics();

    applicationForm.reset();
    saveButton.textContent = "Save Application";
    applicationForm.style.display = "none";

});


applicationList.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-button")) {

        const index = event.target.dataset.index;

        applications.splice(index, 1);

        saveApplications();

        renderApplications();
        updateStatistics();
    }

    if (event.target.classList.contains("edit-button")) {

        const index = event.target.dataset.index;

        editingIndex = index;

        const application = applications[index];

        document.getElementById("company").value = application.company;
        document.getElementById("position").value = application.position;
        document.getElementById("status").value = application.status;

       applicationForm.style.display = "block";
       saveButton.textContent = "Save Changes";
    }

    

});


function filterApplications() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredApplications = applications.filter(function (application) {
        const matchesSearch =
            application.company.toLowerCase().includes(searchTerm) ||
            application.position.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    renderApplications(filteredApplications);
}

searchInput.addEventListener("input", filterApplications);

statusFilter.addEventListener("change", filterApplications);


function updateStatistics() {
    const applications = document.querySelectorAll(".application-card");

    const total = applications.length;

    let inProgress = 0;
    let interviews = 0;
    let offers = 0;

    applications.forEach(function (application) {
        const status = application.querySelector(".status");

        if (status.classList.contains("applied")) {
            inProgress++;
        }

        if (status.classList.contains("interview")) {
            interviews++;
        }

        if (status.classList.contains("offer")) {
            offers++;
        }
    });

    document.getElementById("totalApplications").textContent = total;
    document.getElementById("inProgress").textContent = inProgress;
    document.getElementById("interviews").textContent = interviews;
    document.getElementById("offers").textContent = offers;
}

function displayApplication(application, index) {
    const applicationCard = document.createElement("article");

    applicationCard.classList.add("application-card");

    applicationCard.innerHTML = `
        <div>
            <h3>${application.company}</h3>
            <p>${application.position}</p>
        </div>

        <div class="application-actions">
            <span class="status ${application.status}">
                ${application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>

            <button class="edit-button" data-index="${index}">
                Edit
            </button>

            <button class="delete-button" data-index="${index}">
                Delete
            </button>
        </div>
    `;

    applicationList.appendChild(applicationCard);
}

function renderApplications(filteredApplications = applications) {
    applicationList.innerHTML = "";

    filteredApplications.forEach(function (application) {
        const index = applications.indexOf(application);
        displayApplication(application, index);
    });
}

loadApplications();