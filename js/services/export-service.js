/**
 * Export Service
 * Handles exporting newsletter in various formats (JSON, HTML, PDF)
 */

/**
 * Exports newsletter as HTML file
 * @param {string} fileName - Name of file to create
 * @param {string} elementId - ID of element to export
 * @param {string} type - MIME type (default: "text/html")
 */
function exportHTML(fileName, elementId, type = "text/html") {
  downloadInnerHtml(fileName, elementId, type);
}

/**
 * Exports newsletter as PDF file
 * @param {HTMLElement} element - DOM element to convert to PDF
 * @param {string} fileName - Name of file to create
 * @returns {Promise} Promise that resolves when PDF is generated
 */
function exportPDF(element, fileName) {
  sendInfo('Preparing newsletter for PDF export...');
  
  const opt = {
    margin: [10, 2, 10, 2],
    filename: fileName,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 800,
      windowWidth: 800,
      x: -5,
      y: 0,
      scrollX: 0,
      scrollY: -window.scrollY,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true,
      hotfixes: ['px_scaling']
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy']
    }
  };
  
  sendInfo('Generating PDF... This may take a moment. Images may not appear due to security restrictions.');
  
  return html2pdf().set(opt).from(element).save()
    .then(() => {
      sendSuccess('PDF downloaded successfully. Note: External images may not appear in the PDF due to browser security.');
    })
    .catch((error) => {
      console.error('PDF Error:', error);
      sendError('Failed to generate PDF. Please try again.', error);
    });
}

/**
 * Exports JSON object to file
 * @param {string} obj - JSON string to export
 * @param {string} fileName - Name of file to create
 */
function exportJSONToFile(obj, fileName) {
  const file = new File([obj], fileName, { type: "text/json" });
  const blobUrl = (URL || webkitURL).createObjectURL(file);
  const div = document.createElement("div");
  const anch = document.createElement("a");

  document.body.appendChild(div);
  div.appendChild(anch);

  anch.innerHTML = "&nbsp;";
  div.style.width = "0";
  div.style.height = "0";
  anch.href = blobUrl;
  anch.download = fileName;

  const ev = new MouseEvent("click", {});
  anch.dispatchEvent(ev);
  document.body.removeChild(div);
}

/**
 * Loads JSON file from user's computer
 * @param {Function} cb - Callback function to receive JSON data
 */
function loadJSONFile(cb) {
  const div = document.createElement("div");
  const input = document.createElement("input");
  input.type = "file";
  div.style.width = "0";
  div.style.height = "0";
  div.style.position = "fixed";
  input.accept = "application/JSON";
  document.body.appendChild(div);
  div.appendChild(input);
  const ev = new MouseEvent("click", {});
  input.dispatchEvent(ev);
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const res = JSON.parse(reader.result);
      cb(res);
      document.body.removeChild(div);
    };
  });
}
