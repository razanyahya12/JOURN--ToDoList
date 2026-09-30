const organizeBtn =
    document.getElementById("organizeBtn");

const taskInput =
    document.getElementById("taskInput");

const resultSection =
    document.getElementById("resultSection");

const tasksContainer =
    document.getElementById("tasksContainer");

const taskCount =
    document.getElementById("taskCount");


/* When user clicks the button */

organizeBtn.addEventListener(
    "click",
    organizeTasks
);


/* Organize tasks using AI */

async function organizeTasks() {

    const text =
        taskInput.value.trim();


    /* Check empty input */

    if (text === "") {

        alert("اكتب مهامك أولاً ✨");

        return;
    }


    /* Loading */

    organizeBtn.textContent =
        "✨ جاري تنظيم مهامك...";

    organizeBtn.disabled = true;


    try {

        /* Send text to server */

        const response =
            await fetch("/organize", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    text: text

                })

            });


        /* Get AI result */

        const tasks =
            await response.json();


        /* Check server error */

        if (!response.ok) {

            throw new Error(
                tasks.error ||
                "حدث خطأ"
            );
        }


        /* Display tasks */

        displayTasks(tasks);


    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء تنظيم المهام. تأكدي من تشغيل السيرفر ومفتاح الـAI."
        );


    } finally {

        organizeBtn.textContent =
            "✨ نظّم مهامي";

        organizeBtn.disabled = false;
    }
}


/* Display tasks */

function displayTasks(tasks) {

    resultSection.classList.remove(
        "hidden"
    );


    taskCount.textContent =
        `${tasks.length} مهام`;


    tasksContainer.innerHTML = "";


    tasks.forEach((task) => {


        const card =
            document.createElement("div");


        card.className =
            "task-card";


        card.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
            >

            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>


                <div class="task-details">

                    <span class="badge">
                        📅 ${task.date}
                    </span>


                    <span class="badge">
                        🏷 ${task.category}
                    </span>


                    <span class="badge ${getPriorityClass(task.priority)}">
                        ⚡ ${task.priority}
                    </span>

                </div>

            </div>

        `;


        /* Checkbox */

        const checkbox =
            card.querySelector(
                ".task-checkbox"
            );


        checkbox.addEventListener(
            "change",
            () => {

                card.classList.toggle(
                    "completed"
                );

            }
        );


        tasksContainer.appendChild(
            card
        );

    });
}


/* Priority color */

function getPriorityClass(priority) {

    if (priority === "عالية") {

        return "priority-high";
    }


    if (priority === "منخفضة") {

        return "priority-low";
    }


    return "priority-medium";
}