
// XLSX File Handling
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

function filledCell(cell) {
  return cell !== '' && cell != null;
}

function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON to filter blank rows
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      // Filter out blank rows (rows where all cells are empty, null, or undefined)
      var filteredData = jsonData.filter(row => row.some(filledCell));

      // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      // Fallback
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }

      // Convert filtered JSON back to CSV
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      return csv;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  return gk_fileData[filename] || "";
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Modal open/close functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', function (e) {
  const target = e.target;
  if (target.classList && target.classList.contains('modal')) {
    target.classList.add('hidden');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = '';
  }
});

// Chart.js for Project 1 Visualization (Radar Chart)
const project1Ctx = document.getElementById('project1Chart').getContext('2d');
new Chart(project1Ctx, {
  type: 'radar',
  data: {
    labels: ['Data Engineer', 'ML Engineer', 'Data Scientist', 'Data Analyst'],
    datasets: [{
      label: 'Skill Distribution',
      data: [80, 60, 70, 50], // Placeholder data
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '[Project 1 Title] Visualization',
        font: { size: 14 }
      }
    },
    scales: {
      r: { beginAtZero: true, min: 0, max: 100 }
    }
  }
});

// Chart.js for Project 4 Visualization (Bubble Chart)
const project4Ctx = document.getElementById('project4Chart').getContext('2d');
new Chart(project4Ctx, {
  type: 'bubble',
  data: {
    datasets: [{
      label: 'Data Clusters',
      data: [
        { x: 10, y: 20, r: 15 },
        { x: 30, y: 40, r: 10 },
        { x: 50, y: 60, r: 20 },
        { x: 70, y: 80, r: 12 }
      ],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '[Project 4 Title] Visualization',
        font: { size: 14 }
      }
    },
    scales: {
      x: { title: { display: true, text: 'X Axis' } },
      y: { title: { display: true, text: 'Y Axis' } }
    }
  }
});


function zoomImage(img) {
  // Create a new image element
  const zoomedImg = document.createElement("img");
  zoomedImg.src = img.src; // Use the same source as the clicked image
  zoomedImg.style.position = "fixed";
  zoomedImg.style.top = "50%";
  zoomedImg.style.left = "50%";
  zoomedImg.style.transform = "translate(-50%, -50%)";
  zoomedImg.style.zIndex = "1000"; // Ensure it appears on top
  zoomedImg.style.maxWidth = "90%"; // Limit size
  zoomedImg.style.maxHeight = "90%"; // Limit size
  zoomedImg.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  
  // Append to body
  document.body.appendChild(zoomedImg);

  // Close zoom on click
  zoomedImg.onclick = function() {
      document.body.removeChild(zoomedImg);
  };
}
