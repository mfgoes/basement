// main.js
import { changeBackgroundColor } from './background-change.js';

const timelineContainer = document.getElementById("timeline-container");
const timelineWrapper = document.getElementById("timeline-wrapper");
let data = [];
let selectedIndex = 0;

function renderTimeline() {
  timelineContainer.innerHTML = "";

  data.forEach((item, index) => {
    const groupchatElement = document.createElement("div");
    groupchatElement.classList.add("groupchat");
    if (index === selectedIndex) {
      groupchatElement.classList.add("selected");
      changeBackgroundColor(groupchatElement); // Apply random background color when selected
    }

    groupchatElement.textContent = item.name;
    if (index === selectedIndex) {
      const dateElement = document.createElement("div");
      dateElement.classList.add("date");
      dateElement.textContent = item.date;
      groupchatElement.appendChild(dateElement);
    }

    timelineContainer.appendChild(groupchatElement);
  });

  // Ensure the selected item is centered with slower scroll
  const selectedElement = document.querySelector(".groupchat.selected");
  if (selectedElement) {
    slowScrollToElement(selectedElement);
  }
}

// Function to scroll to an element with slower speed, positioning it closer to the middle
function slowScrollToElement(element) {
  const targetPosition = element.getBoundingClientRect().top + timelineWrapper.scrollTop;
  const wrapperHeight = timelineWrapper.clientHeight;
  const offset = wrapperHeight / 2 - element.clientHeight / 2; // Position the element in the middle

  const startPosition = timelineWrapper.scrollTop;
  const distance = targetPosition - startPosition - offset;
  const duration = 1000; // Duration of the scroll in ms (increase for slower scroll)
  let startTime = null;

  // Smoothly scroll to the element
  function scrollStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const scrollAmount = easeInOutCubic(progress, startPosition, distance, duration);

    timelineWrapper.scrollTo(0, scrollAmount);

    if (progress < duration) {
      window.requestAnimationFrame(scrollStep);
    }
  }

  window.requestAnimationFrame(scrollStep);
}

// Ease-in-out cubic function for smooth acceleration and deceleration
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

function handleScroll(e) {
  if (e.deltaY > 0 || e.key === "ArrowDown") {
    selectedIndex = Math.min(selectedIndex + 1, data.length - 1);
  } else if (e.deltaY < 0 || e.key === "ArrowUp") {
    selectedIndex = Math.max(selectedIndex - 1, 0);
  }

  // Delay the class toggle to ensure the transition works smoothly
  setTimeout(() => renderTimeline(), 10);
}

async function loadCSV() {
  try {
    const response = await fetch("groupchats.csv");
    const text = await response.text();
    const rows = text.split("\n").slice(1); // Skip header row

    data = rows
      .map(row => row.split(","))
      .filter(columns => columns.length === 2 && columns[0] && columns[1]) // Ensure both name and date exist
      .map(columns => ({
        name: columns[0].trim(),
        date: columns[1].trim()
      }));

    renderTimeline();
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

window.addEventListener("wheel", handleScroll);
window.addEventListener("keydown", handleScroll);

loadCSV();
