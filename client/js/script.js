document.addEventListener("DOMContentLoaded", function () {
  $("#welcomeModal").modal("show");
  setUpEditor();
});

const bookWriter = document.getElementById("bookWriter");
const bookTitle = document.getElementById("bookTitle");
const bookSynopsis = document.getElementById("synopsis");
const textLength = document.getElementById("textLength");
const generatorModel = document.getElementById("generatorModel");
const generatorStyle = document.getElementById("generatorStyle");
const generatorImageStyle = document.getElementById("generatorImageStyle");
const generatorType = document.getElementById("generatorType");

class OneByOneQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(item) {
    this.queue.push(item);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const currentItem = this.queue.shift();
    currentItem()
      .then(() => {
        this.processQueue();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        this.processQueue();
      });
  }
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 7000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

let editor;
function setUpEditor() {
  DecoupledEditor.create(document.querySelector("#editor"), {
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "fontColor",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "|",
      "alignment:left",
      "alignment:center",
      "alignment:right",
      "|",
      "imageUpload",
      "|",
      "insertTable",
      "pageBreak",
      "restrictedEditingException",
      "exportPdf",
    ],
    mention: {
      feeds: [
        {
          marker: "#",
          feed: [
            "#1.1",
            "#1.2",
            "#1.3",
            "#1.4",
            "#1.5",
            "#1.6",
            "#1.7",
            "#1.8",
            "#1.9",
          ],
          minimumCharacters: 1,
        },
      ],
    },
    image: {
      toolbar: [
        "imageStyle:alignLeft",
        "imageStyle:full",
        "imageStyle:alignRight",
      ],
      styles: ["full", "alignLeft", "alignRight"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    placeholder: "Trykk for å skrive...",
  })
    .then((newEditor) => {
      editor = newEditor;
      newEditor.ui.view.editable.element.style.height = "calc(100vh - 100px)"; // Adjust toolbar height if needed

      const toolbarContainer = document.querySelector("#toolbar-container");
      toolbarContainer.appendChild(newEditor.ui.view.toolbar.element);
    })
    .catch((error) => {
      console.error(error);
    });
}

function appendText(text) {
  const currentContent = editor.getData();

  const formattedResponse = text.replace(/\n/g, "<br>");

  // Append text to the existing content
  const appendedContent = currentContent + text;

  // Set the updated content in the editor
  editor.setData(appendedContent);
}
function toolStart() {
  $("#welcomeModal").modal("hide");
  $("#toolInput").modal("show");
}

function startOver() {
  $("#welcomeModal").modal("show");
  $("#toolInput").modal("hide");
}

function generateToc() {
  $("#toolInput").modal("hide");
  $("#loader").modal("show");
  document.getElementById("loaderMessage").innerHTML =
    "Genererer forslag til innholdsfortegnelse...";
  document.getElementById("log-container").innerHTML = "";

  const synopsis = bookSynopsis.value ? "Synopsis: " + bookSynopsis.value : " ";
  const systemPromp =
    "Du er en forfatter som skal skrive en " +
    generatorType.value +
    ". Skriv innholdsfortegnelsen. " +
    synopsis +
    ". Forfatter: " +
    bookWriter.value +
    ". Tittel: " +
    bookTitle.value +
    "Stil på teksten: " +
    generatorStyle.value +
    ".\n\nSvar med en punktliste med overskrifter. \n\n";
  const requestBody = {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 500,
    messages: [{ role: "system", content: systemPromp }],
  };

  fetch("completion/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer client-550e8400-e29b-41d4-a716-446655440000", // Replace with your own API key from server
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      $("#loader").modal("hide");
      $("#tocInput").modal("show");

      document.getElementById("tocArea").innerHTML = data;
    })
    .catch((err) => {
      console.log(
        "An error occurred while processing your request. Please try again later.",
        err
      );
    });
}

const queue = new OneByOneQueue();

function genereateBook() {
  $("#tocInput").modal("hide");
  $("#loader").modal("show");
  document.getElementById("loaderMessage").innerHTML =
    "Genererer første kapittel...";

  const tocArea = document.getElementById("tocArea").value;
  console.log;

  let n = 0;
  tocArea.split("\n").forEach((element) => {
    queue.enqueue(() =>
    generateContentImage(
      "A " +
        generatorImageStyle.value +
        " of " +
        element.trim() +
        " in " +
        bookTitle.value +
        " style. Made by: " +
        bookWriter.value
    )
  );
    queue.enqueue(() => generationRequest(element.trim()));
  });

  generateImage(
    "A " +
    generatorImageStyle.value +
    " in " +
    bookTitle.value +
    " style. Made by: " +
    bookWriter.value
  );
}

function generationRequest(part) {
  if (part) {
    document.getElementById("log-container").innerHTML +=
      part +
      ' <div class="spinner-border float-end spinner-border-sm" role="status"></div>' +
      "</div><br><hr>";

    const synopsis = bookSynopsis.value
      ? "Synopsis: " + bookSynopsis.value
      : " ";
    const prompt = "Skriv " + part + " av " + generatorType.value + "en.";
    const currentContent = editor.getData();

    const systemPromp =
      "Du skriver en" +
      generatorType.value +
      ". Synopsis: " +
      synopsis +
      ". " +
      "Forfatter: " +
      bookWriter.value +
      ". Tittel: " +
      bookTitle.value +
      "Stil på boken: " +
      generatorStyle.value +
      "Innholdsfortegnelse: " +
      tocArea.value +
      ".\n\n Svar med tekst formatert i HTML. \n\n";
    const requestBody = {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 7000,
      messages: [
        { role: "system", content: systemPromp },
        { role: "user", content: prompt },
      ],
    };

    return fetch("completion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer client-550e8400-e29b-41d4-a716-446655440000", /// Replace with your own API key from server
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        $("#loader").modal("hide");
        removeSpinners();
        appendText(data);
        resolve();
      })
      .catch((err) => {
        console.log(
          "An error occurred while processing your request. Please try again later."
        );
      });
  } else {
    resolve();
  }
}

var globalImageBase64 = null;
async function generateImage(text) {
  fetch("generation/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer client-550e8400-e29b-41d4-a716-446655440000", // Replace with your own API key from server
    },
    body: JSON.stringify({ prompt: text, response_format: "b64_json" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const imageData = data;
      globalImageBase64 = imageData;
    })
    .catch((err) => {
      console.log(
        "An error occurred while processing your request. Please try again later."
      );
    });
}

async function generateContentImage(text) {
  fetch("generation/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer client-550e8400-e29b-41d4-a716-446655440000", // Replace with your own API key from server
    },
    body: JSON.stringify({ prompt: text }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const imageData = data;
      let cssClass =
        Math.round(Math.random()) == 0
          ? "image-style-align-left"
          : "image-style-align-right";
      appendText(
        '<img src="' +
          imageData +
          '" style="width: 100%; border-radius: 11px" class="image ' +
          cssClass +
          'image_resized" alt="Illustrasjonsbilde">'
      );
      resolve();
    })
    .catch((err) => {
      console.log(
        "An error occurred while processing your request. Please try again later."
      );
    });
}

function removeSpinners() {
  var elements = document.getElementsByClassName("spinner-border-sm");

  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}
