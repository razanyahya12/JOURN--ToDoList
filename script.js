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


// تخزين المهام في الذاكرة
let tasks = [];


// عند الضغط على الزر
organizeBtn.addEventListener(
    "click",
    organizeTasks
);


// تنظيم المهام باستخدام AI
async function organizeTasks() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("اكتب مهامك أولاً ✨");

        return;
    }


    organizeBtn.textContent =
        "✨ جاري تنظيم مهامك...";

    organizeBtn.disabled = true;


    try {

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


        const rawTasks =
            await response.json();


        if (!response.ok) {

            throw new Error(
                rawTasks.error ||
                "حدث خطأ"
            );
        }


        displayTasks(rawTasks);


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



// عرض المهام
function displayTasks(rawTasks) {


    resultSection.classList.remove(
        "hidden"
    );


    // حفظ المهام مع id
    tasks =
        rawTasks.map((task, index) => ({
            id: index,
            ...task
        }));


    taskCount.textContent =
        `${tasks.length} مهام`;


    tasksContainer.innerHTML = "";


    tasks.forEach(task => {


        const card =
            document.createElement("div");


        card.className =
            "task-card";


        card.dataset.id =
            task.id;


        tasksContainer.appendChild(card);


        renderCard(task.id);

    });

}



// رسم البطاقة
function renderCard(id) {


    const card =
        document.querySelector(
            `.task-card[data-id="${id}"]`
        );


    const task =
        tasks.find(t => t.id === id);


    if (!card || !task) return;


    const isCompleted =
        card.classList.contains("completed");



    card.innerHTML = `

        <input
            type="checkbox"
            class="task-checkbox"
            ${isCompleted ? "checked" : ""}
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


        <button
            class="edit-btn"
            title="تعديل">
            ✏️
        </button>

    `;



    if (isCompleted) {

        card.classList.add("completed");

    }



    // checkbox
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



    // زر التعديل
    card.querySelector(
        ".edit-btn"
    )
    .addEventListener(
        "click",
        () => startEdit(id)
    );

}



// بدء التعديل
function startEdit(id) {


    const card =
        document.querySelector(
            `.task-card[data-id="${id}"]`
        );


    const task =
        tasks.find(t => t.id === id);


    if (!card || !task) return;


    const isCompleted =
        card.classList.contains("completed");



    card.innerHTML = `

        <div class="edit-form">


            <div class="edit-field">

                <label class="edit-label">
                    العنوان
                </label>

                <input
                    class="edit-input"
                    value="${task.title}"
                >

            </div>



            <div class="edit-field">

                <label class="edit-label">
                    التاريخ
                </label>

                <input
                    class="edit-input"
                    value="${task.date}"
                >

            </div>



            <div class="edit-field">

                <label class="edit-label">
                    التصنيف
                </label>

                <select class="edit-select">

                    <option ${task.category==="دراسة"?"selected":""}>
                        دراسة
                    </option>

                    <option ${task.category==="عمل"?"selected":""}>
                        عمل
                    </option>

                    <option ${task.category==="شخصي"?"selected":""}>
                        شخصي
                    </option>

                    <option ${task.category==="مشتريات"?"selected":""}>
                        مشتريات
                    </option>

                    <option ${task.category==="صحة"?"selected":""}>
                        صحة
                    </option>

                    <option ${task.category==="أخرى"?"selected":""}>
                        أخرى
                    </option>

                </select>

            </div>



            <div class="edit-field">

                <label class="edit-label">
                    الأولوية
                </label>


                <select class="edit-select">

                    <option ${task.priority==="عالية"?"selected":""}>
                        عالية
                    </option>

                    <option ${task.priority==="متوسطة"?"selected":""}>
                        متوسطة
                    </option>

                    <option ${task.priority==="منخفضة"?"selected":""}>
                        منخفضة
                    </option>

                </select>


            </div>



            <div class="edit-actions">

                <button class="edit-save-btn">
                    حفظ
                </button>


                <button class="edit-cancel-btn">
                    إلغاء
                </button>


            </div>


        </div>

    `;



    if (isCompleted) {

        card.classList.add("completed");

    }



    // حفظ
    card.querySelector(
        ".edit-save-btn"
    )
    .addEventListener(
        "click",
        () => {


            const inputs =
                card.querySelectorAll(
                    ".edit-input"
                );


            const selects =
                card.querySelectorAll(
                    ".edit-select"
                );


            task.title =
                inputs[0].value.trim();


            task.date =
                inputs[1].value.trim();


            task.category =
                selects[0].value;


            task.priority =
                selects[1].value;



            renderCard(id);


        }
    );



    // إلغاء
    card.querySelector(
        ".edit-cancel-btn"
    )
    .addEventListener(
        "click",
        () => {

            renderCard(id);

        }
    );

}



// ألوان الأولوية
function getPriorityClass(priority) {


    if (priority === "عالية") {

        return "priority-high";

    }


    if (priority === "منخفضة") {

        return "priority-low";

    }


    return "priority-medium";

}