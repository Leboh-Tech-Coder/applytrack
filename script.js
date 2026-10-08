
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

const deadlineList = document.getElementById("deadlineList");
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
    const applicationDate = document.getElementById("applicationDate").value;
    const deadline = document.getElementById("deadline").value;
    const jobLink = document.getElementById("jobLink").value;
    const notes = document.getElementById("notes").value;

    const application = {
        company: company,
        position: position,
        status: status,
        applicationDate: applicationDate,
        deadline: deadline,
        jobLink: jobLink,
        notes: notes
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
        renderUpcomingDeadlines();
    }

    if (event.target.classList.contains("edit-button")) {

        const index = event.target.dataset.index;

        editingIndex = index;

        const application = applications[index];

        document.getElementById("company").value = application.company;
        document.getElementById("position").value = application.position;
        document.getElementById("status").value = application.status;
        document.getElementById("applicationDate").value = application.applicationDate || "";
        document.getElementById("deadline").value = application.deadline || "";
        document.getElementById("jobLink").value = application.jobLink || "";
        document.getElementById("notes").value = application.notes || "";

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

function getDeadlineStatus(deadline) {
    if (!deadline) {
        return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline + "T00:00:00");

    const difference = deadlineDate - today;
    const daysRemaining = difference / (1000 * 60 * 60 * 24);

    if (daysRemaining < 0) {
        return "overdue";
    }

    if (daysRemaining <= 3) {
        return "due-soon";
    }

    return "upcoming";
}

function displayApplication(application, index) {
    const applicationCard = document.createElement("article");

    applicationCard.classList.add("application-card");

    applicationCard.innerHTML = `
        <div>
            <h3>${application.company}</h3>
            <p>${application.position}</p>
            <p>Applied: ${application.applicationDate || "Not provided"}</p>
            <p>
               Deadline: ${application.deadline || "Not provided"}
               ${
                   application.deadline
                     ? `<span class="deadline-status ${getDeadlineStatus(application.deadline)}">
                         ${getDeadlineStatus(application.deadline)
                            .replace("-", " ")
                            .replace(/\b\w/g, function (letter) {
                               return letter.toUpperCase();
                            })}
                     </span>`
                     : ""
               }
           </p>

          ${
               application.jobLink
                  ? `<p><a href="${application.jobLink}" target="_blank">View Job Posting</a></p>`
                  : ""
           }

          ${
               application.notes
                  ? `<p>Notes: ${application.notes}</p>`
                  : ""
          }
            
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

function renderUpcomingDeadlines() {
    deadlineList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingApplications = applications
        .filter(function (application) {
            if (!application.deadline) {
                return false;
            }

            const deadlineDate = new Date(
                application.deadline + "T00:00:00"
            );

            return deadlineDate >= today;
        })
        .sort(function (a, b) {
            return new Date(a.deadline) - new Date(b.deadline);
        })
        .slice(0, 5);

    if (upcomingApplications.length === 0) {
        deadlineList.innerHTML = `
            <div class="no-deadlines">
                No upcoming deadlines.
            </div>
        `;

        return;
    }

    upcomingApplications.forEach(function (application) {

        const deadlineDate = new Date(
            application.deadline + "T00:00:00"
        );

        const difference = deadlineDate - today;

        const daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

        const deadlineClass =
            daysRemaining <= 3 ? "due-soon" : "upcoming";

        const deadlineCard = document.createElement("article");

        deadlineCard.classList.add("deadline-card");

        deadlineCard.innerHTML = `
            <div class="deadline-info">
                <h3>${application.company}</h3>
                <p>${application.position}</p>
                <p>Due: ${application.deadline}</p>
            </div>

            <span class="days-remaining ${deadlineClass}">
                ${
                    daysRemaining === 0
                        ? "Due today"
                        : daysRemaining === 1
                        ? "1 day left"
                        : `${daysRemaining} days left`
                }
            </span>
        `;

        deadlineList.appendChild(deadlineCard);
    });
}

loadApplications();
renderUpcomingDeadlines();