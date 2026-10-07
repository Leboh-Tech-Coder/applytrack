
let applications = [];

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

const applicationForm = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");

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

    applications.push(application);

    saveApplications();

    displayApplication(application, applications.length - 1);


    updateStatistics();

    applicationForm.reset();
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

});


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

function renderApplications() {
    applicationList.innerHTML = "";

    applications.forEach(function (application, index) {
        displayApplication(application, index);
    });
}

loadApplications();