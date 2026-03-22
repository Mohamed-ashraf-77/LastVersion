// Scroll Reveal logic
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

function refreshObservers() {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

refreshObservers();

// Tab Switching Logic
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((section) => {
    section.classList.add("hidden");
  });
  const targetSection =
    document.getElementById("section-" + tabId) ||
    document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  }

  document.querySelectorAll("nav button").forEach((btn) => {
    btn.classList.remove("nav-active");
    btn.classList.add("text-gray-500");
  });
  document.getElementById("btn-" + tabId).classList.add("nav-active");
  document.getElementById("btn-" + tabId).classList.remove("text-gray-500");

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(refreshObservers, 100);
}

// Attendance Logic
function markAttendance() {
  const today = new Date().toISOString().split("T")[0];
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  if (!attendance.includes(today)) {
    attendance.push(today);
    localStorage.setItem("attendance", JSON.stringify(attendance));
    updateAttendanceList();
  } else {
    alert("تم تسجيل هذا اليوم بالفعل!");
  }
}

function updateAttendanceList() {
  const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  const list = document.getElementById("attendance-list");
  list.innerHTML = "";
  attendance.forEach((day) => {
    const listItem = document.createElement("li");
    listItem.textContent = day;
    list.appendChild(listItem);
  });
}

function clearMonthlyAttendance() {
  const now = new Date();
  const lastClear = localStorage.getItem("lastClearDate");
  const lastClearDate = lastClear ? new Date(lastClear) : null;

  if (!lastClearDate || now.getMonth() !== lastClearDate.getMonth()) {
    localStorage.setItem("attendance", JSON.stringify([]));
    localStorage.setItem("lastClearDate", now.toISOString());
    updateAttendanceList();
  }
}

// Generate calendar for the current month
function generateCalendar() {
  const calendar = document.getElementById("attendance-calendar");
  if (!calendar) {
    console.error("ERROR: attendance-calendar element not found!");
    return;
  }

  console.log("Generating calendar...");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = new Date(year, month).toLocaleString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  calendar.innerHTML = ""; // Clear previous calendar
  calendar.style.display = "grid";
  calendar.style.gridTemplateColumns = "repeat(7, 1fr)";
  calendar.style.gap = "12px";
  calendar.style.marginBottom = "20px";
  calendar.style.width = "100%";

  // Add month and year title
  const title = document.createElement("div");
  title.style.gridColumn = "1 / -1";
  title.style.textAlign = "center";
  title.style.fontSize = "28px";
  title.style.fontWeight = "bold";
  title.style.color = "#fbbf24";
  title.style.marginBottom = "20px";
  title.textContent = monthName;
  calendar.appendChild(title);

  // Add day names (Saturday to Friday for Arabic RTL)
  const dayNames = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  dayNames.forEach((dayName) => {
    const dayNameElement = document.createElement("div");
    dayNameElement.style.padding = "12px";
    dayNameElement.style.textAlign = "center";
    dayNameElement.style.fontWeight = "bold";
    dayNameElement.style.color = "#fbbf24";
    dayNameElement.style.border = "2px solid #fbbf24";
    dayNameElement.style.borderRadius = "8px";
    dayNameElement.style.backgroundColor = "#1f2937";
    dayNameElement.style.fontSize = "14px";
    dayNameElement.textContent = dayName;
    calendar.appendChild(dayNameElement);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.style.padding = "12px";
    calendar.appendChild(emptyCell);
  }

  // Add day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.style.padding = "16px";
    dayElement.style.textAlign = "center";
    dayElement.style.border = "2px solid";
    dayElement.style.borderRadius = "8px";
    dayElement.style.cursor = "pointer";
    dayElement.style.fontWeight = "bold";
    dayElement.style.fontSize = "18px";
    dayElement.style.transition = "all 0.3s ease";
    dayElement.style.userSelect = "none";

    // Check if the day is already marked as attended
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    if (attendance.includes(date)) {
      dayElement.style.backgroundColor = "#10b981";
      dayElement.style.color = "white";
      dayElement.style.borderColor = "#059669";
    } else {
      dayElement.style.backgroundColor = "#1f2937";
      dayElement.style.color = "white";
      dayElement.style.borderColor = "#4b5563";
    }

    // Add hover effect
    dayElement.addEventListener("mouseenter", () => {
      dayElement.style.transform = "scale(1.05)";
    });
    dayElement.addEventListener("mouseleave", () => {
      dayElement.style.transform = "scale(1)";
    });

    // Add click event to mark/unmark attendance
    dayElement.addEventListener("click", () => {
      toggleAttendance(date, dayElement);
    });

    calendar.appendChild(dayElement);
  }

  console.log("Calendar generated successfully with " + daysInMonth + " days");
}

function toggleAttendance(date, element) {
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  if (attendance.includes(date)) {
    // Unmark the day
    attendance = attendance.filter((d) => d !== date);
    element.style.backgroundColor = "#1f2937";
    element.style.color = "white";
    element.style.borderColor = "#4b5563";
  } else {
    // Mark the day
    attendance.push(date);
    element.style.backgroundColor = "#10b981";
    element.style.color = "white";
    element.style.borderColor = "#059669";
  }

  localStorage.setItem("attendance", JSON.stringify(attendance));
}

// Initialize attendance on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing calendar...");

  // Add a small delay to ensure everything is ready
  setTimeout(function () {
    console.log("Calling generateCalendar...");
    generateCalendar();
  }, 100);
});
